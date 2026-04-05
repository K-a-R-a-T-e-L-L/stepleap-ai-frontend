# StepLeap AI Frontend

Telegram Mini App frontend for personalized career navigation: onboarding, skill passport, career map, episodes, and vacancy matching.

<details open>
<summary><strong>Русский</strong></summary>

## О проекте

`stepleap-ai-frontend` — клиентская часть StepLeap AI (Telegram Mini App).

Приложение помогает пользователю пройти путь:

1. Заполнить анкету и профиль навыков.
2. Получить персональные рекомендации по карьерным трекам.
3. Видеть карту шагов (checkpoints) по выбранному треку.
4. Выполнять эпизоды по хронологии.
5. Смотреть релевантные вакансии с матчингом.

## Основные возможности

- Telegram Mini App UX (адаптив под мобайл)
- Онбординг и редактирование профиля
- Паспорт навыков (soft/hard skills, готовность профиля)
- Карта карьерного трека с checkpoint-логикой
- Эпизоды с последовательным выполнением шагов
- Вакансии из внешнего фида + матчинг от backend
- Работа с backend через OpenAPI-генерацию (Kubb + React Query)

## Технологии

- Next.js 15 (App Router)
- React 18 + TypeScript
- Mantine UI
- TanStack Query
- Telegram Mini App SDK (`@tma.js/*`)
- Kubb (генерация API-клиента и хуков)

## Быстрый старт

```bash
npm install
npm run generate
npm run dev
```

Приложение будет доступно на `http://localhost:3000`.

## HTTPS запуск локально

Для тестов в окружении, близком к Telegram:

```bash
npm run build
npm run start:https
```

Это поднимет production-сервер + HTTPS-прокси на `https://localhost:3000`.

## Переменные окружения

Скопируй `.env.example` в `.env` и задай значения.

Ключевые переменные:

- `NEXT_PUBLIC_API_URL` — URL backend API
- `API_DOCS_URL` — URL swagger/openapi backend
- `OPENAPI_PATH` — источник схемы для `npm run generate`

## Скрипты

- `npm run dev` — dev-режим
- `npm run dev:https` — dev по HTTPS
- `npm run build` — production build
- `npm run start` — запуск production (standalone)
- `npm run start:https` — запуск production по HTTPS на 3000
- `npm run generate` — генерация API клиента/хуков
- `npm run lint` — линтинг

## Структура

- `src/app` — маршруты и layout
- `src/widgets` — страницы и UI-блоки
- `src/processes` — провайдеры и процессный слой
- `src/shared` — общие библиотеки, api, utils
- `src/shared/api/.generated` — сгенерированный API слой

## Маршруты Mini App

- `/` — Главная (онбординг)
- `/passport` — Паспорт навыков
- `/map` — Карта трека
- `/episodes` — Эпизоды
- `/vacancy` — Вакансии

## Важно

После изменений в backend Swagger/OpenAPI обязательно перегенерируй клиент:

```bash
npm run generate
```

</details>

<details>
<summary><strong>English</strong></summary>

## About

`stepleap-ai-frontend` is the Telegram Mini App frontend for StepLeap AI.

It guides users through a full career journey:

1. Fill onboarding and skills profile.
2. Get personalized track recommendations.
3. Follow a checkpoint-based career map.
4. Complete episodes in strict order.
5. View matched vacancies.

## Core Features

- Telegram Mini App-first UX (mobile-focused)
- Onboarding and profile editing
- Skill Passport (soft/hard skills + readiness)
- Track map with dynamic checkpoints
- Episodes with sequential completion flow
- Vacancy list from external feed with backend matching
- OpenAPI-driven API layer (Kubb + React Query hooks)

## Tech Stack

- Next.js 15 (App Router)
- React 18 + TypeScript
- Mantine UI
- TanStack Query
- Telegram Mini App SDK (`@tma.js/*`)
- Kubb API generation

## Quick Start

```bash
npm install
npm run generate
npm run dev
```

App runs on `http://localhost:3000`.

## Local HTTPS (production-like)

```bash
npm run build
npm run start:https
```

Starts standalone app and HTTPS proxy on `https://localhost:3000`.

## Environment

Copy `.env.example` to `.env`.

Key variables:

- `NEXT_PUBLIC_API_URL` — backend API URL
- `API_DOCS_URL` — backend swagger/openapi endpoint
- `OPENAPI_PATH` — schema source for generation

## Scripts

- `npm run dev`
- `npm run dev:https`
- `npm run build`
- `npm run start`
- `npm run start:https`
- `npm run generate`
- `npm run lint`

## Project Structure

- `src/app` — routes and layouts
- `src/widgets` — pages and composite UI blocks
- `src/processes` — process/provider layer
- `src/shared` — shared libraries, api, utils
- `src/shared/api/.generated` — generated API clients/hooks

## Mini App Routes

- `/` — Home (onboarding)
- `/passport` — Skill Passport
- `/map` — Track Map
- `/episodes` — Episodes
- `/vacancy` — Vacancies

## Note

After backend OpenAPI changes, regenerate API artifacts:

```bash
npm run generate
```

</details>
