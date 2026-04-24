import { Link, NavLink, Outlet } from "react-router";
import { primaryRoutes } from "../app/routes.js";
import { Button } from "../design-system/button.js";
import { Icon } from "../design-system/icons.js";
import { StatusPill } from "../design-system/primitives.js";
import { useInterfaceTheme } from "../design-system/theme.js";
import { useGatewayStatus } from "../hooks/useGatewayStatus.js";
import { html } from "../lib/html.js";
import { useT } from "../lib/i18n.js";
import { useThreads } from "../pages/chat/hooks/useThreads.js";

const routeIcons = {
  chat: "chat",
  workspace: "folder",
  projects: "layers",
  jobs: "list",
  missions: "flag",
  extensions: "plug",
  settings: "settings",
  admin: "shield",
};

function RouteGlyph({ icon }) {
  return html`
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-iron-700 bg-iron-800 text-iron-300 transition group-hover:border-[color-mix(in_srgb,var(--v2-accent)_34%,var(--v2-panel-border))] group-hover:bg-[var(--v2-accent-soft)] group-hover:text-signal"
    >
      <${Icon} name=${icon} className="h-4 w-4" />
    </span>
  `;
}

function HeaderTabs() {
  const t = useT();
  return html`
    <nav
      className="flex min-w-max items-center gap-2 overflow-x-auto xl:gap-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      ${primaryRoutes.map((route) => {
        const label = t(route.labelKey);
        return html`
          <${NavLink}
            key=${route.id}
            to=${route.path}
            className=${({ isActive }) =>
              [
                "group flex items-center gap-2 rounded-md border px-2.5 py-2 text-sm transition xl:px-3",
                isActive
                  ? "border-[color-mix(in_srgb,var(--v2-accent)_34%,var(--v2-panel-border))] bg-[var(--v2-panel)] text-iron-100 shadow-[var(--v2-shadow-active)]"
                  : "border-iron-700 bg-iron-800/60 text-iron-300 hover:border-iron-700 hover:bg-iron-800/80 hover:text-iron-100",
              ].join(" ")}
          >
            <span className="min-w-0 truncate whitespace-nowrap">${label}</span>
          <//>
        `;
      })}
    </nav>
  `;
}

export function GatewayLayout({ token, onSignOut }) {
  const t = useT();
  const { theme, toggleTheme } = useInterfaceTheme();
  const statusQuery = useGatewayStatus(token);
  const threadsState = useThreads();
  const status = statusQuery.data;
  const statusTone = statusQuery.error
    ? "danger"
    : statusQuery.isLoading
    ? "muted"
    : "success";
  const statusLabel = statusQuery.error
    ? t("status.offline")
    : statusQuery.isLoading
    ? t("status.checking")
    : status?.status || t("status.online");

  return html`
    <div className="min-h-[100dvh] overflow-hidden">
      <header
        className="v2-topbar sticky top-0 z-30 border-b border-iron-700 bg-iron-950/88 backdrop-blur-xl"
      >
        <div
          className="mx-auto flex h-[84px] w-full max-w-[var(--layout-max-width-app)] items-center gap-3 px-4 sm:px-6 lg:px-8"
        >
          <${Link}
            to="/chat"
            className="flex shrink-0 items-center gap-3 text-iron-100"
          >
            <span
              className="v2-brand-mark grid h-10 w-10 place-items-center rounded-md border text-signal"
            >
              <${Icon} name="bolt" className="h-5 w-5" />
            </span>
            <span className="text-2xl font-semibold tracking-[-0.02em]"
              >IronClaw</span
            >
            <span
              className="hidden rounded-full border border-iron-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-iron-300 sm:inline-flex"
            >
              v2
            </span>
          <//>

          <div
            className="hidden min-w-0 flex-1 items-center justify-center md:flex"
          >
            <${HeaderTabs} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <${StatusPill} tone=${statusTone} label=${statusLabel} />
            </div>
            <button
              type="button"
              onClick=${toggleTheme}
              className="v2-button grid h-10 w-10 place-items-center rounded-md border border-iron-700 bg-iron-800/70 text-iron-300 hover:text-iron-100"
              aria-label=${theme === "dark"
                ? t("theme.switchToLight")
                : t("theme.switchToDark")}
              title=${theme === "dark" ? t("theme.light") : t("theme.dark")}
            >
              <${Icon}
                name=${theme === "dark" ? "sun" : "moon"}
                className="h-4 w-4"
              />
            </button>
            <${Button} variant="ghost" onClick=${onSignOut}
              >${t("header.signOut")}<//
            >
          </div>
        </div>

        <div className="border-t border-iron-700 px-3 py-2 md:hidden">
          <div className="flex items-center gap-3 overflow-x-auto">
            <${HeaderTabs} />
            <div className="shrink-0">
              <${StatusPill} tone=${statusTone} label=${statusLabel} />
            </div>
          </div>
        </div>
      </header>

      <div
        className="mx-auto flex h-[calc(100dvh-84px)] min-h-0 w-full max-w-[var(--layout-max-width-app)] flex-col overflow-hidden"
      >
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          ${statusQuery.error
            ? html`<div
                className="mb-4 rounded-md border border-[color-mix(in_srgb,var(--v2-danger-text)_36%,var(--v2-panel-border))] bg-[var(--v2-danger-soft)] px-4 py-3 text-sm text-[var(--v2-danger-text)]"
              >
                ${statusQuery.error.message || t("error.gatewayConnection")}
              </div>`
            : null}
          <${Outlet}
            context=${{
              gatewayStatus: status,
              gatewayStatusQuery: statusQuery,
              threadsState,
            }}
          />
        </main>
      </div>
    </div>
  `;
}
