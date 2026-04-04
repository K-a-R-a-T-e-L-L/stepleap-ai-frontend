"use client";

import { Group, UnstyledButton } from "@mantine/core";
import {
  IconBriefcase2,
  IconHome2,
  IconMap2,
  IconMovie,
  IconProps,
  IconUserHexagon,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { ComponentType, ForwardRefExoticComponent, RefAttributes } from "react";

const navItems: {
  href: string;
  label: string;
  icon: ForwardRefExoticComponent<IconProps & RefAttributes<SVGSVGElement>>;
}[] = [
  { href: "/", label: "Главная", icon: IconHome2 },
  { href: "/passport", label: "Паспорт", icon: IconUserHexagon },
  { href: "/map", label: "Карта", icon: IconMap2 },
  { href: "/episodes", label: "Эпизоды", icon: IconMovie },
  { href: "/vacancy", label: "Вакансии", icon: IconBriefcase2 },
];

export default function AppNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Group
      gap={8}
      wrap="nowrap"
      style={{
        position: "fixed",
        bottom: 10,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(560px, calc(100vw - 20px))",
        borderRadius: 20,
        padding: 8,
        border: "1px solid rgba(178, 200, 255, 0.24)",
        background: "rgba(8, 13, 31, 0.84)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 14px 36px rgba(2, 6, 20, 0.7)",
        zIndex: 20,
      }}
    >
      {navItems.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;

        return (
          <UnstyledButton
            key={item.href}
            onClick={() => router.push(item.href)}
            px={8}
            py={6}
            style={{
              borderRadius: 14,
              fontSize: 11,
              flex: 1,
              minWidth: 0,
              textAlign: "center",
              color: active ? "#f3f7ff" : "rgba(193, 207, 240, 0.88)",
              background: active
                ? "linear-gradient(180deg, rgba(117, 176, 255, 0.32), rgba(110, 254, 210, 0.12))"
                : "transparent",
              border: active
                ? "1px solid rgba(162, 213, 255, 0.48)"
                : "1px solid transparent",
            }}
          >
            <Icon size={16} stroke={1.8} />
            <div>{item.label}</div>
          </UnstyledButton>
        );
      })}
    </Group>
  );
}
