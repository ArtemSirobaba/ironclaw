import { Link, NavLink, Outlet } from "react-router";
import { React, html } from "../lib/html.js";
import { primaryRoutes } from "../app/routes.js";
import { useGatewayStatus } from "../hooks/useGatewayStatus.js";
import { useThreads } from "../pages/chat/hooks/useThreads.js";
import { Button } from "../design-system/button.js";
import { StatusPill } from "../design-system/primitives.js";
import { Icon } from "../design-system/icons.js";

const THEME_STORAGE_KEY = "ironclaw:v2-theme";

function initialTheme() {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch (_) {
    return "light";
  }
}

function useInterfaceTheme() {
  const [theme, setTheme] = React.useState(initialTheme);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme };
}

function RouteGlyph({ label }) {
  return html`
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.035] font-mono text-[10px] text-iron-300 transition group-hover:border-signal/35 group-hover:text-signal">
      ${label.slice(0, 2).toUpperCase()}
    </span>
  `;
}

function HeaderTabs() {
  return html`
    <nav className="v2-header-tabs flex min-w-max items-center gap-2 xl:gap-3">
      ${primaryRoutes.map((route) => html`
        <${NavLink}
          key=${route.id}
          to=${route.path}
          className=${({ isActive }) =>
            [
              "group flex items-center gap-3 rounded-md border px-2.5 py-2 text-sm transition xl:px-3",
              isActive
                ? "v2-nav-active border-signal/30 text-white"
                : "border-white/10 bg-white/[0.02] text-iron-300 hover:border-white/15 hover:bg-white/[0.045] hover:text-white",
            ].join(" ")}
        >
          <${RouteGlyph} label=${route.label} />
          <span className="min-w-0 truncate whitespace-nowrap">${route.label}</span>
        <//>
      `)}
    </nav>
  `;
}

export function GatewayLayout({ token, onSignOut }) {
  const { theme, toggleTheme } = useInterfaceTheme();
  const statusQuery = useGatewayStatus(token);
  const threadsState = useThreads();
  const status = statusQuery.data;
  const statusTone = statusQuery.error ? "danger" : statusQuery.isLoading ? "muted" : "success";
  const statusLabel = statusQuery.error ? "offline" : statusQuery.isLoading ? "checking" : status?.status || "online";

  return html`
    <div className="v2-app-bg min-h-[100dvh] overflow-hidden">
      <header className="v2-topbar sticky top-0 z-30 border-b border-white/10 bg-iron-950/88 backdrop-blur-xl">
        <div className="flex h-[88px] w-full items-center gap-3 px-4 sm:px-6 lg:px-8">
          <${Link} to="/chat" className="flex shrink-0 items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-signal/25 bg-signal/10 text-signal">
              <${Icon} name="bolt" className="h-5 w-5" />
            </span>
            <span className="font-serif text-2xl font-semibold tracking-[-0.04em]">IronClaw</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-iron-300">
              v2
            </span>
          <//>

          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <${HeaderTabs} />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <${StatusPill} tone=${statusTone} label=${statusLabel} />
            </div>
            <button
              type="button"
              onClick=${toggleTheme}
              className="v2-button grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/[0.035] text-iron-300 hover:text-white"
              aria-label=${theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title=${theme === "dark" ? "Light theme" : "Dark theme"}
            >
              <${Icon} name=${theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
            </button>
            <${Button} variant="ghost" onClick=${onSignOut}>Sign out<//>
          </div>
        </div>

        <div className="border-t border-white/8 px-3 py-2 md:hidden">
          <div className="flex items-center gap-3 overflow-x-auto">
            <${HeaderTabs} />
            <div className="shrink-0">
              <${StatusPill} tone=${statusTone} label=${statusLabel} />
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100dvh-88px)] min-h-0 w-full flex-col overflow-hidden">
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          ${statusQuery.error
            ? html`<div className="mb-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                ${statusQuery.error.message || "Unable to connect to the gateway"}
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
