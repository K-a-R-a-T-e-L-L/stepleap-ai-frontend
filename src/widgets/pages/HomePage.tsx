"use client";

import { Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <Stack gap={10}>
      <Title order={2}>{t("title")}</Title>
      <Text c="dimmed">{t("description")}</Text>
    </Stack>
  );
}
