import { html } from "../../lib/html.js";
import { EmptyPanel, PageHeader, StatusPill } from "../../design-system/primitives.js";
import { Icon } from "../../design-system/icons.js";

export function PlaceholderPage({ route }) {
  return html`
    <div className="flex h-full flex-col overflow-y-auto">
      <${PageHeader}
        eyebrow="Planned surface"
        title=${route.label}
        description=${route.description}
        actions=${html`<${StatusPill} tone="warning" label="mapped" />`}
      />
      <div className="v2-page-entrance grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <${EmptyPanel}
          title=${`${route.label} workspace`}
          description="This area is reserved for the next operator workflow while chat remains the primary live workspace."
        >
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-signal/25 bg-signal/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-signal">
              <${Icon} name="pulse" className="h-3.5 w-3.5" />
              Route mapped
            </span>
          </div>
        <//>
        <section className="v2-panel rounded-[18px] p-5">
          <div className="flex items-center gap-3 text-signal">
            <${Icon} name="settings" className="h-5 w-5" />
            <h2 className="text-lg font-semibold tracking-tight text-white">Implementation queue</h2>
          </div>
          <div className="mt-5 space-y-3">
            <div className="v2-skeleton h-2 rounded-full" />
            <div className="v2-skeleton h-2 w-4/5 rounded-full" />
            <div className="v2-skeleton h-2 w-2/3 rounded-full" />
          </div>
        </section>
      </div>
    </div>
  `;
}
