import { html } from "../../../lib/html.js";
import { Button } from "../../../design-system/button.js";
import { EmptyPanel, Panel, StatusPill } from "../../../design-system/primitives.js";
import {
  canShowCancel,
  formatJobDate,
  stateLabel,
  statusToneForState,
  truncateJobId,
} from "../lib/jobs-presenters.js";

const FILTERS = [
  { value: "all", label: "All states" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "stuck", label: "Stuck" },
];

export function JobsList({
  jobs,
  totalJobs,
  selectedJobId,
  search,
  onSearchChange,
  stateFilter,
  onStateFilterChange,
  onSelectJob,
  onCancelJob,
  isBusy,
  isRefreshing,
}) {
  if (!jobs.length) {
    const hasFilters = Boolean(search.trim()) || stateFilter !== "all";
    return html`
      <${EmptyPanel}
        title=${totalJobs && hasFilters ? "No jobs match the current filters" : "No jobs yet"}
        description=${totalJobs && hasFilters
          ? "Try a broader search term or reset the state filter to see the rest of the queue."
          : "Background work, sandbox runs, and operator interventions will appear here once the gateway starts creating jobs."}
      />
    `;
  }

  return html`
    <div className="space-y-5">
      <${Panel} className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-iron-300">Explorer</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Job queue</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-iron-300">
              Search by title or ID, jump into a run, and stop active work without leaving the page.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">
            <span>${jobs.length} visible</span>
            <span>/</span>
            <span>${isRefreshing ? "refreshing" : "live"}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <input
            value=${search}
            onInput=${(event) => onSearchChange(event.target.value)}
            placeholder="Search job title or UUID"
            className="h-11 rounded-md border border-white/10 bg-iron-950/90 px-3 text-sm text-white outline-none transition focus:border-signal/45"
          />
          <select
            value=${stateFilter}
            onChange=${(event) => onStateFilterChange(event.target.value)}
            className="h-11 rounded-md border border-white/10 bg-iron-950/90 px-3 text-sm text-white outline-none transition focus:border-signal/45"
          >
            ${FILTERS.map((filter) => html`<option key=${filter.value} value=${filter.value}>${filter.label}</option>`)}
          </select>
        </div>
      <//>

      <div className="grid gap-3">
        ${jobs.map((job) => html`
          <article
            key=${job.id}
            className=${[
              "group flex flex-col gap-4 rounded-[18px] border p-5",
              selectedJobId === job.id
                ? "border-signal/35 bg-signal/10"
                : "border-white/10 bg-white/[0.03] hover:border-signal/30 hover:bg-white/[0.05]",
            ].join(" ")}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <button onClick=${() => onSelectJob(job.id)} className="min-w-0 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-white">${job.title || "Untitled job"}</h3>
                  <${StatusPill} tone=${statusToneForState(job.state)} label=${stateLabel(job.state)} />
                </div>
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">
                  <span>${truncateJobId(job.id)}</span>
                  <span>created ${formatJobDate(job.created_at)}</span>
                  ${job.started_at && html`<span>started ${formatJobDate(job.started_at)}</span>`}
                </div>
              </button>

              <div className="flex gap-2">
                ${canShowCancel(job) && html`
                  <${Button}
                    variant="secondary"
                    className="h-9 px-3 text-xs"
                    disabled=${isBusy}
                    onClick=${() => onCancelJob(job.id)}
                  >
                    Cancel
                  <//>
                `}
                <${Button} variant="ghost" className="h-9 px-3 text-xs" onClick=${() => onSelectJob(job.id)}>Open<//>
              </div>
            </div>
          </article>
        `)}
      </div>
    </div>
  `;
}
