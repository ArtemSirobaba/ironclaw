import { React, html } from "../../../lib/html.js";
import { Icon } from "../../../design-system/icons.js";

const STATUS_STYLE = {
  running: "border-iron-700/50 bg-iron-900/50",
  success: "border-mint/30 bg-mint/10",
  error: "border-red-400/30 bg-red-500/10",
};

export function ToolActivity({ activity }) {
  const [expanded, setExpanded] = React.useState(false);
  const { toolName, toolStatus, toolDetail, toolError, toolDurationMs, toolParameters, toolResultPreview } = activity;

  return html`
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-iron-800 text-iron-100">
        <${Icon} name="tool" className="h-4 w-4" />
      </div>
      <div className="min-w-0 max-w-[85%] flex-1">
        <button
          onClick=${() => setExpanded((v) => !v)}
          className=${["v2-button flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm", STATUS_STYLE[toolStatus] || STATUS_STYLE.running].join(" ")}
        >
          <span className="font-mono text-xs">${toolStatus === "success" ? "ok" : toolStatus === "error" ? "err" : "run"}</span>
          <span className="truncate font-medium">${toolName}</span>
          ${toolStatus === "running" && html`<span className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-iron-200 border-t-transparent" />`}
          ${toolDurationMs && html`<span className="ml-auto shrink-0 font-mono text-[11px] text-iron-200">${toolDurationMs}ms</span>`}
        </button>

        ${expanded && html`
          <div className="mt-1 rounded-lg border border-iron-700/50 bg-iron-950 p-3 text-xs">
            ${toolDetail && html`<div className="mb-2 text-iron-200">${toolDetail}</div>`}
            ${toolParameters && html`<pre className="overflow-x-auto rounded bg-iron-900 p-2 font-mono text-iron-100">${toolParameters}</pre>`}
            ${toolResultPreview && html`<div className="mt-2 text-mint">${toolResultPreview}</div>`}
            ${toolError && html`<div className="mt-2 text-red-300">${toolError}</div>`}
          </div>
        `}
      </div>
    </div>
  `;
}
