# IronClaw v2 Frontend Structure

`static/v2` is a browser-native React application served by the gateway at `/v2`.

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

- `pages/dashboard/dashboard-page.js`
- `pages/chat/chat-page.js`
- `pages/projects/projects-page.js`
- `pages/jobs/jobs-page.js`
- `pages/extensions/extensions-page.js`
- `pages/settings/settings-page.js`
- `pages/login/login-page.js`
