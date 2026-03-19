//use server is required
'use server';

import { cookies } from 'next/headers';

import { defaultLocale, isLocale } from './config';
import type { Locale } from './types';

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
const COOKIE_NAME = 'NEXT_LOCALE';

const getLocale = async () => {
  const savedLocale = (await cookies()).get(COOKIE_NAME)?.value;
  return savedLocale && isLocale(savedLocale) ? savedLocale : defaultLocale;
};

const setLocale = async (locale?: string) => {
  const nextLocale = locale && isLocale(locale) ? locale : defaultLocale;
  (await cookies()).set(COOKIE_NAME, nextLocale);
};

export { getLocale, setLocale };
