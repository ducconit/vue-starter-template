# Vue Starter Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-purple.svg)](https://vitejs.dev/)

A production-ready Vue 3 starter template that pairs TypeScript, Vite, and an opinionated architecture focused on fast development, authentication-ready dashboards, and maintainable code.

## Overview

This template helps teams bootstrap admin dashboards or SaaS back offices. It provides:

- A scalable application shell with layout switching and route-based guards.
- A fully wired authentication flow with session persistence and API token injection.
- Built-in developer tooling for linting, formatting, and type safety.
- Mock data services so you can iterate on UI without a backend.

## Tech Stack

- **Framework:** Vue 3 with the Composition API and `<script setup>` syntax.
- **Language:** TypeScript for static typing across the stack.
- **Build Tool:** Vite for fast HMR and optimized production builds.
- **State Management:** Pinia with persisted state support.
- **Routing:** Vue Router with layered middleware guards.
- **Networking:** Axios clients abstracted for guest and authenticated requests.
- **UI Utilities:** Tailwind CSS, class-variance-authority, and shadcn-inspired components.
- **Tooling:** Bun task runner, ESLint + Oxlint, Prettier, and Vue TSC.

## Key Features

- ⚙️ Convention-driven project structure ready for scaling modules and features.
- 🔒 Authentication middleware and login flow with persisted sessions.
- 🧭 Dynamic layout system that reacts to route metadata.
- 🌐 Internationalization and SEO meta management via `@unhead/vue`.
- 🧪 Component testing setup and strict type checking.
- 🧰 Mock server powered by Mirage JS for API prototyping.

## Architecture Highlights

### Application Bootstrap

The Vue app registers head management, routing, state stores, and dayjs plugins before mounting, optionally spinning up a Mirage mock server based on environment flags (@filepath:src/main.ts#1-27).

### Routing & Navigation

Routes are declared as lazy-loaded modules with `auth` and `guest` metadata. Global navigation guards enforce access control using composable middleware (@filepath:src/routes/router.ts#1-13, @filepath:src/routes/routes.ts#1-87).

### Authentication Flow

The login page calls the authentication API, persists tokens via Pinia, and redirects to the dashboard. Guest routes redirect authenticated users, while protected routes require a valid session (@filepath:src/pages/login.vue#37-44, @filepath:src/stores/auth.store.ts#4-39, @filepath:src/routes/middlewares/auth.middleware.ts#5-20).

### State Management

Pinia stores are instantiated once, enhanced with persisted state, and hot-module-ready to keep sessions stable during development (@filepath:src/stores/index.ts#1-15).

### API Layer

Dual Axios instances power guest and authenticated calls. Authenticated requests automatically inject the bearer token from the Pinia store before dispatching (@filepath:src/api/client.ts#1-25).

### Layout System

Route metadata maps to layout components resolved at runtime. The default `AppLayout` combines sidebar navigation, breadcrumb support, and transition wrappers (@filepath:src/App.vue#1-71, @filepath:src/layouts/AppLayout.vue#1-57).

### Error Handling & Notifications

Global error captures push failures into a shared composable, while `vue-sonner` toasts surface feedback to end users (@filepath:src/App.vue#47-71).

### Mock Server & Seed Data

When `VITE_MOCK_SERVER` is enabled, Mirage JS bootstraps fixture-backed endpoints so the front end can run without a live backend (@filepath:src/plugins/miragejs/server.ts#1-200).

#### Default Credentials with mock server

- **Email:** `admin@example.com`
- **Password:** `123`
- **OTP:** `12345` (used for both account verification and forgot-password flows)

Use these values to explore the authentication flow locally when the mock server is active.

### Internationalization & Meta Tags

`@unhead/vue` and the i18n plugin configure dynamic titles and localized content at startup (@filepath:src/main.ts#1-27, @filepath:src/plugins/i18n/index.ts#1-200).

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) ≥ 1.1
- Node.js ≥ 24 (for tooling compatibility)

### Installation

```bash
# Clone the repository
git clone https://github.com/ducconit/vue-starter-template.git
cd vue-starter-template

# Install dependencies
bun install

# Start the development server
bun run dev
```

The app will be available at `http://localhost:5173` by default.

### Production Build

```bash
bun run build
```

### Development Scripts

| Script | Description |
| --- | --- |
| `bun run dev` | Start the Vite development server with HMR. |
| `bun run build` | Type-check and generate a production build. |
| `bun run preview` | Preview the production build locally. |
| `bun run type-check` | Run Vue TSC in build mode. |
| `bun run lint` | Format code, run Oxlint, and execute ESLint. |
| `bun run lint:oxlint` | Run Oxlint with autofix for correctness issues. |
| `bun run lint:eslint` | Run ESLint with the Vue + TypeScript config. |
| `bun run format` | Format source files with Prettier. |

## Environment Variables

Copy `.env.example` into `.env` and adjust values as needed.

| Variable | Description | Default |
| --- | --- | --- |
| `VITE_APP_NAME` | Application name displayed in the UI. | `"Template Admin"` |
| `VITE_BASE_URL` | Base URL for API requests. | `/api` |
| `VITE_MOCK_SERVER` | Toggle Mirage mock server (`true` / `false`). | `true` |

## Project Structure

```
├── public/                  # Static assets served as-is
├── src/
│   ├── api/                 # Axios clients and API modules
│   ├── components/          # UI library and reusable building blocks
│   ├── composables/         # Shared Vue composables
│   ├── layouts/             # Application shell components
│   ├── pages/               # Route-level views (lazy-loaded)
│   ├── plugins/             # App-wide plugin registrations (i18n, dayjs, mirage)
│   ├── routes/              # Router config and middleware guards
│   ├── stores/              # Pinia stores and persisted state setup
│   ├── assets/              # Styles, images, and static resources
│   ├── App.vue              # Root component with layout resolution
│   └── main.ts              # Entry point bootstrapping the app
├── eslint.config.ts         # ESLint multi-runner configuration
├── package.json             # Dependencies and Bun scripts
├── tsconfig*.json           # TypeScript configurations
├── vite.config.ts           # Vite bundler configuration
└── bun.lock                 # Bun lockfile
```

## Testing & Quality Assurance

- Type safety is enforced via `vue-tsc` during builds.
- Oxlint and ESLint keep the codebase aligned with Vue, TypeScript, and Prettier conventions.
- Component-level tests can be added under `src/components/__tests__` using Vitest.

## Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a branch: `git checkout -b feat/amazing-improvement`.
3. Commit using Conventional Commits: `git commit -m "feat: add amazing improvement"`.
4. Push your branch: `git push origin feat/amazing-improvement`.
5. Open a Pull Request describing your changes and rationale.

Please ensure linting and type checks pass before submitting.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ducconit/vue-starter-template&type=Date)](https://www.star-history.com/#ducconit/vue-starter-template&Date)
