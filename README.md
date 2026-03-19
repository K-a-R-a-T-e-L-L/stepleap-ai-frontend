# Telegram Mini App Starter

Russian version: [README.ru.md](./README.ru.md)

Detailed starter template for building Telegram Mini Apps on Next.js App Router with TypeScript, i18n, API client generation, and clean layered architecture.

## Why This Template

This repository is structured to help you launch a new product quickly and avoid spending time on base infrastructure:

- foundation on Next.js 15 App Router
- Telegram Mini App SDK integration + browser mock mode
- localization via `next-intl` (EN/RU examples included)
- OpenAPI-based API client and React Query hook generation via Kubb
- layered structure (`app`, `processes`, `widgets`, `shared`)
- ready example routes: `/`, `/about`, `/settings`

## Technologies

Core:

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

Localization:

- [next-intl](https://next-intl.dev/)

Quality:

- ESLint (Next.js config)

## Installation

```bash
npm install
```

## Environment Variables

Copy `.env.example` to `.env` and provide values.

```bash
cp .env.example .env
```

Variables:

- `NEXT_PUBLIC_API_URL`: base URL for runtime API requests
- `API_DOCS_URL`: remote OpenAPI endpoint (used when `OPENAPI_PATH=remote`)
- `OPENAPI_PATH`: OpenAPI source for code generation

`OPENAPI_PATH` options:

- `./openapi.json` (default local schema)
- `remote` (schema is loaded from `API_DOCS_URL` with cache buster)

## Scripts

- `npm run dev`: start dev server (`http://localhost:3000`)
- `npm run dev:https`: start dev server via HTTPS
- `npm run build`: production build
- `npm run start`: start production server
- `npm run lint`: run linter
- `npm run generate`: generate API client/hooks from OpenAPI (Kubb)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

3. Generate API layer:

```bash
npm run generate
```

4. Start the app:

```bash
npm run dev
```

5. Open `http://localhost:3000`

## Running Inside Telegram

For full validation, you need an HTTPS URL in BotFather Mini App settings.

Local option:

```bash
npm run dev:https
```

## Architecture

Main layers:

- `src/app`: Next.js routing, layouts, route groups
- `src/processes`: providers and process layer
- `src/widgets`: composite UI blocks and pages
- `src/shared`: shared infrastructure (api, i18n, ui, lib)

Current routes:

- `/` -> Home page example
- `/about` -> About page example
- `/settings` -> Settings page example

## Localization (i18n)

Translation files:

- `public/locales/en.json`
- `public/locales/ru.json`

i18n config:

- `src/shared/lib/i18n/config.ts`
- `src/shared/lib/i18n/i18n.ts`
- `src/shared/lib/i18n/provider.tsx`
- `src/shared/lib/i18n/locale.ts`

The `next-intl` request config path is set in `next.config.ts`.

## API and Code Generation

Manual HTTP client:

- `src/shared/api/client.ts`

Generated artifacts:

- `src/shared/api/.generated`

Kubb configuration:

- `kubb.config.ts`

Generation pipeline:

1. Resolve OpenAPI source (`OPENAPI_PATH` / `API_DOCS_URL`)
2. Generate types
3. Generate fetch clients
4. Generate React Query hooks

## Telegram SDK Initialization

Client instrumentation entry point:

- `src/instrumentation-client.ts`

Runtime init and mock helpers:

- `src/shared/lib/init.ts`
- `src/shared/lib/mockEnv.ts`

This setup allows comfortable development both in Telegram and in a regular browser.
