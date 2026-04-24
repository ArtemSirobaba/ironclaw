import { html } from "../../../lib/html.js";
import { Panel, StatusPill } from "../../../design-system/primitives.js";

const cards = [
  { key: "total", label: "Total missions", tone: "muted" },
  { key: "active", label: "Active", tone: "signal" },
  { key: "paused", label: "Paused", tone: "warning" },
  { key: "threads", label: "Spawned threads", tone: "success" },
];

export function MissionsSummaryStrip({ summary }) {
  return html`
    <${Panel} className="p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        ${cards.map((card) => html`
          <div key=${card.key} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-iron-300">${card.label}</div>
              <${StatusPill} tone=${card.tone} label=${card.key} />
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight text-white">${summary[card.key] || 0}</div>
            <p className="mt-2 text-sm leading-6 text-iron-300">
              ${card.key === "total"
                ? `${summary.completed || 0} completed / ${summary.failed || 0} failed`
                : "Across every project workspace"}
            </p>
          </div>
        `)}
      </div>
    <//>
  `;
}
