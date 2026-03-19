"use client";

import { Box, Group, Stack, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";

import { LocaleSwitcher } from "@/shared/ui/LocaleSwitcher";
import AppNav from "@/widgets/navigation/AppNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const tCommon = useTranslations("common");

  return (
    <Stack w="100%" maw={560} gap={16}>
      <Box
        px={14}
        py={12}
        style={{
          borderRadius: 14,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(0, 0, 0, 0.35)",
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Box>
            <Title order={3} fw={700} c="white">
              {tCommon("appName")}
            </Title>
            <Text fz="sm" c="dimmed">
              {tCommon("subtitle")}
            </Text>
          </Box>
          <LocaleSwitcher />
        </Group>
        <Group mt={12}>
          <AppNav />
        </Group>
      </Box>

      <Box
        px={14}
        py={16}
        style={{
          borderRadius: 14,
          border: "1px solid rgba(255, 255, 255, 0.15)",
          background: "rgba(0, 0, 0, 0.25)",
        }}
      >
        {children}
      </Box>
    </Stack>
  );
}
