"use client";

import { useAuthSession } from "@/processes/providers/AuthSessionProvider";
import { useCareerProfile } from "@/processes/providers/career";
import { useCareerControllerGetEpisodes } from "@/shared/api/.generated";
import AiLoadingCard from "@/shared/ui/AiLoadingCard";
import { Badge, Button, Card, Group, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type CheckpointPhase = "done" | "current" | "pending";

type EpisodeView = {
  id: string;
  title: string;
  description: string;
  order: number;
  status: string;
  completed: boolean;
  phase: CheckpointPhase;
  phaseLabel: string;
};

const MIN_CANVAS_WIDTH = 320;

function wrapTextToLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = word;
  }

  if (line) lines.push(line);
  return lines.length ? lines : [text];
}

export default function MapPage() {
  const router = useRouter();
  const { accessToken } = useAuthSession();
  const { rankedTracks, hasProfileData, onboardingSubmitted, isRecommendationsLoading, llmStatus } =
    useCareerProfile();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(rankedTracks[0]?.id ?? null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(520);

  const selectedTrack = useMemo(
    () => rankedTracks.find((item) => item.id === selectedTrackId) ?? rankedTracks[0],
    [rankedTracks, selectedTrackId]
  );

  useEffect(() => {
    if (!selectedTrackId && rankedTracks[0]?.id) {
      setSelectedTrackId(rankedTracks[0].id);
      return;
    }
    if (selectedTrackId && !rankedTracks.some((item) => item.id === selectedTrackId)) {
      setSelectedTrackId(rankedTracks[0]?.id ?? null);
    }
  }, [rankedTracks, selectedTrackId]);

  const episodesQuery = useCareerControllerGetEpisodes(
    { trackId: selectedTrack?.id },
    {
      query: { enabled: Boolean(accessToken && selectedTrack?.id && hasProfileData) },
      client: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    }
  );

  const checkpoints = useMemo<EpisodeView[]>(() => {
    const raw = (episodesQuery.data ?? [])
      .map((item, index) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        order: item.order ?? index + 1,
        status: item.status,
        completed: Boolean(item.completed) || item.status === "завершен",
      }))
      .sort((a, b) => a.order - b.order);

    const firstPendingIndex = raw.findIndex((item) => !item.completed);

    return raw.map((item, index) => {
      const phase: CheckpointPhase = item.completed
        ? "done"
        : firstPendingIndex === -1
          ? index === raw.length - 1
            ? "current"
            : "pending"
          : index === firstPendingIndex
            ? "current"
            : "pending";

      const phaseLabel =
        phase === "done" ? "пройден" : phase === "current" ? "текущий" : "не пройден";

      return {
        ...item,
        phase,
        phaseLabel,
      };
    });
  }, [episodesQuery.data]);

  useEffect(() => {
    const container = canvasWrapRef.current;
    if (!container) return;
    const updateWidth = () => {
      const next = Math.max(MIN_CANVAS_WIDTH, Math.floor(container.clientWidth) - 8);
      setCanvasWidth(next);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || checkpoints.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvasWidth;
    const leftX = 24;
    const textX = 42;
    const topPadding = 18;
    const bottomPadding = 16;
    const pointGap = 18;
    const lineHeight = 18;
    const textMaxWidth = width - textX - 14;

    ctx.font = "600 15px sans-serif";
    const lineMap = checkpoints.map((cp) =>
      wrapTextToLines(ctx, `${cp.order}. ${cp.title}`, textMaxWidth).slice(0, 3)
    );
    const blockHeights = lineMap.map((lines) => lines.length * lineHeight);
    const contentHeight = blockHeights.reduce((acc, current) => acc + current, 0) + pointGap * Math.max(0, checkpoints.length - 1);
    const height = topPadding + contentHeight + bottomPadding;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#0c1737";
    ctx.fillRect(0, 0, width, height);

    let y = topPadding;
    const pointsY: number[] = [];
    for (let i = 0; i < checkpoints.length; i += 1) {
      const lines = lineMap[i];
      const blockHeight = blockHeights[i];
      const pointY = y + 2;
      pointsY.push(pointY);

      const cp = checkpoints[i];
      ctx.fillStyle = cp.phase === "done" ? "#82ffa9" : cp.phase === "current" ? "#5ffdc5" : "#8bb7ff";
      ctx.beginPath();
      ctx.arc(leftX, pointY, cp.phase === "current" ? 6 : 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#d6e4ff";
      ctx.font = "600 15px sans-serif";
      lines.forEach((line, lineIndex) => {
        ctx.fillText(line, textX, y + lineIndex * lineHeight + 4);
      });

      y += blockHeight + pointGap;
    }

    if (pointsY.length > 1) {
      ctx.strokeStyle = "#7dc0ff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(leftX, pointsY[0]);
      ctx.lineTo(leftX, pointsY[pointsY.length - 1]);
      ctx.stroke();
    }
  }, [checkpoints, canvasWidth]);

  return (
    <Stack gap={14}>
      <Badge tt="lowercase" w="fit-content" color="indigo" variant="light">
        career map
      </Badge>
      <Title order={2} c="white">
        Карта по треку: что делать по шагам
      </Title>
      <Text c="rgba(223,231,255,0.8)">
        В карте отображаются checkpoint&apos;ы по хронологии: от текущей точки до целевой роли.
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
          <Text c="rgba(212,225,255,0.82)">Сначала заполни профиль. Тогда AI соберет треки и их checkpoint&apos;ы.</Text>
          <Button mt={10} radius="md" color="indigo" onClick={() => router.push("/")}>
            Заполнить профиль
          </Button>
        </Card>
      ) : null}

      {onboardingSubmitted && isRecommendationsLoading ? <AiLoadingCard text="Формируем треки для карты..." /> : null}
      {onboardingSubmitted && llmStatus.error ? <AiLoadingCard text="ИИ временно занят, обновляем карту..." /> : null}

      <Card
        radius="lg"
        p="md"
        style={{
          background: "rgba(16, 27, 60, 0.82)",
          border: "1px solid rgba(161, 190, 255, 0.24)",
        }}
      >
        <Group justify="space-between" mb={8}>
          <Text fw={700} c="white">
            Выбранный трек
          </Text>
        </Group>
        <ScrollArea type="never" offsetScrollbars>
          <Group gap={8} wrap="wrap">
            {rankedTracks.map((track) => {
              const isActive = track.id === selectedTrackId;
              return (
                <Button
                  key={track.id}
                  size="compact-xs"
                  radius="md"
                  variant={isActive ? "filled" : "light"}
                  color={isActive ? "cyan" : "gray"}
                  onClick={() => setSelectedTrackId(track.id)}
                  style={{
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    height: "auto",
                    minHeight: "28px",
                    lineHeight: 1.3,
                    paddingBlock: "4px",
                  }}
                >
                  {track.title}
                </Button>
              );
            })}
          </Group>
        </ScrollArea>
      </Card>

      {checkpoints.length > 0 ? (
        <Card
          radius="lg"
          p="md"
          style={{
            background: "rgba(13, 21, 48, 0.8)",
            border: "1px solid rgba(174, 196, 252, 0.2)",
          }}
        >
          <div ref={canvasWrapRef}>
            <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 12 }} />
          </div>
        </Card>
      ) : null}

      {episodesQuery.isLoading ? <AiLoadingCard text="Генерируем карту checkpoint’ов..." /> : null}
      {episodesQuery.isError ? <AiLoadingCard text="Повторно загружаем карту checkpoint’ов..." /> : null}

      {checkpoints.map((cp) => (
        <Card
          key={cp.id}
          radius="lg"
          p="md"
          style={{
            background: "rgba(13, 21, 48, 0.8)",
            border: "1px solid rgba(174, 196, 252, 0.2)",
          }}
        >
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Text fw={700} c="white">
                {cp.order}. {cp.title}
              </Text>
              <Text size="sm" c="rgba(215,227,255,0.8)">
                {cp.description}
              </Text>
            </Stack>
            <Badge
              tt="lowercase"
              color={cp.phase === "done" ? "green" : cp.phase === "current" ? "teal" : "gray"}
              variant="light"
            >
              {cp.phaseLabel}
            </Badge>
          </Group>
          <Button mt={10} radius="md" color="indigo" onClick={() => router.push(`/episodes?trackId=${selectedTrack?.id}#${cp.id}`)}>
            Подробнее
          </Button>
        </Card>
      ))}
    </Stack>
  );
}
