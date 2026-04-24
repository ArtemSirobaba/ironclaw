import { React, html } from "../../lib/html.js";
import { useOutletContext } from "react-router";
import { PageHeader } from "../../design-system/primitives.js";
import { useExtensions } from "./hooks/useExtensions.js";
import { ExtensionsTabs, ExtensionsTabsMobile } from "./components/extensions-tabs.js";
import { InstalledTab } from "./components/installed-tab.js";
import { ChannelsTab } from "./components/channels-tab.js";
import { McpTab } from "./components/mcp-tab.js";
import { RegistryTab } from "./components/registry-tab.js";
import { ConfigureModal } from "./components/configure-modal.js";
import { ActionToast } from "./components/action-toast.js";

export function ExtensionsPage() {
  const { gatewayStatus } = useOutletContext();
  const [activeTab, setActiveTab] = React.useState("installed");
  const [configuring, setConfiguring] = React.useState(null);

  const {
    status,
    extensions,
    channels,
    mcpServers,
    tools,
    channelRegistry,
    mcpRegistry,
    toolRegistry,
    isLoading,
    isBusy,
    actionResult,
    clearResult,
    install,
    activate,
    remove,
    invalidate,
  } = useExtensions();

  const handleConfigure = React.useCallback((name) => setConfiguring(name), []);
  const handleCloseModal = React.useCallback(() => setConfiguring(null), []);
  const handleSaved = React.useCallback(() => invalidate(), [invalidate]);

  const counts = {
    installed: extensions.length || null,
    channels: channels.length || null,
    mcp: mcpServers.length || null,
    registry: (toolRegistry.length + channelRegistry.length + mcpRegistry.length) || null,
  };

  if (isLoading) {
    return html`
      <div className="flex h-full flex-col overflow-y-auto">
        <${PageHeader}
          eyebrow="System"
          title="Extensions"
          description="Channels, tools, setup status, readiness, and install state."
        />
        <div className="v2-page-entrance flex-1 p-4 sm:p-6">
          <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="hidden xl:block">
              <div className="space-y-2">
                ${[1, 2, 3, 4].map((i) => html`
                  <div key=${i} className="v2-skeleton h-10 w-full rounded-md" />
                `)}
              </div>
            </aside>
            <div className="space-y-5">
              <div className="v2-panel rounded-[18px] p-5 sm:p-6">
                <div className="v2-skeleton mb-4 h-3 w-28 rounded" />
                ${[1, 2, 3].map((i) => html`
                  <div key=${i} className="flex items-center justify-between border-t border-white/[0.06] py-4 first:border-0">
                    <div>
                      <div className="v2-skeleton h-4 w-40 rounded" />
                      <div className="v2-skeleton mt-2 h-3 w-56 rounded" />
                    </div>
                    <div className="v2-skeleton h-7 w-16 rounded-full" />
                  </div>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const tabContent = {
    installed: html`<${InstalledTab}
      extensions=${extensions}
      onActivate=${activate}
      onConfigure=${handleConfigure}
      onRemove=${remove}
      isBusy=${isBusy}
    />`,
    channels: html`<${ChannelsTab}
      status=${status}
      channels=${channels}
      channelRegistry=${channelRegistry}
      onActivate=${activate}
      onConfigure=${handleConfigure}
      onRemove=${remove}
      onInstall=${install}
      isBusy=${isBusy}
    />`,
    mcp: html`<${McpTab}
      mcpServers=${mcpServers}
      mcpRegistry=${mcpRegistry}
      onActivate=${activate}
      onConfigure=${handleConfigure}
      onRemove=${remove}
      onInstall=${install}
      isBusy=${isBusy}
    />`,
    registry: html`<${RegistryTab}
      toolRegistry=${toolRegistry}
      channelRegistry=${channelRegistry}
      mcpRegistry=${mcpRegistry}
      onInstall=${install}
      isBusy=${isBusy}
    />`,
  };

  return html`
    <div className="flex h-full flex-col overflow-y-auto">
      <${PageHeader}
        eyebrow="System"
        title="Extensions"
        description="Channels, tools, setup status, readiness, and install state."
      />

      <div className="v2-page-entrance flex-1 p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <${ExtensionsTabs}
                activeTab=${activeTab}
                onTabChange=${setActiveTab}
                counts=${counts}
              />
            </div>
          </aside>

          <div className="xl:hidden">
            <${ExtensionsTabsMobile}
              activeTab=${activeTab}
              onTabChange=${setActiveTab}
              counts=${counts}
            />
          </div>

          <div className="min-w-0 space-y-5">
            <${ActionToast} result=${actionResult} onDismiss=${clearResult} />
            ${tabContent[activeTab] || tabContent.installed}
          </div>
        </div>
      </div>

      ${configuring && html`
        <${ConfigureModal}
          extensionName=${configuring}
          onClose=${handleCloseModal}
          onSaved=${handleSaved}
        />
      `}
    </div>
  `;
}
