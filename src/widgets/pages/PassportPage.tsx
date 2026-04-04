"use client";

import { useCareerProfile } from "@/processes/providers/career";
import AiLoadingCard from "@/shared/ui/AiLoadingCard";
import { Badge, Button, Card, Group, Progress, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/navigation";

const educationLabels: Record<string, string> = {
  school: "Школа",
  spo: "СПО",
  vuz: "ВУЗ",
  other: "Другое",
};

const goalLabels: Record<string, string> = {
  "part-time": "Подработка",
  internship: "Стажировка",
  "first-job": "Первая работа",
};

export default function PassportPage() {
  const router = useRouter();
  const {
    profile,
    rankedTracks,
    profileReadyPercent,
    nearestRole,
    dynamicSkills,
    recommendationsSource,
    hasProfileData,
    onboardingSubmitted,
    isRecommendationsLoading,
    llmStatus,
  } = useCareerProfile();
  const topTrack = rankedTracks[0];

  return (
    <Stack gap={14}>
      <Badge tt="lowercase" w="fit-content" color="grape" variant="light">
        Skill Passport
      </Badge>
      <Title order={2} c="white">
        Кто я сейчас и чем уже могу подтверждать навыки
      </Title>
      <Text c="rgba(223,231,255,0.8)">
        Паспорт строится на данных онбординга и автоматически обновляется после отметки выполненных эпизодов.
      </Text>

      <Card radius="lg" p="md" style={{ background: "rgba(18, 26, 58, 0.8)", border: "1px solid rgba(157, 183, 252, 0.24)" }}>
        <Group gap={8}>
          <Badge tt="lowercase" color="blue" variant="light">Возраст: {profile.age || "не указан"}</Badge>
          <Badge tt="lowercase" color="blue" variant="light">
            Образование: {profile.education ? educationLabels[profile.education] ?? profile.education : "не указано"}
          </Badge>
          <Badge tt="lowercase" color="blue" variant="light">
            Цель: {profile.goal ? goalLabels[profile.goal] ?? profile.goal : "не указана"}
          </Badge>
          <Badge tt="lowercase" color="blue" variant="light">
            Целевая вакансия: {profile.targetVacancy?.trim() || "не указана"}
          </Badge>
        </Group>
        <Group gap={8} mt={8}>
          <Badge tt="lowercase" color="cyan" variant="outline">Роль рядом: {hasProfileData ? nearestRole : "определится после анкеты"}</Badge>
          <Badge tt="lowercase" color="cyan" variant="outline">Готовность: {profileReadyPercent}%</Badge>
          {hasProfileData && topTrack ? (
            <Badge tt="lowercase" color="grape" variant="outline">Трек: {topTrack.title}</Badge>
          ) : null}
        </Group>
      </Card>

      {!hasProfileData ? (
        <Card radius="lg" p="md" style={{ background: "rgba(16, 33, 62, 0.78)", border: "1px solid rgba(146, 214, 194, 0.26)" }}>
          <Title order={4} c="white" mb={8}>Профиль еще пустой</Title>
          <Text c="rgba(220,230,255,0.84)">
            Заполни онбординг на главной странице, чтобы увидеть реальные AI-рекомендации, навыки и треки.
          </Text>
          <Button mt={12} color="indigo" radius="md" onClick={() => router.push("/")}>
            Перейти к заполнению анкеты
          </Button>
        </Card>
      ) : (
        <>
      {onboardingSubmitted && isRecommendationsLoading ? (
        <AiLoadingCard text="Генерируем skill passport..." />
      ) : null}
      {onboardingSubmitted && llmStatus.error ? <AiLoadingCard text="ИИ временно занят, обновляем passport..." /> : null}
      <Card radius="lg" p="md" style={{ background: "rgba(16, 33, 62, 0.78)", border: "1px solid rgba(146, 214, 194, 0.26)" }}>
        <Group justify="space-between" mb={8}>
          <Title order={4} c="white">Soft skills</Title>
        </Group>
        <Stack gap={8}>
          {dynamicSkills.soft.slice(0, 3).map((skill, index) => (
            <Stack gap={4} key={`${skill.name}-${index}`}>
              <Text size="sm" c="rgba(220,230,255,0.84)">{skill.name}</Text>
              <Progress value={skill.value} color="teal" radius="xl" />
              <Text size="xs" c="rgba(198,219,255,0.7)">{skill.reason}</Text>
            </Stack>
          ))}
        </Stack>
      </Card>

      <Card radius="lg" p="md" style={{ background: "rgba(22, 31, 66, 0.78)", border: "1px solid rgba(238, 194, 120, 0.26)" }}>
        <Group justify="space-between" mb={8}>
          <Title order={4} c="white">Hard skills</Title>
        </Group>
        <Stack gap={8}>
          {dynamicSkills.hard.slice(0, 3).map((skill, index) => (
            <Stack gap={4} key={`${skill.name}-${index}`}>
              <Text size="sm" c="rgba(220,230,255,0.84)">{skill.name}</Text>
              <Progress value={skill.value} color="yellow" radius="xl" />
              <Text size="xs" c="rgba(198,219,255,0.7)">{skill.reason}</Text>
            </Stack>
          ))}
        </Stack>
      </Card>

      {rankedTracks.length > 0 ? (
        <Card radius="lg" p="md" style={{ background: "rgba(14, 23, 52, 0.82)", border: "1px solid rgba(180, 197, 250, 0.22)" }}>
          <Title order={4} c="white" mb={8}>Топ направления из AI-скоринга</Title>
          <Stack gap={10}>
            {rankedTracks.map((track, index) => (
              <Text key={track.id} c="rgba(218,230,255,0.82)">
                {index + 1}. {track.title} ({track.score}% fit): {track.reason}
              </Text>
            ))}
          </Stack>
        </Card>
      ) : null}
      </>
      )}

      <Button color="indigo" radius="md" onClick={() => router.push("/map")}>Перейти к Карте пути</Button>
    </Stack>
  );
}
