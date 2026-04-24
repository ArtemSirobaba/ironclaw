# IronClaw v2 Frontend Structure

`static/v2` is a browser-native React application served by the gateway at `/v2`.

## Local Frontend-Only Dev

With Docker Compose, run the gateway and the v2 static dev server together:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Open `http://127.0.0.1:5174/v2`. The `v2-frontend` service serves files
directly from `static/v2` and proxies API requests to the `ironclaw` compose
service. Edits under `static/v2` trigger a browser reload, but do not trigger a
Rust rebuild.

For host-only development, run the Rust gateway in one terminal:

```bash
ENGINE_V2=true cargo run
```

Then run the v2 frontend static server in another terminal:

```bash
cd crates/ironclaw_gateway/static/v2
npm run dev
```

Open `http://127.0.0.1:5174/v2`. The dev server serves files directly from
`static/v2` and proxies `/api/*`, `/oauth/*`, `/relay/*`, `/projects/*`, and
`/v1/*` to `http://127.0.0.1:3000` by default. To point it at another gateway:

```bash
IRONCLAW_GATEWAY_URL=http://127.0.0.1:9876 npm run dev
```

This path intentionally avoids the Rust embedded-asset build step, so JS/CSS
edits reload the browser without recompiling Rust.

## Ownership

- `js/main.js` boots global providers only.
- `js/app/` owns auth, route definitions, and application composition.
- `js/layout/` owns persistent shell, navigation, status, and route outlet context.
- `js/pages/<page>/` owns page-level workflows.
- `js/pages/<page>/components/` owns components that are specific to that page.
- `js/pages/<page>/hooks/` owns stateful logic for that page.
- `js/pages/<page>/lib/` owns page-specific transforms, event mappers, and adapters.
- `js/design-system/` owns shared primitives such as buttons, panels, page headers, and status pills.
- `js/lib/` owns shared browser/runtime utilities such as API calls, query client setup, markdown, and htm bindings.

## Page Pattern

Each new product area should follow this shape:

```text
pages/settings/
  settings-page.js
  components/
  hooks/
  lib/
```

Keep route modules thin. Put workflow composition in the page file, local UI in `components/`, stateful behavior in `hooks/`, and transport calls in `js/lib/api.js` unless the adapter is page-only.

## Current Pages

- `pages/chat/chat-page.js`
- `pages/workspace/workspace-page.js`
- `pages/projects/projects-page.js`
- `pages/missions/missions-page.js`
- `pages/jobs/jobs-page.js`
- `pages/extensions/extensions-page.js`
- `pages/settings/settings-page.js`
- `pages/login/login-page.js`
