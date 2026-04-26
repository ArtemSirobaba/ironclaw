import { React, html } from "../lib/html.js";
import { Icon } from "../design-system/icons.js";
import { cn } from "../utils/cn.js";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function ThreadItem({ thread, isActive, onSelect }) {
  return html`
    <button
      onClick=${() => onSelect(thread.id)}
      className=${cn(
        "flex w-full flex-col items-start gap-0.5 rounded-[8px] px-3 py-2 text-left",
        isActive
          ? "bg-[var(--v2-accent-soft)] text-[var(--v2-accent-text)]"
          : "text-[var(--v2-text-muted)] hover:bg-[var(--v2-surface-muted)] hover:text-[var(--v2-text-strong)]"
      )}
    >
      <div className="flex w-full items-center gap-1.5">
        <span className="min-w-0 flex-1 truncate text-[13px] font-medium leading-snug">
          ${thread.title || `Thread ${thread.id.slice(0, 8)}`}
        </span>
        ${thread.state === "Processing" &&
        html`<span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--v2-accent)]"
        />`}
      </div>
      <span className="text-[11px] text-[var(--v2-text-faint)]">
        ${formatTime(thread.updated_at)}
      </span>
    </button>
  `;
}

export function SidebarThreads({ threads, activeThreadId, onSelect }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return html`
    <div className="flex min-h-0 flex-1 flex-col px-2">
      <button
        onClick=${() => setCollapsed((v) => !v)}
        className="flex w-full items-center gap-1 rounded-[6px] px-2 py-1.5 hover:bg-[var(--v2-surface-muted)]"
      >
        <span
          className="flex-1 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--v2-text-faint)]"
        >
          Recent
        </span>
        <${Icon}
          name="chevron"
          className=${cn(
            "h-3.5 w-3.5 text-[var(--v2-text-faint)]",
            collapsed ? "-rotate-90" : ""
          )}
          strokeWidth=${2.2}
        />
      </button>

      ${!collapsed &&
      html`
        <div
          className="mt-1 flex flex-col gap-1 overflow-y-auto [scrollbar-width:thin]"
        >
          ${threads.length === 0 &&
          html`<div className="px-3 py-2 text-[12px] text-[var(--v2-text-faint)]">
            No conversations yet
          </div>`}
          ${threads.map(
            (thread) => html`
              <${ThreadItem}
                key=${thread.id}
                thread=${thread}
                isActive=${thread.id === activeThreadId}
                onSelect=${onSelect}
              />
            `
          )}
        </div>
      `}
    </div>
  `;
}
