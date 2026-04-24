import { React, html } from "../../../lib/html.js";
import { useT } from "../../../lib/i18n.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { Icon } from "../../../design-system/icons.js";
import { useTools } from "../hooks/useTools.js";

function ToolRow({ tool, onPermissionChange, isSaved }) {
  const t = useT();
  const permissionStates = [
    { value: "always_allow", label: t("tools.alwaysAllow"), tone: "success" },
    { value: "ask", label: t("tools.askEachTime"), tone: "warning" },
    { value: "disabled", label: t("tools.disabled"), tone: "danger" },
  ];

  const isLocked = tool.locked;
  const current = permissionStates.find((p) => p.value === tool.state) || permissionStates[1];
  const isDefault = tool.state === tool.default_state;

  return html`
    <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] py-3.5 first:border-0 first:pt-0">
      <div className="flex min-w-0 items-center gap-3">
        ${isLocked && html`<${Icon} name="lock" className="h-3.5 w-3.5 shrink-0 text-iron-700" />`}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-mono text-sm text-iron-200">${tool.name}</span>
            ${isDefault && html`
              <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-700">
                ${t("tools.default")}
              </span>
            `}
          </div>
          ${tool.description && html`
            <div className="mt-0.5 truncate text-xs text-iron-300">${tool.description}</div>
          `}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        ${isLocked
          ? html`<${StatusPill} tone=${current.tone} label=${current.label} />`
          : html`
              <select
                value=${tool.state}
                onChange=${(e) => onPermissionChange(tool.name, e.target.value)}
                aria-label=${t("tools.permissionFor", { name: tool.name })}
                className="h-8 rounded-md border border-white/12 bg-white/[0.04] px-2.5 font-mono text-xs text-iron-100 outline-none transition focus:border-signal/45"
              >
                ${permissionStates.map(
                  (p) => html`<option key=${p.value} value=${p.value}>${p.label}</option>`
                )}
              </select>
            `}
        ${isSaved && html`
          <span className="font-mono text-[11px] text-mint">${t("tools.saved")}</span>
        `}
      </div>
    </div>
  `;
}

export function ToolsTab() {
  const t = useT();
  const { tools, query, setPermission, savedTools } = useTools();
  const [filter, setFilter] = React.useState("");

  if (query.isLoading) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <div className="v2-skeleton mb-4 h-3 w-28 rounded" />
        ${[1, 2, 3, 4, 5].map((i) => html`
          <div key=${i} className="flex items-center justify-between border-t border-white/[0.06] py-3.5 first:border-0">
            <div className="v2-skeleton h-4 w-36 rounded" />
            <div className="v2-skeleton h-8 w-28 rounded" />
          </div>
        `)}
      </div>
    `;
  }

  if (query.error) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <p className="text-sm text-red-200">${t("tools.failedLoad", { message: query.error.message })}</p>
      </div>
    `;
  }

  const filtered = filter
    ? tools.filter((t) => t.name.toLowerCase().includes(filter.toLowerCase()))
    : tools;

  return html`
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value=${filter}
          onChange=${(e) => setFilter(e.target.value)}
          placeholder=${t("tools.filterPlaceholder")}
          className="h-9 flex-1 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
        />
        <span className="font-mono text-[11px] text-iron-700">
          ${filtered.length} / ${tools.length}
        </span>
      </div>

      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
          ${t("tools.permissions")}
        </h3>
        ${filtered.length === 0
          ? html`<p className="py-4 text-sm text-iron-300">${t("tools.noMatch")}</p>`
          : filtered.map(
              (tool) =>
                html`
                  <${ToolRow}
                    key=${tool.name}
                    tool=${tool}
                    onPermissionChange=${setPermission}
                    isSaved=${savedTools[tool.name]}
                  />
                `
            )}
      </div>
    </div>
  `;
}
