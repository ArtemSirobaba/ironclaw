import { html } from "../../../lib/html.js";
import { Card } from "../../../design-system/card.js";
import { NETWORKING_FIELDS } from "../lib/settings-schema.js";
import { SettingsGroup } from "./settings-field.js";

export function NetworkingTab({ settings, onSave, savedKeys, isLoading }) {
  if (isLoading) {
    return html`
      <div className="space-y-5">
        ${[1, 2].map(
          (i) =>
            html`
              <${Card} key=${i} padding="md">
                <div className="mb-4 h-3 w-20 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
                ${[1, 2].map(
                  (j) =>
                    html`
                      <div key=${j} className="flex items-center justify-between border-t border-[var(--v2-panel-border)] py-4 first:border-0">
                        <div className="h-4 w-32 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
                        <div className="h-9 w-36 animate-pulse rounded bg-[var(--v2-surface-muted)]" />
                      </div>
                    `
                )}
              <//>
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
