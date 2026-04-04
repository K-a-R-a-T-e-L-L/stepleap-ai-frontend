"use client";

import { useCareerProfile } from "@/processes/providers/career";
import AiLoadingCard from "@/shared/ui/AiLoadingCard";
import { Focus, Goal } from "@/shared/lib/recommendation-engine";
import {
  Badge,
  Button,
  Card,
  Group,
  Progress,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function HomePage() {
  const router = useRouter();
  const {
    profile,
    setProfileField,
    profileReadyPercent,
    rankedTracks,
    onboardingSubmitted,
    setOnboardingSubmitted,
    isRecommendationsLoading,
    recommendationsSource,
    llmStatus,
    hasProfileData,
  } = useCareerProfile();
  const ageValue = Number(profile.age.trim());
  const isAgeValid =
    Boolean(profile.age.trim()) &&
    Number.isFinite(ageValue) &&
    ageValue > 0 &&
    ageValue < 100;

  const canContinue = useMemo(() => {
    const baseReady =
      isAgeValid &&
      Boolean(profile.education) &&
      Boolean(profile.goal) &&
      Boolean(profile.preference) &&
      Boolean(profile.teamStyle) &&
      Boolean(profile.rhythm);

    if (!baseReady) return false;
    return (
      Boolean(profile.hardSkills.trim()) &&
      Boolean(profile.softSkills.trim()) &&
      Boolean(profile.experience.trim())
    );
  }, [profile, isAgeValid]);

  return (
    <Stack gap={14}>
      <Title order={2} c="white">
        Персональный карьерный старт
      </Title>
      <Text c="rgba(223,231,255,0.8)">
        Профиль заполняется по шагам, рекомендации считаются по навыкам, опыту и цели.
      </Text>

      <Card radius="lg" p="md" style={{ background: "rgba(16, 24, 54, 0.78)", border: "1px solid rgba(170, 187, 245, 0.22)" }}>
        <Stack gap={10}>
          <Text fw={700} c="white">Онбординг + профиль навыков</Text>
          <Text c="rgba(196,214,255,0.75)" fz="sm">
            Добавь базовые данные, навыки и опыт. Рекомендации треков и вакансий генерируются под твой профиль.
          </Text>

          <TextInput
            label="Возраст"
            placeholder="Любой возраст (например, 27)"
            value={profile.age}
            onChange={(event) => setProfileField("age", event.currentTarget.value)}
            error={profile.age.trim() && !isAgeValid ? "Укажи возраст числом" : null}
          />

          <Select
            label="Образование"
            value={profile.education}
            onChange={(value) => setProfileField("education", value)}
            placeholder="Выбери уровень"
            data={[
              { value: "school", label: "Школа" },
              { value: "spo", label: "СПО" },
              { value: "vuz", label: "ВУЗ" },
              { value: "other", label: "Другое" },
            ]}
          />

          <Select
            label="Цель"
            value={profile.goal}
            onChange={(value) => setProfileField("goal", value as Goal | null)}
            placeholder="Что сейчас важнее"
            data={[
              { value: "part-time", label: "Подработка" },
              { value: "internship", label: "Стажировка" },
              { value: "first-job", label: "Первая работа" },
            ]}
          />

          <Select
            label="Предпочтения"
            value={profile.preference}
            onChange={(value) => setProfileField("preference", value as Focus | null)}
            placeholder="Что ближе"
            data={[
              { value: "people", label: "Люди" },
              { value: "data", label: "Данные" },
              { value: "tech", label: "Техника" },
            ]}
          />

          <Select
            label="Формат работы"
            value={profile.teamStyle}
            onChange={(value) => setProfileField("teamStyle", value)}
            placeholder="Команда или соло"
            data={[
              { value: "team", label: "Команда" },
              { value: "solo", label: "Соло" },
            ]}
          />

          <Select
            label="Темп"
            value={profile.rhythm}
            onChange={(value) => setProfileField("rhythm", value)}
            placeholder="Стабильность или динамика"
            data={[
              { value: "stable", label: "Стабильность" },
              { value: "dynamic", label: "Динамика" },
            ]}
          />

          <Textarea
            label="Hard skills"
            minRows={2}
            placeholder="Например: react, next.js, figma, postman"
            value={profile.hardSkills}
            onChange={(event) => setProfileField("hardSkills", event.currentTarget.value)}
          />

          <Textarea
            label="Soft skills"
            minRows={2}
            placeholder="Например: коммуникация, самоорганизация, системность"
            value={profile.softSkills}
            onChange={(event) => setProfileField("softSkills", event.currentTarget.value)}
          />

          <Textarea
            label="Опыт / проекты"
            minRows={3}
            placeholder="Опиши опыт: проекты, подработка, стажировки, коммерческие задачи"
            value={profile.experience}
            onChange={(event) => setProfileField("experience", event.currentTarget.value)}
          />

          <TextInput
            label="Вакансия, на которую ориентируешься"
            placeholder="Например: Junior Frontend Developer"
            value={profile.targetVacancy}
            onChange={(event) => setProfileField("targetVacancy", event.currentTarget.value)}
          />

          <Button
            onClick={() => {
              setOnboardingSubmitted(true);
            }}
            color="indigo"
            radius="md"
            disabled={!canContinue}
          >
            Продолжить
          </Button>
        </Stack>
      </Card>

      <Card radius="lg" p="md" style={{ background: "rgba(15, 27, 58, 0.78)", border: "1px solid rgba(166, 194, 250, 0.24)" }}>
        <Group justify="space-between" mb={8}>
          <Text fw={700} c="white">Готовность профиля</Text>
          <Text fw={700} c="white">{profileReadyPercent}%</Text>
        </Group>
        <Progress value={profileReadyPercent} color="cyan" size="md" radius="xl" />
      </Card>

      {onboardingSubmitted ? (
        <Stack gap={10}>
          {isRecommendationsLoading ? (
            <AiLoadingCard text="Подбираем персональные направления..." />
          ) : null}
          {llmStatus.error ? <AiLoadingCard text="ИИ временно занят, повторяем генерацию..." /> : null}
          {rankedTracks.map((track) => (
            <Card
              key={track.id}
              radius="lg"
              p="md"
              style={{ background: "rgba(14, 23, 52, 0.82)", border: "1px solid rgba(180, 197, 250, 0.22)" }}
            >
              <Group justify="space-between" mb={6}>
                <Text fw={700} c="white">{track.title}</Text>
                <Badge tt="lowercase" color="teal" variant="light">
                  {track.score}% fit
                </Badge>
              </Group>
              <Text size="sm" c="rgba(220,230,255,0.82)">{track.reason}</Text>
              <Text size="sm" c="rgba(164,255,225,0.84)" mt={6}>Ближайший горизонт: {track.eta}</Text>
            </Card>
          ))}
        </Stack>
      ) : null}
    </Stack>
  );
}
