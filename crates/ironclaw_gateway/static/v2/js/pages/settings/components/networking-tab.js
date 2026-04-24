import { html } from "../../../lib/html.js";
import { NETWORKING_FIELDS } from "../lib/settings-schema.js";
import { SettingsGroup } from "./settings-field.js";

export function NetworkingTab({ settings, onSave, savedKeys, isLoading }) {
  if (isLoading) {
    return html`
      <div className="space-y-5">
        ${[1, 2].map(
          (i) =>
            html`
              <div key=${i} className="v2-panel rounded-[18px] p-5 sm:p-6">
                <div className="v2-skeleton mb-4 h-3 w-20 rounded" />
                ${[1, 2].map(
                  (j) =>
                    html`
                      <div key=${j} className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0">
                        <div className="v2-skeleton h-4 w-32 rounded" />
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

  return html`
    <div className="space-y-5">
      ${NETWORKING_FIELDS.map(
        (section) =>
          html`
            <${SettingsGroup}
              key=${section.groupKey}
              groupKey=${section.groupKey}
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
