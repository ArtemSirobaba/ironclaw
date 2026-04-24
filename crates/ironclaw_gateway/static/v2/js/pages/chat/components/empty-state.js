import { html } from "../../../lib/html.js";
import { Icon } from "../../../design-system/icons.js";

export function EmptyState({ onSuggestion }) {
  const suggestions = [
    "Map the current gateway state",
    "Review recent thread activity",
    "Draft an extension readiness check",
  ];

  return html`
    <div className="v2-page-entrance flex min-h-0 flex-1 flex-col justify-center px-4 py-12 sm:px-8">
      <div className="max-w-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg border border-signal/25 bg-signal/10 text-signal">
          <${Icon} name="spark" className="h-6 w-6" />
        </div>
        <h2 className="text-4xl font-semibold leading-none tracking-tight text-white md:text-5xl">Start with a concrete operator task.</h2>
        <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-iron-300">
          Send a message, attach files, or ask for a gateway check. The workspace keeps approvals and runtime activity visible as the turn progresses.
        </p>
      </div>
      <div className="mt-8 grid max-w-3xl gap-2 sm:grid-cols-[1fr_1.15fr]">
        ${suggestions.map((text, index) => html`
          <button
            key=${text}
            onClick=${() => onSuggestion(text)}
            className="v2-button rounded-md border border-white/10 bg-white/[0.035] px-4 py-3 text-left text-sm text-iron-100 hover:border-signal/40 hover:bg-signal/10"
            style=${{ "--index": index }}
          >
            ${text}
          </button>
        `)}
      </div>
    </div>
  `;
}
