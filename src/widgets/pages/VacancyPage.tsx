"use client";

import { useAuthSession } from "@/processes/providers/AuthSessionProvider";
import {
  useCareerControllerGetVacancies,
} from "@/shared/api/.generated";
import { useCareerProfile } from "@/processes/providers/career";
import AiLoadingCard from "@/shared/ui/AiLoadingCard";
import { Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function VacancyPage() {
  const router = useRouter();
  const { accessToken } = useAuthSession();
  const { rankedTracks, onboardingSubmitted, isRecommendationsLoading, llmStatus } = useCareerProfile();
  const topTrack = rankedTracks[0];

  const vacanciesQuery = useCareerControllerGetVacancies(
    { trackId: topTrack?.id },
    {
      query: { enabled: Boolean(topTrack && accessToken && onboardingSubmitted) },
      client: accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {},
    }
  );

  const vacancyItems = useMemo(() => vacanciesQuery.data ?? [], [vacanciesQuery.data]);
  const vacancyCards = useMemo(
    () =>
      vacancyItems.map((vacancy) => {
        const planSteps = vacancy.plan
          .split(/\s(?=\d\))/)
          .map((step) => step.trim())
          .filter(Boolean);
        return { vacancy, planSteps };
      }),
    [vacancyItems]
  );

  return (
    <Stack gap={14}>
      <Badge tt="lowercase" w="fit-content" color="cyan" variant="light">Vacancy Matching</Badge>
      <Title order={2} c="white">Вакансии с объяснимым match и планом закрытия разрыва</Title>
      <Text c="rgba(223,231,255,0.8)">
        Лента вакансий формируется из AI-рейтинга направлений и обновляется после каждого эпизода.
      </Text>
      {!onboardingSubmitted ? (
        <Card radius="lg" p="md" style={{ background: "rgba(15, 24, 56, 0.8)", border: "1px solid rgba(165, 189, 250, 0.24)" }}>
          <Text c="rgba(220,232,255,0.82)">Сначала заполни анкету и нажми «Продолжить», после этого загрузятся персональные вакансии.</Text>
          <Button mt={10} radius="md" color="indigo" onClick={() => router.push("/")}>Перейти к анкете</Button>
        </Card>
      ) : null}
      {onboardingSubmitted && isRecommendationsLoading ? (
        <AiLoadingCard text="Подбираем вакансии под твой профиль..." />
      ) : null}
      {onboardingSubmitted && llmStatus.error ? <AiLoadingCard text="ИИ временно занят, подбираем вакансии..." /> : null}

      {vacanciesQuery.isLoading ? (
        <AiLoadingCard text="Загружаем вакансии..." />
      ) : null}

      {vacanciesQuery.isError ? <AiLoadingCard text="Повторно загружаем вакансии..." /> : null}

      {!vacanciesQuery.isLoading && !vacanciesQuery.isError && vacancyCards.length === 0 ? (
        <Card radius="lg" p="md" style={{ background: "rgba(15, 24, 56, 0.8)", border: "1px solid rgba(165, 189, 250, 0.24)" }}>
          <Text c="rgba(220,232,255,0.82)">Пока нет релевантных вакансий. Заполни профиль глубже или смени трек.</Text>
        </Card>
      ) : null}

      {vacancyCards.map(({ vacancy, planSteps }) => (
        <Card key={vacancy.id} radius="lg" p="md" style={{ background: "rgba(15, 24, 56, 0.8)", border: "1px solid rgba(165, 189, 250, 0.24)" }}>
          <Group justify="space-between" align="flex-start" mb={8}>
            <Stack gap={2}>
              <Text fw={700} c="white">{vacancy.title}</Text>
              <Text size="sm" c="rgba(207,221,255,0.75)">{vacancy.mode}</Text>
            </Stack>
            <Badge tt="lowercase" color="teal" variant="light">{vacancy.match}% match</Badge>
          </Group>
          <Stack gap={4}>
            <Text size="sm" c="rgba(220,232,255,0.82)"><b>Совпадает:</b> {vacancy.matchReason}</Text>
            <Text size="sm" c="rgba(220,232,255,0.82)"><b>Разрыв:</b> {vacancy.gap}</Text>
            <Text size="sm" c="rgba(198,255,232,0.88)"><b>План:</b></Text>
            {planSteps.map((step) => (
              <Text key={`${vacancy.id}-${step}`} size="sm" c="rgba(198,255,232,0.88)">
                {step}
              </Text>
            ))}
          </Stack>
          <Group mt={10}>
            <Button radius="md" size="xs" color="indigo" variant="light" onClick={() => router.push("/episodes")}>
              Закрыть gap через эпизод
            </Button>
            {vacancy.applyUrl || vacancy.sourceUrl ? (
              <Button
                component="a"
                href={vacancy.applyUrl || vacancy.sourceUrl || "#"}
                target="_blank"
                rel="noreferrer"
                radius="md"
                size="xs"
                color="teal"
              >
                Открыть вакансию
              </Button>
            ) : (
              <Button radius="md" size="xs" color="teal" onClick={() => router.push("/passport")}>
                Обновить навыки
              </Button>
            )}
          </Group>
        </Card>
      ))}

      <Button color="grape" radius="md" onClick={() => router.push("/")}>Обновить профиль <br /> и пересчитать рекомендации</Button>
    </Stack>
  );
}
