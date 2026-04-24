import { html } from "../../../lib/html.js";
import { Icon } from "../../../design-system/icons.js";

export function EmptyState({ onSuggestion }) {
  const suggestions = [
    "Map the current gateway state",
    "Review recent thread activity",
    "Draft an extension readiness check",
  ];

  return html`
    <div className="v2-page-entrance flex min-h-0 flex-1 flex-col justify-center px-4 py-12 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-md border border-signal/25 bg-signal/10 text-signal">
          <${Icon} name="spark" className="h-6 w-6" />
        </div>
        <h2 className="font-serif text-5xl font-semibold leading-[0.98] tracking-[-0.04em] text-white md:text-7xl">
          Start with a concrete operator task.
        </h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-iron-300">
          Send a message, attach files, or ask for a gateway check. The workspace keeps approvals and runtime activity visible as the turn progresses.
        </p>
      </div>
      <div className="mt-10 grid max-w-4xl gap-3 sm:grid-cols-[1fr_1.15fr]">
        ${suggestions.map((text, index) => html`
          <button
            key=${text}
            onClick=${() => onSuggestion(text)}
            className=${[
              "v2-button min-h-24 rounded-xl border border-white/10 bg-white/[0.035] px-5 py-4 text-left text-sm font-medium leading-6 text-iron-100 hover:border-signal/40 hover:bg-signal/10",
              index === 0 ? "sm:row-span-2 sm:min-h-52" : "",
            ].join(" ")}
            style=${{ "--index": index }}
          >
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.16em] text-iron-300">
              ${String(index + 1).padStart(2, "0")}
            </span>
            ${text}
          </button>
        `)}
      </div>
    </div>
  `;
}
