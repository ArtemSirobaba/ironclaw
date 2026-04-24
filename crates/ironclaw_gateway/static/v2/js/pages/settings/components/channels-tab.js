import { html } from "../../../lib/html.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { Icon } from "../../../design-system/icons.js";
import { useChannels } from "../hooks/useChannels.js";

function BuiltinChannelCard({ name, description, enabled, detail }) {
  return html`
    <div className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-iron-200">${name}</span>
          <${StatusPill} tone=${enabled ? "success" : "muted"} label=${enabled ? "on" : "off"} />
        </div>
        <div className="mt-1 text-xs text-iron-300">${description}</div>
        ${detail && html`<div className="mt-1 font-mono text-[11px] text-iron-700">${detail}</div>`}
      </div>
    </div>
  `;
}

function ExtensionChannelCard({ channel, registryEntry }) {
  const name = registryEntry?.display_name || channel?.name || registryEntry?.name || "Unknown";
  const desc = registryEntry?.description || channel?.description || "";
  const isInstalled = Boolean(channel);
  const state = channel?.onboarding_state || "setup_required";

  const toneMap = { ready: "success", auth_required: "warning", pairing_required: "copper", setup_required: "muted" };
  const labelMap = { ready: "ready", auth_required: "auth needed", pairing_required: "pairing", setup_required: "setup" };

  return html`
    <div className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-iron-200">${name}</span>
          ${isInstalled
            ? html`<${StatusPill} tone=${toneMap[state] || "muted"} label=${labelMap[state] || state} />`
            : html`<${StatusPill} tone="muted" label="available" />`}
        </div>
        <div className="mt-1 text-xs text-iron-300">${desc}</div>
      </div>
    </div>
  `;
}

export function ChannelsTab() {
  const { status, channels, channelRegistry, mcpServers, mcpRegistry, isLoading } = useChannels();

  if (isLoading) {
    return html`
      <div className="space-y-5">
        <div className="v2-panel rounded-[18px] p-5 sm:p-6">
          <div className="v2-skeleton mb-4 h-3 w-28 rounded" />
          ${[1, 2, 3].map((i) => html`
            <div key=${i} className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0">
              <div className="v2-skeleton h-4 w-32 rounded" />
              <div className="v2-skeleton h-6 w-16 rounded-full" />
            </div>
          `)}
        </div>
      </div>
    `;
  }

  const enabledChannels = status.enabled_channels || [];

  const installedNames = new Set(channels.map((c) => c.name));
  const availableRegistry = channelRegistry.filter((r) => !installedNames.has(r.name));

  const installedMcpNames = new Set(mcpServers.map((m) => m.name));
  const availableMcp = mcpRegistry.filter((r) => !installedMcpNames.has(r.name));

  return html`
    <div className="space-y-5">
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Built-in channels</h3>
        <${BuiltinChannelCard}
          name="Web Gateway"
          description="Browser-based chat with SSE streaming"
          enabled=${true}
          detail=${"SSE: " + (status.sse_connections || 0) + " · WS: " + (status.ws_connections || 0)}
        />
        <${BuiltinChannelCard}
          name="HTTP Webhook"
          description="Inbound webhook endpoint for external integrations"
          enabled=${enabledChannels.includes("http")}
          detail="ENABLE_HTTP=true"
        />
        <${BuiltinChannelCard}
          name="CLI"
          description="Terminal interface with TUI or simple REPL"
          enabled=${enabledChannels.includes("cli")}
          detail="ironclaw run --cli"
        />
        <${BuiltinChannelCard}
          name="REPL"
          description="Minimal read-eval-print loop for testing"
          enabled=${enabledChannels.includes("repl")}
          detail="ironclaw run --repl"
        />
      </div>

      ${(channels.length > 0 || availableRegistry.length > 0) &&
      html`
        <div className="v2-panel rounded-[18px] p-5 sm:p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            Messaging channels
          </h3>
          ${channels.map(
            (ch) => html`
              <${ExtensionChannelCard}
                key=${ch.name}
                channel=${ch}
                registryEntry=${channelRegistry.find((r) => r.name === ch.name)}
              />
            `
          )}
          ${availableRegistry.map(
            (r) => html`
              <${ExtensionChannelCard} key=${r.name} registryEntry=${r} />
            `
          )}
        </div>
      `}

      ${(mcpServers.length > 0 || availableMcp.length > 0) &&
      html`
        <div className="v2-panel rounded-[18px] p-5 sm:p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            MCP servers
          </h3>
          ${mcpServers.map(
            (m) =>
              html`
                <div key=${m.name} className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-iron-200">${m.display_name || m.name}</span>
                      <${StatusPill} tone=${m.active ? "success" : "muted"} label=${m.active ? "active" : "inactive"} />
                    </div>
                    <div className="mt-1 text-xs text-iron-300">${m.description || ""}</div>
                  </div>
                </div>
              `
          )}
          ${availableMcp.map(
            (r) =>
              html`
                <div key=${r.name} className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-iron-200">${r.display_name || r.name}</span>
                      <${StatusPill} tone="muted" label="available" />
                    </div>
                    <div className="mt-1 text-xs text-iron-300">${r.description || ""}</div>
                  </div>
                </div>
              `
          )}
        </div>
      `}
    </div>
  `;
}
