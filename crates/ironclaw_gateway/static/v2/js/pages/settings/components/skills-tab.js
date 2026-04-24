import { html } from "../../../lib/html.js";
import { useT } from "../../../lib/i18n.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { useSkills } from "../hooks/useSkills.js";

export function SkillsTab() {
  const t = useT();
  const { skills, query } = useSkills();

  if (query.isLoading) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <div className="v2-skeleton mb-4 h-3 w-24 rounded" />
        ${[1, 2, 3].map((i) => html`
          <div key=${i} className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0">
            <div>
              <div className="v2-skeleton h-4 w-32 rounded" />
              <div className="v2-skeleton mt-1 h-3 w-48 rounded" />
            </div>
            <div className="v2-skeleton h-6 w-20 rounded-full" />
          </div>
        `)}
      </div>
    `;
  }

  if (query.error) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <p className="text-sm text-red-200">${t("skills.failedLoad", { message: query.error.message })}</p>
      </div>
    `;
  }

  if (skills.length === 0) {
    return html`
      <div className="v2-panel rounded-[18px] p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-white">${t("skills.noInstalled")}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-iron-300">
          ${t("skills.noInstalledDesc")}
        </p>
      </div>
    `;
  }

  return html`
    <div className="v2-panel rounded-[18px] p-5 sm:p-6">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
        ${t("skills.installed")}
      </h3>
      ${skills.map(
        (skill) => html`
          <div
            key=${skill.name || skill.id}
            className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-iron-200">${skill.name || skill.id}</span>
                <${StatusPill}
                  tone=${skill.trust_level === "trusted" ? "success" : "muted"}
                  label=${skill.trust_level || "installed"}
                />
              </div>
              ${skill.description && html`
                <div className="mt-1 text-xs text-iron-300">${skill.description}</div>
              `}
              ${skill.keywords?.length > 0 && html`
                <div className="mt-2 flex flex-wrap gap-1">
                  ${skill.keywords.map(
                    (kw) => html`
                      <span
                        key=${kw}
                        className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-300"
                      >
                        ${kw}
                      </span>
                    `
                  )}
                </div>
              `}
            </div>
            ${skill.version && html`
              <span className="shrink-0 font-mono text-[11px] text-iron-700">v${skill.version}</span>
            `}
          </div>
        `
      )}
    </div>
  `;
}
