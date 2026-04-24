import { React, html } from "../../../lib/html.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { Button } from "../../../design-system/button.js";
import { Icon } from "../../../design-system/icons.js";
import { KIND_LABELS, STATE_TONES, STATE_LABELS } from "../lib/extensions-schema.js";

export function ExtensionCard({ ext, onActivate, onConfigure, onRemove, isBusy }) {
  const state = ext.onboarding_state || ext.activation_status || (ext.active ? "active" : "installed");
  const tone = STATE_TONES[state] || "muted";
  const label = STATE_LABELS[state] || state;
  const kindLabel = KIND_LABELS[ext.kind] || ext.kind;

  return html`
    <div className="flex flex-col gap-3 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-iron-200">${ext.display_name || ext.name}</span>
            <${StatusPill} tone=${tone} label=${label} />
            <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-700">
              ${kindLabel}
            </span>
            ${ext.version && html`
              <span className="font-mono text-[10px] text-iron-700">v${ext.version}</span>
            `}
          </div>
          ${ext.description && html`
            <div className="mt-1 text-xs leading-5 text-iron-300">${ext.description}</div>
          `}
          ${ext.tools && ext.tools.length > 0 && html`
            <div className="mt-2 flex flex-wrap gap-1">
              ${ext.tools.map((t) => html`
                <span key=${t} className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-300">
                  ${t}
                </span>
              `)}
            </div>
          `}
          ${ext.activation_error && html`
            <div className="mt-2 rounded-md border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-200">
              ${ext.activation_error}
            </div>
          `}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        ${state !== "active" && state !== "ready" && ext.kind !== "wasm_channel" && html`
          <${Button}
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick=${() => onActivate({ name: ext.name })}
            disabled=${isBusy}
          >
            Activate
          <//>
        `}
        ${(ext.needs_setup || ext.has_auth) && html`
          <${Button}
            variant="ghost"
            className="h-8 px-3 text-xs"
            onClick=${() => onConfigure(ext.name)}
            disabled=${isBusy}
          >
            ${ext.authenticated ? "Reconfigure" : "Configure"}
          <//>
        `}
        ${ext.kind === "wasm_channel" && (state === "setup_required" || state === "failed") && html`
          <${Button}
            variant="secondary"
            className="h-8 px-3 text-xs"
            onClick=${() => onConfigure(ext.name)}
            disabled=${isBusy}
          >
            Setup
          <//>
        `}
        ${ext.kind === "wasm_channel" && (state === "active" || state === "ready" || state === "pairing_required" || state === "pairing") && html`
          <${Button}
            variant="ghost"
            className="h-8 px-3 text-xs"
            onClick=${() => onConfigure(ext.name)}
            disabled=${isBusy}
          >
            Reconfigure
          <//>
        `}
        <${Button}
          variant="ghost"
          className="h-8 px-3 text-xs text-red-300 hover:text-red-200"
          onClick=${() => onRemove({ name: ext.name })}
          disabled=${isBusy}
        >
          Remove
        <//>
      </div>
    </div>
  `;
}

export function RegistryCard({ entry, onInstall, isBusy }) {
  const kindLabel = KIND_LABELS[entry.kind] || entry.kind;

  return html`
    <div className="flex flex-col gap-3 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-iron-200">${entry.display_name || entry.name}</span>
            <${StatusPill} tone="muted" label="available" />
            <span className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-700">
              ${kindLabel}
            </span>
            ${entry.version && html`
              <span className="font-mono text-[10px] text-iron-700">v${entry.version}</span>
            `}
          </div>
          ${entry.description && html`
            <div className="mt-1 text-xs leading-5 text-iron-300">${entry.description}</div>
          `}
          ${entry.keywords && entry.keywords.length > 0 && html`
            <div className="mt-2 flex flex-wrap gap-1">
              ${entry.keywords.map((kw) => html`
                <span key=${kw} className="rounded border border-white/[0.06] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-iron-300">
                  ${kw}
                </span>
              `)}
            </div>
          `}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <${Button}
          variant="secondary"
          className="h-8 px-3 text-xs"
          onClick=${() => onInstall({ name: entry.name, kind: entry.kind, displayName: entry.display_name })}
          disabled=${isBusy}
        >
          <${Icon} name="plus" className="mr-1.5 h-3.5 w-3.5" />
          Install
        <//>
      </div>
    </div>
  `;
}
