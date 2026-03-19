"use client";

import { Group, UnstyledButton } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/settings", key: "settings" },
] as const;

export default function AppNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Group gap={8} wrap="nowrap">
      {navItems.map((item) => {
        const active = pathname === item.href;

        return (
          <UnstyledButton
            key={item.href}
            onClick={() => router.push(item.href)}
            px={10}
            py={6}
            style={{
              borderRadius: 8,
              fontSize: 14,
              background: active ? "rgba(255, 255, 255, 0.14)" : "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            {t(item.key)}
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
