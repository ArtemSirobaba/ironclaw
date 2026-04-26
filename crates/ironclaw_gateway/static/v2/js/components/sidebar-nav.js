import { NavLink } from "react-router";
import { primaryRoutes } from "../app/routes.js";
import { Icon } from "../design-system/icons.js";
import { html } from "../lib/html.js";
import { useT } from "../lib/i18n.js";
import { cn } from "../utils/cn.js";

const ROUTE_ICONS = {
  chat: "chat",
  workspace: "layers",
  projects: "folder",
  jobs: "pulse",
  missions: "flag",
  extensions: "plug",
  settings: "settings",
  admin: "shield",
};

const navRoutes = primaryRoutes.filter((r) => r.id !== "chat");

function NavItem({ route, label, onNavigate }) {
  return html`
    <${NavLink}
      to=${route.path}
      onClick=${onNavigate}
      className=${({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-[10px] px-3 py-2 text-[13px] font-medium",
          isActive
            ? "bg-[var(--v2-accent-soft)] text-[var(--v2-accent-text)]"
            : "text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
        )}
    >
      <${Icon} name=${ROUTE_ICONS[route.id] || "bolt"} className="h-4 w-4 shrink-0" />
      <span className="min-w-0 truncate">${label}</span>
    <//>
  `;
}

export function SidebarNav({ onNewChat, isCreating, onNavigate }) {
  const t = useT();

  return html`
    <div className="flex flex-col px-3 py-2">
      <button
        onClick=${onNewChat}
        disabled=${isCreating}
        className=${cn(
          "flex items-center gap-2.5 rounded-[10px] px-3 py-2",
          "border border-[color-mix(in_srgb,var(--v2-accent)_30%,var(--v2-panel-border))]",
          "bg-[var(--v2-accent-soft)] text-[13px] font-medium text-[var(--v2-accent-text)]",
          "hover:bg-[color-mix(in_srgb,var(--v2-accent)_18%,transparent)] disabled:opacity-50"
        )}
      >
        <${Icon} name="plus" className="h-4 w-4 shrink-0" />
        <span>${isCreating ? t("chat.creating") : t("chat.newThread")}</span>
      </button>

      <nav className="mt-2 flex flex-col gap-1">
        ${navRoutes.map(
          (route) => html`
            <${NavItem}
              key=${route.id}
              route=${route}
              label=${t(route.labelKey)}
              onNavigate=${onNavigate}
            />
          `
        )}
      </nav>
    </div>
  `;
}
