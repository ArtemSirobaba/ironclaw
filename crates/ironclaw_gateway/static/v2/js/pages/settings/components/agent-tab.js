import { html } from "../../../lib/html.js";
import { AGENT_FIELDS } from "../lib/settings-schema.js";
import { SettingsGroup } from "./settings-field.js";

export function AgentTab({ settings, onSave, savedKeys, isLoading }) {
  if (isLoading) {
    return html`<${AgentSkeleton} />`;
  }

  return html`
    <div className="space-y-5">
      ${AGENT_FIELDS.map(
        (section) =>
          html`
            <${SettingsGroup}
              key=${section.group}
              group=${section.group}
              fields=${section.fields}
              settings=${settings}
              onSave=${onSave}
              savedKeys=${savedKeys}
            />
          `
      )}
    </div>
  `;
}

function AgentSkeleton() {
  return html`
    <div className="space-y-5">
      ${[1, 2, 3].map(
        (i) =>
          html`
            <div key=${i} className="v2-panel rounded-[18px] p-5 sm:p-6">
              <div className="v2-skeleton mb-4 h-3 w-20 rounded" />
              ${[1, 2, 3, 4].map(
                (j) =>
                  html`
                    <div key=${j} className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0">
                      <div>
                        <div className="v2-skeleton h-4 w-32 rounded" />
                        <div className="v2-skeleton mt-1 h-3 w-48 rounded" />
                      </div>
                      <div className="v2-skeleton h-9 w-36 rounded" />
                    </div>
                  `
              )}
            </div>
          `
      )}
    </div>
  `;
}
