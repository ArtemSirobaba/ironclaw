import { StatusPill } from "../../../design-system/primitives.js";
import { html } from "../../../lib/html.js";
import { useT } from "../../../lib/i18n.js";
import { useChannels } from "../hooks/useChannels.js";

function BuiltinChannelCard({ name, description, enabled, detail }) {
  const t = useT();
  return html`
    <div
      className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-iron-200">${name}</span>
          <${StatusPill}
            tone=${enabled ? "success" : "muted"}
            label=${enabled ? t("channels.statusOn") : t("channels.statusOff")}
          />
        </div>
        <div className="mt-1 text-xs text-iron-300">${description}</div>
        ${detail &&
        html`<div className="mt-1 font-mono text-[11px] text-iron-700">
          ${detail}
        </div>`}
      </div>
    </div>
  `;
}

function ExtensionChannelCard({ channel, registryEntry }) {
  const t = useT();
  const name =
    registryEntry?.display_name ||
    channel?.name ||
    registryEntry?.name ||
    t("common.unknown");
  const desc = registryEntry?.description || channel?.description || "";
  const isInstalled = Boolean(channel);
  const state = channel?.onboarding_state || "setup_required";

  const toneMap = {
    ready: "success",
    auth_required: "warning",
    pairing_required: "copper",
    setup_required: "muted",
  };
  const labelMap = {
    ready: t("channels.ready"),
    auth_required: t("channels.authNeeded"),
    pairing_required: t("channels.pairing"),
    setup_required: t("channels.setup"),
  };

  return html`
    <div
      className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-iron-200">${name}</span>
          ${isInstalled
            ? html`<${StatusPill}
                tone=${toneMap[state] || "muted"}
                label=${labelMap[state] || state}
              />`
            : html`<${StatusPill}
                tone="muted"
                label=${t("channels.available")}
              />`}
        </div>
        <div className="mt-1 text-xs text-iron-300">${desc}</div>
      </div>
    </div>
  `;
}

export function ChannelsTab() {
  const t = useT();
  const {
    status,
    channels,
    channelRegistry,
    mcpServers,
    mcpRegistry,
    isLoading,
  } = useChannels();

  if (isLoading) {
    return html`
      <div className="space-y-5">
        <div className="v2-panel rounded-[18px] p-5 sm:p-6">
          <div className="v2-skeleton mb-4 h-3 w-28 rounded" />
          ${[1, 2, 3].map(
            (i) => html`
              <div
                key=${i}
                className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0"
              >
                <div className="v2-skeleton h-4 w-32 rounded" />
                <div className="v2-skeleton h-6 w-16 rounded-full" />
              </div>
            `
          )}
        </div>
      </div>
    `;
  }

  const enabledChannels = status.enabled_channels || [];
  const installedNames = new Set(channels.map((c) => c.name));
  const availableRegistry = channelRegistry.filter(
    (r) => !installedNames.has(r.name)
  );
  const installedMcpNames = new Set(mcpServers.map((m) => m.name));
  const availableMcp = mcpRegistry.filter(
    (r) => !installedMcpNames.has(r.name)
  );

  return html`
    <div className="space-y-5">
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <h3
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal"
        >
          ${t("channels.builtIn")}
        </h3>
        <${BuiltinChannelCard}
          name=${t("channels.webGateway")}
          description=${t("channels.webGatewayDesc")}
          enabled=${true}
          detail=${"SSE: " +
          (status.sse_connections || 0) +
          " · WS: " +
          (status.ws_connections || 0)}
        />
        <${BuiltinChannelCard}
          name=${t("channels.httpWebhook")}
          description=${t("channels.httpWebhookDesc")}
          enabled=${enabledChannels.includes("http")}
          detail="ENABLE_HTTP=true"
        />
        <${BuiltinChannelCard}
          name=${t("channels.cli")}
          description=${t("channels.cliDesc")}
          enabled=${enabledChannels.includes("cli")}
          detail="ironclaw run --cli"
        />
        <${BuiltinChannelCard}
          name=${t("channels.repl")}
          description=${t("channels.replDesc")}
          enabled=${enabledChannels.includes("repl")}
          detail="ironclaw run --repl"
        />
      </div>

      ${(channels.length > 0 || availableRegistry.length > 0) &&
      html`
        <div className="v2-panel rounded-[18px] p-5 sm:p-6">
          <h3
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal"
          >
            ${t("channels.messaging")}
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
          <h3
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal"
          >
            ${t("channels.mcpServers")}
          </h3>
          ${mcpServers.map(
            (m) =>
              html`
                <div
                  key=${m.name}
                  className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-iron-200"
                        >${m.display_name || m.name}</span
                      >
                      <${StatusPill}
                        tone=${m.active ? "success" : "muted"}
                        label=${m.active
                          ? t("channels.active")
                          : t("channels.inactive")}
                      />
                    </div>
                    <div className="mt-1 text-xs text-iron-300">
                      ${m.description || ""}
                    </div>
                  </div>
                </div>
              `
          )}
          ${availableMcp.map(
            (r) =>
              html`
                <div
                  key=${r.name}
                  className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-4 first:border-0 first:pt-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-iron-200"
                        >${r.display_name || r.name}</span
                      >
                      <${StatusPill}
                        tone="muted"
                        label=${t("channels.available")}
                      />
                    </div>
                    <div className="mt-1 text-xs text-iron-300">
                      ${r.description || ""}
                    </div>
                  </div>
                </div>
              `
          )}
        </div>
      `}
    </div>
  `;
}
