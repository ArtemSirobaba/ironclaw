import { html } from "../../../lib/html.js";
import { Button } from "../../../design-system/button.js";
import { EmptyPanel, Panel, StatusPill } from "../../../design-system/primitives.js";
import { formatMissionDate, missionTone } from "../lib/missions-presenters.js";

const statusOptions = ["all", "Active", "Paused", "Failed", "Completed"];

function FilterSelect({ value, onChange, children, label }) {
  return html`
    <label className="min-w-[160px] flex-1 sm:flex-none">
      <span className="sr-only">${label}</span>
      <select
        value=${value}
        onChange=${(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none transition focus:border-signal/40"
      >
        ${children}
      </select>
    </label>
  `;
}

function MissionRow({ mission, selectedMissionId, onSelectMission, onOpenProject }) {
  const selected = selectedMissionId === mission.id;

  return html`
    <div
      className=${[
        "w-full rounded-xl border p-4 text-left transition",
        selected
          ? "border-signal/35 bg-signal/10"
          : "border-white/10 bg-white/[0.025] hover:border-signal/25 hover:bg-white/[0.045]",
      ].join(" ")}
    >
      <button type="button" onClick=${() => onSelectMission(mission.id)} className="block w-full text-left">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 truncate text-lg font-semibold text-white">${mission.name}</div>
              <${StatusPill} tone=${missionTone(mission.status)} label=${mission.status} />
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-iron-300">${mission.goal || "No mission goal set."}</p>
          </div>
          <div className="shrink-0 text-right font-mono text-[11px] uppercase tracking-[0.14em] text-iron-400">
            <div>${mission.cadence_description || mission.cadence_type || "manual"}</div>
            <div className="mt-1">${mission.thread_count || 0} threads</div>
          </div>
        </div>
      </button>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-iron-400">
          Updated ${formatMissionDate(mission.updated_at)}
        </span>
        <${Button}
          variant="ghost"
          onClick=${(event) => {
            event.stopPropagation();
            onOpenProject(mission.project.id);
          }}
        >
          ${mission.project.name}
        <//>
      </div>
    </div>
  `;
}

export function MissionsList({
  missions,
  totalMissions,
  selectedMissionId,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  projectFilter,
  onProjectFilterChange,
  projectOptions,
  onSelectMission,
  onOpenProject,
}) {
  return html`
    <${Panel} className="p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-iron-300">Missions</div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">Execution loops</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-iron-300">
            ${totalMissions} missions across ${projectOptions.length} project workspaces.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          value=${search}
          onChange=${(event) => onSearchChange(event.target.value)}
          placeholder="Search missions"
          className="h-11 min-w-[220px] flex-1 rounded-md border border-white/10 bg-white/[0.035] px-3 text-sm text-white outline-none transition placeholder:text-iron-400 focus:border-signal/40"
        />
        <${FilterSelect} value=${statusFilter} onChange=${onStatusFilterChange} label="Status">
          ${statusOptions.map((status) => html`<option key=${status} value=${status}>${status === "all" ? "All statuses" : status}<//>`)}
        <//>
        <${FilterSelect} value=${projectFilter} onChange=${onProjectFilterChange} label="Project">
          <option value="all">All projects</option>
          ${projectOptions.map((project) => html`<option key=${project.id} value=${project.id}>${project.name}<//>`)}
        <//>
      </div>

      <div className="mt-5 space-y-3">
        ${missions.length
          ? missions.map((mission) => html`
              <${MissionRow}
                key=${mission.id}
                mission=${mission}
                selectedMissionId=${selectedMissionId}
                onSelectMission=${onSelectMission}
                onOpenProject=${onOpenProject}
              />
            `)
          : html`
              <${EmptyPanel}
                title="No missions match"
                description="Adjust the search or filters to find a mission loop."
              />
            `}
      </div>
    <//>
  `;
}
