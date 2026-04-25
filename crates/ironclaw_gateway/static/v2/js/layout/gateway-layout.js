import { Link, NavLink, Outlet } from "react-router";
import { primaryRoutes } from "../app/routes.js";
import { Icon } from "../design-system/icons.js";
import { useInterfaceTheme } from "../design-system/theme.js";
import { useGatewayStatus } from "../hooks/useGatewayStatus.js";
import { html } from "../lib/html.js";
import { useT } from "../lib/i18n.js";
import { useThreads } from "../pages/chat/hooks/useThreads.js";
import { cn } from "../utils/cn.js";

/* ─── Nav icon glyph ───────────────────────────────────────────────── */

function NavGlyph({ icon, isActive }) {
  return html`
    <span
      className=${cn(
        "grid h-8 w-8 shrink-0 place-items-center rounded-[10px] border transition-colors duration-150",
        isActive
          ? "border-[color-mix(in_srgb,var(--v2-accent)_34%,var(--v2-panel-border))] bg-[var(--v2-accent-soft)] text-[var(--v2-accent-text)]"
          : "border-[var(--v2-panel-border)] bg-[var(--v2-surface-soft)] text-[var(--v2-text-muted)] group-hover:border-[color-mix(in_srgb,var(--v2-accent)_34%,var(--v2-panel-border))] group-hover:bg-[var(--v2-accent-soft)] group-hover:text-[var(--v2-accent-text)]"
      )}
    >
      <${Icon} name=${icon} className="h-4 w-4" />
    </span>
  `;
}

/* ─── Header nav tabs ──────────────────────────────────────────────── */

function HeaderTabs() {
  const t = useT();
  return html`
    <nav
      className="flex min-w-max items-center gap-1.5 overflow-x-auto xl:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      ${primaryRoutes
        .filter((r) => r.id !== "settings")
        .map((route) => {
          const label = t(route.labelKey);
          return html`
            <${NavLink}
              key=${route.id}
              to=${route.path}
              className=${({ isActive }) =>
                cn(
                  "group flex items-center gap-2 rounded-[10px] border px-2.5 py-1.5",
                  "text-[13px] font-medium transition-colors duration-150",
                  isActive
                    ? "border-[color-mix(in_srgb,var(--v2-accent)_34%,var(--v2-panel-border))] bg-[var(--v2-card-bg)] text-[var(--v2-text-strong)]"
                    : "border-[var(--v2-panel-border)] bg-[var(--v2-surface-soft)] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
                )}
            >
              <span className="min-w-0 truncate whitespace-nowrap">${label}</span>
            <//>
          `;
        })}
    </nav>
  `;
}

/* ─── Header icon button ───────────────────────────────────────────── */

function HeaderAction({ onClick, to, ariaLabel, title, children }) {
  const cls = cn(
    "grid h-[44px] w-[44px] shrink-0 place-items-center rounded-[14px]",
    "border border-[var(--v2-panel-border)] bg-[var(--v2-surface-soft)]",
    "text-[var(--v2-text-muted)] transition-colors duration-150",
    "hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]/50"
  );

  if (to) {
    return html`
      <${Link} to=${to} className=${cls} aria-label=${ariaLabel} title=${title}>
        ${children}
      <//>
    `;
  }
  return html`
    <button
      type="button"
      onClick=${onClick}
      className=${cls}
      aria-label=${ariaLabel}
      title=${title}
    >
      ${children}
    </button>
  `;
}

/* ─── GatewayLayout ────────────────────────────────────────────────── */

export function GatewayLayout({ token, onSignOut }) {
  const t = useT();
  const { theme, toggleTheme } = useInterfaceTheme();
  const statusQuery = useGatewayStatus(token);
  const threadsState = useThreads();
  const status = statusQuery.data;

  return html`
    <div className="min-h-[100dvh] overflow-hidden bg-[var(--v2-canvas)]">

      <!-- ── Top bar ─────────────────────────────────────────────── -->
      <header
        className=${cn(
          "sticky top-0 z-30 border-b border-[var(--v2-panel-border)]",
          "bg-[color-mix(in_srgb,var(--v2-canvas-strong)_88%,transparent)]",
          "backdrop-blur-xl"
        )}
      >
        <div
          className="mx-auto flex h-16 w-full items-center gap-3 px-4 sm:px-6 lg:px-8"
        >
          <!-- Wordmark -->
          <${Link}
            to="/chat"
            className="flex shrink-0 items-center gap-2.5 text-[var(--v2-text-strong)] opacity-90 transition-opacity hover:opacity-100"
          >
            <span className="text-xl font-semibold tracking-[-0.03em]">IronClaw</span>
            <span
              className="hidden rounded-full border border-[var(--v2-panel-border)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-[var(--v2-text-muted)] sm:inline-flex"
            >v2</span>
          <//>

          <!-- Centre: nav tabs (md+) -->
          <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
            <${HeaderTabs} />
          </div>

          <!-- Right: actions -->
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <${HeaderAction}
              onClick=${toggleTheme}
              ariaLabel=${theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
              title=${theme === "dark" ? t("theme.light") : t("theme.dark")}
            >
              <${Icon} name=${theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
            <//>
            <${HeaderAction}
              to="/settings"
              ariaLabel=${t("nav.settings")}
              title=${t("nav.settings")}
            >
              <${Icon} name="settings" className="h-[18px] w-[18px]" strokeWidth=${1.4} />
            <//>
            <${HeaderAction}
              onClick=${onSignOut}
              ariaLabel=${t("header.signOut")}
              title=${t("header.signOut")}
            >
              <${Icon} name="logout" className="h-4 w-4" />
            <//>
          </div>
        </div>

        <!-- Mobile nav row -->
        <div
          className="border-t border-[var(--v2-panel-border)] px-3 py-2 md:hidden"
        >
          <${HeaderTabs} />
        </div>
      </header>

      <!-- ── Page body ────────────────────────────────────────────── -->
      <div
        className="mx-auto flex h-[calc(100dvh-4rem)] min-h-0 w-full flex-col overflow-hidden"
      >
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
          ${statusQuery.error
            ? html`
                <div
                  className=${cn(
                    "m-4 rounded-[14px] border px-4 py-3 text-sm",
                    "border-[color-mix(in_srgb,var(--v2-danger-text)_36%,var(--v2-panel-border))]",
                    "bg-[var(--v2-danger-soft)] text-[var(--v2-danger-text)]"
                  )}
                >
                  ${statusQuery.error.message || t("error.gatewayConnection")}
                </div>
              `
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
