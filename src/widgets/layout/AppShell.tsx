"use client";

import { useAuthSession } from "@/processes/providers/AuthSessionProvider";
import { useCareerProfile } from "@/processes/providers/career";
import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { ReactNode } from "react";
import AppNav from "@/widgets/navigation/AppNav";

export default function AppShell({ children }: { children: ReactNode }) {
  const { user, isAuthenticating, isUserLoading, authError } = useAuthSession();
  const { profileReadyPercent, nearestRole, llmStatus, hasProfileData } = useCareerProfile();

  return (
    <Stack w="100%" maw={560} gap={12} pb={84}>
      <Paper
        p={14}
        radius={18}
        style={{
          border: "1px solid rgba(162, 183, 255, 0.26)",
          background:
            "radial-gradient(180px 120px at 20% 0%, rgba(117, 192, 255, 0.2), transparent 70%), radial-gradient(220px 180px at 100% 10%, rgba(95, 253, 197, 0.14), transparent 72%), rgba(8, 14, 35, 0.82)",
          boxShadow: "0 14px 48px rgba(4, 8, 20, 0.55)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Box>
            <Title order={3} fw={700} c="white">
              StepLeap AI
            </Title>
            <Text fz="sm" c="rgba(228,236,255,0.72)">
              Карьерный трек для старта, смены и усиления роли
            </Text>
          </Box>
        </Group>

        <Text mt={10} fz="sm" c="rgba(198,214,255,0.82)">
          Профиль: {profileReadyPercent}%
          {hasProfileData ? ` · Ближайшая роль: ${nearestRole}` : ""}
          {isAuthenticating || isUserLoading ? " · Авторизация..." : authError ? " · Нет сессии" : user ? "" : ""}
        </Text>
        {hasProfileData && llmStatus.error && !llmStatus.used ? (
          <Text mt={6} fz="xs" c="rgba(255,179,179,0.9)">
            AI временно недоступен, используем fallback.
          </Text>
        ) : null}
        {hasProfileData && llmStatus.error && llmStatus.used ? (
          <Text mt={6} fz="xs" c="rgba(255,231,174,0.95)">
            AI частично применен, часть расчета выполнена локально.
          </Text>
        ) : null}
      </Paper>

      <Paper
        p={14}
        radius={18}
        style={{
          border: "1px solid rgba(181, 197, 255, 0.2)",
          background: "rgba(11, 17, 40, 0.78)",
          boxShadow: "0 18px 44px rgba(3, 8, 22, 0.42)",
          backdropFilter: "blur(8px)",
          minHeight: "62vh",
        }}
      >
        {children}
      </Paper>

      <AppNav />
    </Stack>
  );
}
