"use client";

import { useAuthSession } from "@/processes/providers/AuthSessionProvider";
import { useCareerProfile } from "@/processes/providers/career";
import {
  useCareerControllerCompleteEpisode,
  useCareerControllerGetEpisodes,
} from "@/shared/api/.generated";
import AiLoadingCard from "@/shared/ui/AiLoadingCard";
import { Badge, Button, Card, Group, Progress, Stack, Text, Title } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type EpisodeView = {
  id: string;
  title: string;
  duration: string;
  status: string;
  description: string;
  nextAction: string;
  details: string;
  impact: string;
  completed: boolean;
  order: number;
  isCurrent: boolean;
};

export default function EpisodesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hashFromUrl = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
  const { accessToken } = useAuthSession();
  const { rankedTracks, hasProfileData, onboardingSubmitted, isRecommendationsLoading, llmStatus } = useCareerProfile();
  const requestedTrackId = searchParams.get("trackId");
  const topTrack = rankedTracks.find((item) => item.id === requestedTrackId) ?? rankedTracks[0];
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const episodesQuery = useCareerControllerGetEpisodes(
    { trackId: topTrack?.id },
    {
      query: { enabled: Boolean(topTrack && accessToken && hasProfileData) },
      client: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    }
  );

  const completeEpisode = useCareerControllerCompleteEpisode({
    client: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {},
    mutation: {
      onSuccess: (_, variables) => {
        const completedId = variables.data.episodeId;
        setCompletedIds((prev) => new Set(prev).add(completedId));
        setStatusMessage("Чекпоинт отмечен как выполненный.");
        episodesQuery.refetch();
      },
      onError: (error) => {
        const message =
          typeof error?.data === "object" &&
          error?.data &&
          "message" in error.data &&
          typeof (error.data as { message?: unknown }).message === "string"
            ? (error.data as { message: string }).message
            : "Не удалось отметить выполнение. Попробуй еще раз.";
        setStatusMessage(message);
      },
    },
  });

  const episodes = useMemo<EpisodeView[]>(() => {
    const raw = episodesQuery.data ?? [];
    return raw
      .map((item, index) => ({
        id: item.id,
        title: item.title,
        duration: item.duration,
        status: item.status,
        description: item.description,
        nextAction: item.nextAction,
        details: item.details ?? "Следуй инструкции шага и отметь выполнение.",
        impact: item.impact,
        completed: item.completed || completedIds.has(item.id),
        order: item.order ?? index + 1,
        isCurrent: Boolean(item.isCurrent),
      }))
      .sort((a, b) => a.order - b.order);
  }, [episodesQuery.data, completedIds]);

  const actionableOrder = useMemo(() => {
    const firstUnfinished = episodes.find((item) => !item.completed);
    return firstUnfinished?.order ?? null;
  }, [episodes]);

  useEffect(() => {
    if (!hashFromUrl) return;
    const element = document.getElementById(hashFromUrl);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [hashFromUrl, episodes.length]);

  const completedCount = episodes.filter((item) => item.completed).length;
  const progressPercent = episodes.length ? Math.round((completedCount / episodes.length) * 100) : 0;

  return (
    <Stack gap={14}>
      <Badge tt="lowercase" w="fit-content" color="pink" variant="light">
        episodes
      </Badge>
      <Title order={2} c="white">
        Чекпоинты по треку
      </Title>
      <Text c="rgba(223,231,255,0.8)">
        Выполняй шаги строго по хронологии: доступен только текущий чекпоинт.
      </Text>

      {!hasProfileData ? (
        <Card
          radius="lg"
          p="md"
          style={{
            background: "rgba(15, 26, 58, 0.8)",
            border: "1px solid rgba(166, 187, 246, 0.24)",
          }}
        >
          <Text c="rgba(212,225,255,0.82)">
            Сначала заполни профиль на главной. После этого появятся персональные чекпоинты.
          </Text>
          <Button mt={10} color="indigo" radius="md" onClick={() => router.push("/")}>
            Заполнить профиль
          </Button>
        </Card>
      ) : null}
      {onboardingSubmitted && isRecommendationsLoading ? (
        <AiLoadingCard text="Подготавливаем эпизоды под твой профиль..." />
      ) : null}
      {onboardingSubmitted && llmStatus.error ? <AiLoadingCard text="ИИ временно занят, обновляем эпизоды..." /> : null}

      {episodes.length > 0 ? (
        <Card
          radius="lg"
          p="md"
          style={{
            background: "rgba(14, 24, 56, 0.82)",
            border: "1px solid rgba(166, 187, 246, 0.24)",
          }}
        >
          <Group justify="space-between" mb={8}>
            <Text fw={700} c="white">
              Прогресс по чекпоинтам
            </Text>
            <Text fw={700} c="white">
              {completedCount}/{episodes.length}
            </Text>
          </Group>
          <Progress value={progressPercent} radius="xl" color="teal" />
          {statusMessage ? (
            <Text mt={8} size="sm" c="rgba(174,240,220,0.86)">
              {statusMessage}
            </Text>
          ) : null}
        </Card>
      ) : null}

      {episodesQuery.isLoading ? (
        <AiLoadingCard text="Загружаем чекпоинты..." />
      ) : null}

      {episodesQuery.isError ? <AiLoadingCard text="Повторно загружаем чекпоинты..." /> : null}

      {episodes.map((episode) => {
        const isActionable = !episode.completed && actionableOrder === episode.order;
        const actionDisabled = !episode.completed && !isActionable;
        return (
          <Card
            id={episode.id}
            key={episode.id}
            radius="lg"
            p="md"
            style={{
              background: "rgba(15, 26, 58, 0.8)",
              border:
                hashFromUrl === episode.id
                  ? "1px solid rgba(95, 253, 197, 0.8)"
                  : "1px solid rgba(166, 187, 246, 0.24)",
              opacity: actionDisabled ? 0.7 : 1,
            }}
          >
            <Group justify="space-between" mb={6}>
              <Text fw={700} c="white">
                {episode.order}. {episode.title}
              </Text>
              <Badge tt="lowercase" color={isActionable ? "teal" : episode.completed ? "green" : "blue"} variant="light">
                {episode.completed ? "завершен" : isActionable ? "текущий" : "доступно"}
              </Badge>
            </Group>
            <Text size="sm" c="rgba(212,225,255,0.82)">
              {episode.description}
            </Text>
            <Text size="sm" c="rgba(174,240,220,0.86)" mt={4}>
              <b>Что сделать:</b> {episode.nextAction}
            </Text>
            <Text size="sm" c="rgba(220,232,255,0.86)" mt={4}>
              <b>Подробнее:</b> {episode.details}
            </Text>
            <Text size="sm" c="rgba(201,218,255,0.72)">
              <b>Эффект:</b> {episode.impact}
            </Text>
            <Group mt={10}>
              <Button variant="light" color="indigo" radius="md" size="xs" onClick={() => router.push("/map")}>
                Открыть карту
              </Button>
              <Button
                color="teal"
                radius="md"
                size="xs"
                loading={completeEpisode.isPending}
                disabled={actionDisabled}
                onClick={() =>
                  completeEpisode.mutate({
                    data: {
                      episodeId: episode.id,
                      trackId: topTrack?.id ?? null,
                    },
                  })
                }
              >
                {episode.completed ? "Завершено" : isActionable ? "Отметить выполнение" : "Доступно после текущего шага"}
              </Button>
            </Group>
          </Card>
        );
      })}
    </Stack>
  );
}
