# Telegram Mini App Starter

English version: [README.md](./README.md)

Подробный стартовый шаблон для разработки Telegram Mini Apps на Next.js App Router с TypeScript, i18n, генерацией API-клиента и чистой слоистой архитектурой.

## Зачем этот шаблон

Репозиторий собран так, чтобы быстро стартовать новый продукт и не тратить время на базовую инфраструктуру:

- фундамент на Next.js 15 App Router
- интеграция Telegram Mini App SDK + мок-режим для браузера
- локализация через `next-intl` (есть примеры EN/RU)
- генерация API-клиента и React Query hooks из OpenAPI через Kubb
- слоистая структура (`app`, `processes`, `widgets`, `shared`)
- готовые примерные маршруты: `/`, `/about`, `/settings`

## Технологии

Базовые:

- [Next.js 15](https://nextjs.org/) (App Router)
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)

UI:

- [Mantine](https://mantine.dev/) (`@mantine/core`, `@mantine/hooks`, `@mantine/form`)
- [Tabler Icons](https://tabler-icons.io/)
- `normalize.css`

Telegram:

- [@tma.js/sdk-react](https://docs.telegram-mini-apps.com/packages/tma-js-sdk-react)
- [@tma.js/bridge](https://docs.telegram-mini-apps.com/packages/tma-js-bridge)
- [@tma.js/types](https://docs.telegram-mini-apps.com/packages/tma-js-types)
- [@tma.js/transformers](https://docs.telegram-mini-apps.com/packages/tma-js-transformers)

Data + API:

- [TanStack Query](https://tanstack.com/query/latest)
- [Kubb](https://kubb.dev/) (`@kubb/core`, `@kubb/plugin-*`)

Локализация:

- [next-intl](https://next-intl.dev/)

Качество:

- ESLint (конфиг Next.js)

## Установка

```bash
npm install
```

## Переменные окружения

Скопируй `.env.example` в `.env` и задай значения.

```bash
cp .env.example .env
```

Переменные:

- `NEXT_PUBLIC_API_URL`: базовый URL для runtime-запросов API
- `API_DOCS_URL`: удалённый OpenAPI endpoint (используется при `OPENAPI_PATH=remote`)
- `OPENAPI_PATH`: источник OpenAPI для генерации

Варианты `OPENAPI_PATH`:

- `./openapi.json` (локальная схема по умолчанию)
- `remote` (схема берётся с `API_DOCS_URL` с cache-buster)

## Скрипты

- `npm run dev`: запуск dev-сервера (`http://localhost:3000`)
- `npm run dev:https`: запуск dev-сервера по HTTPS
- `npm run build`: production-сборка
- `npm run start`: запуск production-сервера
- `npm run lint`: проверка линтером
- `npm run generate`: генерация API-клиента/хуков из OpenAPI (Kubb)

## Быстрый старт

1. Установи зависимости:

```bash
npm install
```

2. Настрой окружение:

```bash
cp .env.example .env
```

3. Сгенерируй API слой:

```bash
npm run generate
```

4. Запусти приложение:

```bash
npm run dev
```

5. Открой `http://localhost:3000`

## Запуск внутри Telegram

Для полноценной проверки нужен HTTPS URL в настройках Mini App у BotFather.

Локальный вариант:

```bash
npm run dev:https
```

## Архитектура

Основные слои:

- `src/app`: роутинг Next.js, layouts, route groups
- `src/processes`: провайдеры и process-уровень
- `src/widgets`: композитные UI-блоки и страницы
- `src/shared`: общая инфраструктура (api, i18n, ui, lib)

Текущие маршруты:

- `/` -> пример Home-страницы
- `/about` -> пример About-страницы
- `/settings` -> пример Settings-страницы

## Локализация (i18n)

Файлы переводов:

- `public/locales/en.json`
- `public/locales/ru.json`

Конфиг локализации:

- `src/shared/lib/i18n/config.ts`
- `src/shared/lib/i18n/i18n.ts`
- `src/shared/lib/i18n/provider.tsx`
- `src/shared/lib/i18n/locale.ts`

Путь к `next-intl` request config задаётся в `next.config.ts`.

## API и генерация кода

Ручной HTTP-клиент:

- `src/shared/api/client.ts`

Сгенерированные артефакты:

- `src/shared/api/.generated`

Конфигурация Kubb:

- `kubb.config.ts`

Пайплайн генерации:

1. Определение источника OpenAPI (`OPENAPI_PATH` / `API_DOCS_URL`)
2. Генерация типов
3. Генерация fetch-клиентов
4. Генерация React Query hooks

## Инициализация Telegram SDK

Точка входа client instrumentation:

- `src/instrumentation-client.ts`

Runtime init и мок-помощники:

- `src/shared/lib/init.ts`
- `src/shared/lib/mockEnv.ts`

Такой подход позволяет комфортно разрабатывать и в Telegram, и в обычном браузере.