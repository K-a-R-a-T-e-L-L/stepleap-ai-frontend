import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale } from './config';
import { getLocale } from './locale';
import type { Locale } from './types';

const i18nRequestConfig = getRequestConfig(async () => {
  const requestedLocale = await getLocale();
  const locale = (isLocale(requestedLocale) ? requestedLocale : defaultLocale) as Locale;

  return {
    locale,
    messages:
      locale === defaultLocale
        ? (await import(`@public/locales/${defaultLocale}.json`)).default
        : (await import(`@public/locales/${locale}.json`)).default,
  };
});

export default i18nRequestConfig;
