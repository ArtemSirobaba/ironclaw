import { html } from "../../../lib/html.js";
import { Button } from "../../../design-system/button.js";
import { EmptyPanel, Panel, StatusPill } from "../../../design-system/primitives.js";
import {
  compactCount,
  formatCurrency,
  formatProjectRelativeTime,
  healthTone,
} from "../lib/projects-presenters.js";

function ProjectCard({ project, onOpen }) {
  return html`
    <article className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-signal/30 hover:bg-white/[0.05]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-2xl font-semibold tracking-[-0.03em] text-white">${project.name}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-iron-300">
            ${project.description || "No project description yet. The workspace is still being shaped by active missions and thread history."}
          </p>
        </div>
        <${StatusPill} tone=${healthTone(project.health)} label=${project.health || "unknown"} />
      </div>

      ${project.goals?.length
        ? html`
            <div className="mt-4 flex flex-wrap gap-2">
              ${project.goals.slice(0, 3).map((goal, index) => html`
                <span key=${index} className="rounded-full border border-white/10 px-3 py-1 text-xs text-iron-200">
                  ${goal}
                </span>
              `)}
            </div>
          `
        : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/8 bg-iron-950/55 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-iron-300">Runtime</div>
          <div className="mt-2 text-sm text-white">${compactCount(project.active_missions || 0, "mission")}</div>
          <div className="mt-1 text-xs text-iron-300">${compactCount(project.threads_today || 0, "thread")} today</div>
        </div>
        <div className="rounded-2xl border border-white/8 bg-iron-950/55 p-3">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-iron-300">Risk</div>
          <div className="mt-2 text-sm text-white">${compactCount(project.pending_gates || 0, "gate")}</div>
          <div className="mt-1 text-xs text-iron-300">${compactCount(project.failures_24h || 0, "failure")} in 24h</div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <div className="text-sm text-iron-300">
          <div>${formatCurrency(project.cost_today_usd || 0)} spend today</div>
          <div className="mt-1 text-xs uppercase tracking-[0.16em] text-iron-500">${formatProjectRelativeTime(project.last_activity)}</div>
        </div>
        <${Button} variant="secondary" onClick=${() => onOpen(project.id)}>Open workspace<//>
      </div>
    </article>
  `;
}

function GeneralProjectCard({ project, onOpen }) {
  return html`
    <${Panel} className="overflow-hidden p-5 sm:p-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-signal">General workspace</div>
          <h2 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em] text-white">Default project control room</h2>
          <p className="mt-3 text-sm leading-6 text-iron-200">
            Shared context, ad hoc work, and the catch-all runtime path for threads that are not yet promoted into a named project.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-2xl border border-white/10 bg-iron-950/55 px-4 py-3 text-sm text-iron-200">
            ${compactCount(project.active_missions || 0, "active mission")}
          </div>
          <div className="rounded-2xl border border-white/10 bg-iron-950/55 px-4 py-3 text-sm text-iron-200">
            ${compactCount(project.threads_today || 0, "thread")} today
          </div>
          <${Button} variant="secondary" onClick=${() => onOpen(project.id)}>Open general workspace<//>
        </div>
      </div>
    <//>
  `;
}

export function ProjectsGrid({
  projects,
  totalProjects,
  search,
  onSearchChange,
  onOpenProject,
  onCreateProject,
  isPreparingChat,
}) {
  const defaultProject = projects.find((project) => project.name === "default");
  const scopedProjects = projects.filter((project) => project.name !== "default");

  if (!projects.length && totalProjects > 0) {
    return html`
      <${EmptyPanel}
        title="No projects match the current search"
        description="Try a broader search term or clear the filter to return to the full workspace map."
      />
    `;
  }

  if (!projects.length) {
    return html`
      <${EmptyPanel}
        title="No projects yet"
        description="Projects appear once the assistant creates durable workspaces. You can start from chat and ask IronClaw to spin up a scoped project for ongoing work."
      >
        <${Button} onClick=${onCreateProject}>Create from chat<//>
      <//>
    `;
  }

  return html`
    <div className="space-y-5">
      ${defaultProject && html`<${GeneralProjectCard} project=${defaultProject} onOpen=${onOpenProject} />`}

      <${Panel} className="p-4 sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-iron-300">Explorer</div>
            <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.04em] text-white">Scoped projects</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-iron-300">
              Browse durable workspaces, inspect missions, review recent activity, and jump into the project that needs you now.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              value=${search}
              onInput=${(event) => onSearchChange(event.target.value)}
              placeholder="Search projects"
              className="h-11 min-w-[220px] rounded-md border border-white/10 bg-iron-950/90 px-3 text-sm text-white outline-none transition focus:border-signal/45"
            />
            <${Button} onClick=${onCreateProject}>${isPreparingChat ? "Preparing chat..." : "New project"}<//>
          </div>
        </div>
      <//>

      ${scopedProjects.length
        ? html`<div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
            ${scopedProjects.map((project) => html`<${ProjectCard} key=${project.id} project=${project} onOpen=${onOpenProject} />`)}
          </div>`
        : html`
            <${EmptyPanel}
              title="Only the general workspace is active"
              description="Create a named project when work deserves its own missions, files, widgets, and long-running context."
            >
              <${Button} onClick=${onCreateProject}>${isPreparingChat ? "Preparing chat..." : "Start a project"}<//>
            <//>
          `}
    </div>
  `;
}
