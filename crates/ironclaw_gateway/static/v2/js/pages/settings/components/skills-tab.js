import { html } from "../../../lib/html.js";
import { Badge } from "../../../design-system/badge.js";
import { Card } from "../../../design-system/card.js";
import { useT } from "../../../lib/i18n.js";
import { useSkills } from "../hooks/useSkills.js";

export function SkillsTab() {
  const t = useT();
  const { skills, query } = useSkills();

  if (query.isLoading) {
    return html`
      <${Card} padding="md">
        <div className="mb-4 h-3 w-24 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
        ${[1, 2, 3].map((i) => html`
          <div key=${i} className="flex items-center justify-between border-t border-[var(--v2-panel-border)] py-4 first:border-0">
            <div>
              <div className="h-4 w-32 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
              <div className="mt-1 h-3 w-48 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
            </div>
            <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--v2-surface-muted)]" />
          </div>
        `)}
      <//>
    `;
  }

  if (query.error) {
    return html`
      <${Card} padding="md">
        <p className="text-sm text-[var(--v2-danger-text)]">${t("skills.failedLoad", { message: query.error.message })}</p>
      <//>
    `;
  }

  if (skills.length === 0) {
    return html`
      <${Card} padding="lg">
        <h3 className="text-lg font-semibold text-[var(--v2-text-strong)]">${t("skills.noInstalled")}</h3>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--v2-text-muted)]">
          ${t("skills.noInstalledDesc")}
        </p>
      <//>
    `;
  }

  return html`
    <${Card} padding="md">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--v2-accent-text)]">
        ${t("skills.installed")}
      </h3>
      ${skills.map(
        (skill) => html`
          <div
            key=${skill.name || skill.id}
            className="flex items-start justify-between gap-4 border-t border-[var(--v2-panel-border)] py-4 first:border-0 first:pt-0"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[var(--v2-text)]">${skill.name || skill.id}</span>
                <${Badge}
                  tone=${skill.trust_level === "trusted" ? "positive" : "muted"}
                  label=${skill.trust_level || "installed"}
                  size="sm"
                />
              </div>
              ${skill.description && html`
                <div className="mt-1 text-xs text-[var(--v2-text-muted)]">${skill.description}</div>
              `}
              ${skill.keywords?.length > 0 && html`
                <div className="mt-2 flex flex-wrap gap-1">
                  ${skill.keywords.map(
                    (kw) => html`
                      <span
                        key=${kw}
                        className="rounded border border-[var(--v2-panel-border)] bg-[var(--v2-surface-soft)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--v2-text-muted)]"
                      >
                        ${kw}
                      </span>
                    `
                  )}
                </div>
              `}
            </div>
            ${skill.version && html`
              <span className="shrink-0 font-mono text-[11px] text-[var(--v2-text-faint)]">v${skill.version}</span>
            `}
          </div>
        `
      )}
    <//>
  `;
}
