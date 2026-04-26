import { NavLink, useLocation } from "react-router";
import { React, html } from "../lib/html.js";
import { primaryRoutes } from "../app/routes.js";
import { Icon } from "../design-system/icons.js";
import { useT } from "../lib/i18n.js";
import { cn } from "../utils/cn.js";

const DOCS_URL = "https://docs.ironclaw.com";

export function PageHeader({ threadsState, onToggleSidebar }) {
  const t = useT();
  const location = useLocation();

  const title = React.useMemo(() => {
    if (location.pathname.startsWith("/chat")) {
      if (threadsState.activeThreadId) {
        const thread = threadsState.threads.find(
          (th) => th.id === threadsState.activeThreadId
        );
        return thread?.title || t("nav.chat");
      }
      return t("nav.chat");
    }
    const route = primaryRoutes.find((r) =>
      location.pathname.startsWith(r.path)
    );
    return route ? t(route.labelKey) : "";
  }, [location.pathname, threadsState.activeThreadId, threadsState.threads, t]);

  return html`
    <header
      className=${cn(
        "flex h-14 shrink-0 items-center gap-3 px-4",
        "border-b border-[var(--v2-panel-border)]",
        "bg-[color-mix(in_srgb,var(--v2-canvas-strong)_88%,transparent)] backdrop-blur-xl"
      )}
    >
      <button
        onClick=${onToggleSidebar}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] md:hidden"
        aria-label="Toggle sidebar"
      >
        <${Icon} name="list" className="h-4 w-4" />
      </button>
      <span className="truncate text-[14px] font-semibold text-[var(--v2-text-strong)]">
        ${title}
      </span>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <${NavLink}
          to="/logs"
          className=${({ isActive }) =>
            cn(
              "grid h-8 w-8 place-items-center rounded-[8px] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]",
              isActive && "bg-[var(--v2-accent-soft)] text-[var(--v2-accent-text)]"
            )}
          title=${t("nav.logs")}
        >
          <${Icon} name="list" className="h-4 w-4" />
        <//>
        <a
          href=${DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="grid h-8 w-8 place-items-center rounded-[8px] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
          title=${t("nav.docs")}
        >
          <${Icon} name="file" className="h-4 w-4" />
        </a>
      </div>
    </header>
  `;
}
