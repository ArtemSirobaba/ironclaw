import { html } from "../lib/html.js";

export function cx(...classes) {
  return classes.flat().filter(Boolean).join(" ");
}

const pillTones = {
  success: "border-mint/30 bg-mint/10 text-mint",
  warning: "border-copper/35 bg-copper/10 text-copper",
  danger: "border-red-400/30 bg-red-500/10 text-red-200",
  muted: "border-white/10 bg-white/[0.04] text-iron-200",
  signal: "border-signal/35 bg-signal/10 text-signal",
};

export function StatusPill({ tone = "muted", label }) {
  return html`
    <span className=${cx(
      "inline-flex h-7 items-center gap-2 rounded-full border px-2.5 font-mono text-[11px] uppercase tracking-[0.12em]",
      pillTones[tone] || pillTones.muted
    )}>
      <span className=${cx("h-1.5 w-1.5 rounded-full", tone === "success" || tone === "signal" ? "v2-breathing-dot bg-current" : "bg-current opacity-70")} />
      ${label}
    </span>
  `;
}

export function Panel({ children, className = "" }) {
  return html`<section className=${cx("v2-panel rounded-[18px]", className)}>${children}</section>`;
}

export function StatCard({ label, value, tone = "muted", detail }) {
  return html`
    <div className="border-t border-white/10 px-1 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">${label}</div>
          <div className="mt-3 truncate font-mono text-3xl font-semibold tracking-tight text-white">${value}</div>
          ${detail && html`<div className="mt-2 text-xs leading-5 text-iron-300">${detail}</div>`}
        </div>
        <${StatusPill} tone=${tone} label=${tone} />
      </div>
    </div>
  `;
}

export function FlowList({ items }) {
  return html`
    <div className="grid gap-3">
      ${items.map((item, index) => html`
        <div key=${item.title} className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-4 border-t border-white/10 py-4" style=${{ "--index": index }}>
          <div className="font-mono text-xs text-signal">
            ${String(index + 1).padStart(2, "0")}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white">${item.title}</div>
            <div className="mt-1 text-sm leading-6 text-iron-300">${item.description}</div>
          </div>
        </div>
      `)}
    </div>
  `;
}

export function EmptyPanel({ title, description, children }) {
  return html`
    <${Panel} className="p-6 sm:p-8">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold tracking-tight text-white">${title}</h2>
        <p className="mt-3 text-sm leading-6 text-iron-300">${description}</p>
        ${children && html`<div className="mt-5">${children}</div>`}
      </div>
    <//>
  `;
}
