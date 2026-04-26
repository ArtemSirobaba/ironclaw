import { Icon } from "../design-system/icons.js";
import { html } from "../lib/html.js";
import { useT } from "../lib/i18n.js";

export function SidebarFooter({ theme, toggleTheme, onSignOut }) {
  const t = useT();

  return html`
    <div
      className="flex items-center gap-2 border-t border-[var(--v2-panel-border)] px-3 py-3"
    >
      <div
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--v2-accent-soft)] text-[11px] font-bold text-[var(--v2-accent-text)]"
      >
        IC
      </div>
      <span
        className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--v2-text-strong)]"
      >
        IronClaw
      </span>
      <button
        onClick=${toggleTheme}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
        title=${theme === "dark" ? t("theme.light") : t("theme.dark")}
      >
        <${Icon} name=${theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
      </button>
      <button
        onClick=${onSignOut}
        className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
        title=${t("header.signOut")}
      >
        <${Icon} name="logout" className="h-4 w-4" />
      </button>
    </div>
  `;
}
