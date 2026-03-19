export const defaultLocale = "en";

export const timeZone = "UTC";

export const locales = [defaultLocale, "ru"] as const;

export const localesMap = [
  { key: "en", title: "English" },
  { key: "ru", title: "Русский" },
] as const;

export const isLocale = (value: string): value is (typeof locales)[number] =>
  locales.includes(value as (typeof locales)[number]);
