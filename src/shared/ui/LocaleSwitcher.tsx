"use client";

import { Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { FC } from "react";

import { localesMap } from "@/shared/lib/i18n/config";
import { setLocale } from "@/shared/lib/i18n/locale";
import { Locale } from "@/shared/lib/i18n/types";

export const LocaleSwitcher: FC = () => {
  const locale = useLocale();
  const router = useRouter();

  const onChange = async (value: string | null) => {
    if (value) {
      const locale = value as Locale;
      await setLocale(locale);
      router.refresh();
    }
  };

  return (
    <Select
      value={locale}
      w="60px"
      p="0"
      onChange={onChange}
      data={localesMap.map((locale) => ({
        value: locale.key,
        label: locale.title === "English" ? "En" : "Ru",
      }))}
      styles={{
        input: {
          background: "rgba(238, 130, 238, 0.1)",
          fontSize: "14px",
          padding: "10px",
          paddingBottom: "13px",
        },
        dropdown: {
          maxHeight: 200,
          overflowY: "auto",
        },
      }}
    />
  );
};
