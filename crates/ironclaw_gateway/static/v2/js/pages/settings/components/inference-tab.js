import { html } from "../../../lib/html.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { useT } from "../../../lib/i18n.js";
import { INFERENCE_FIELDS } from "../lib/settings-schema.js";
import { SettingsGroup } from "./settings-field.js";

export function InferenceTab({ settings, gatewayStatus, onSave, savedKeys, isLoading }) {
  const t = useT();
  if (isLoading) {
    return html`<${SettingsSkeleton} />`;
  }

  const backend = settings.llm_backend || gatewayStatus?.llm_backend || "nearai";
  const model = settings.selected_model || gatewayStatus?.llm_model || "";

  return html`
    <div className="space-y-5">
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">${t("inference.provider")}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="text-xs text-iron-300">${t("inference.backend")}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-lg font-semibold text-white">${backend}</span>
              <${StatusPill} tone="signal" label=${t("inference.active")} />
            </div>
          </div>
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <div className="text-xs text-iron-300">${t("inference.model")}</div>
            <div className="mt-1 font-mono text-lg font-semibold text-white">
              ${model || t("inference.none")}
            </div>
          </div>
        </div>
      </div>

      ${INFERENCE_FIELDS.map(
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

function SettingsSkeleton() {
  return html`
    <div className="space-y-5">
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <div className="v2-skeleton mb-4 h-3 w-24 rounded" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="v2-skeleton h-3 w-16 rounded" />
            <div className="v2-skeleton mt-2 h-6 w-28 rounded" />
          </div>
          <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="v2-skeleton h-3 w-16 rounded" />
            <div className="v2-skeleton mt-2 h-6 w-40 rounded" />
          </div>
        </div>
      </div>
      ${[1, 2].map(
        (i) =>
          html`
            <div key=${i} className="v2-panel rounded-[18px] p-5 sm:p-6">
              <div className="v2-skeleton mb-4 h-3 w-20 rounded" />
              ${[1, 2, 3].map(
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
