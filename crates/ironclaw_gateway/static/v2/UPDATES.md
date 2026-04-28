# V2 Frontend Missing V1 Parity

This tracks the remaining frontend work needed to bring `crates/ironclaw_gateway/static/v2` to parity with the legacy frontend in `crates/ironclaw_gateway/static`.

## Priority Order

1. Auth parity.
2. LLM provider management.
3. Chat reliability and history parity.
4. Extension onboarding and widget API.
5. Active work, TEE, restart, and polish.

## Recently Completed

- 2026-04-28: V2 auth parity pass for OAuth provider buttons, URL `?token=` auto-login, cookie/OIDC session probing, `/auth/logout` cleanup, and `/api/profile` avatar/account/admin-role UI filtering.
- 2026-04-28: Settings import/export JSON toolbar in V2, backed by `/api/settings/export` and `/api/settings/import`.
- 2026-04-28: Settings toolbar search and back-to-inference navigation in V2.

## Missing Items

### Auth Parity

Auth parity items currently tracked here are complete. Re-open this section if V1-only auth behavior is found during manual browser testing.

### LLM Provider Management

- Provider list from `/api/llm/providers`.
- Add/edit/delete custom providers.
- Configure built-in providers.
- Set active provider atomically.
- Test connection.
- Fetch available models.
- Persist `llm_custom_providers` and `llm_builtin_overrides`.

### Settings Utilities

- Restart banner action. V2 shows restart-needed UI, but does not actually trigger restart.

### Restart And TEE UI

- Restart button/modal/progress flow.
- `restart_enabled` handling from gateway status.
- TEE shield.
- Attestation popover.
- Copy attestation report flow.

### Skills Management

- ClawHub search.
- Install skill by name/URL.
- Remove/uninstall skill flow if still supported by backend.
- V2 currently only lists installed skills.

### Extension And Onboarding Depth

- Richer v1 auth/onboarding overlays from SSE.
- Auth cancel/token-submit flows.
- Restart/setup instructions rendering in channel states.
- Manual WASM/MCP install forms outside registry entries.
- Basic install/activate/remove/configure already exists in v2.

### Widget And Plugin Frontend API

- `window.IronClaw.registerWidget`.
- `IronClaw.registerChatRenderer`.
- Widget tab slots.
- Safe widget API.
- Share modal helper.

### Chat Composer Parity

- Slash command autocomplete.
- Skill-based dynamic slash commands.
- Tab ghost suggestion behavior.
- Approval text shortcuts like `yes`, `always`, `deny`.
- Read-only channel detection/disable behavior for non-gateway threads.

### Chat Reliability Edge Cases

- Pending-user-message reinjection during DB persistence race.
- Send retry link on failed send.
- 429 cooldown handling.
- "Done without response" recovery reload.
- Visibility-based SSE close/reconnect behavior.

### Chat History And Rendering

- Persisted `<attachments>...</attachments>` parsing in user history.
- Multiple historical tool calls should render all tool calls, not only the first.
- V1-style expandable grouped tool activity behavior.
- Stronger generated-image history fallback/cache when history lacks `data_url`.

### Thread Sidebar Parity

- Merge `assistant_thread` into displayed thread list.
- Channel badges.
- Unread badges.
- Active/processing indicators from SSE.

### Active Work Surface

- V1 active work store/bar for jobs, missions, and engine threads.
- Live mission/thread progress snapshots fed by SSE/job events.

### Global Keyboard And Accessibility Helpers

- Shortcuts overlay.
- Global Ctrl/Cmd tab switching/search focus helpers.
- Scroll-to-bottom button behavior in chat.

## Compared Files

- V1: `index.html`, `js/core/init-auth.js`, `js/surfaces/chat.js`, `js/surfaces/config.js`.
- V2: `v2/js/app/app.js`, `v2/js/lib/api.js`, `v2/js/pages/chat/chat.js`, `v2/js/pages/settings/settings-page.js`.
