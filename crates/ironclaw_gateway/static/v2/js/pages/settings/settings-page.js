import { useOutletContext } from "react-router";
import { React, html } from "../../lib/html.js";
import { useT } from "../../lib/i18n.js";
import { AgentTab } from "./components/agent-tab.js";
import { ChannelsTab } from "./components/channels-tab.js";
import { InferenceTab } from "./components/inference-tab.js";
import { LanguageTab } from "./components/language-tab.js";
import { NetworkingTab } from "./components/networking-tab.js";
import { RestartBanner } from "./components/restart-banner.js";
import {
  SettingsTabs,
  SettingsTabsMobile,
} from "./components/settings-tabs.js";
import { SkillsTab } from "./components/skills-tab.js";
import { ToolsTab } from "./components/tools-tab.js";
import { UsersTab } from "./components/users-tab.js";
import { useSettings } from "./hooks/useSettings.js";

export function SettingsPage() {
  const t = useT();
  const { gatewayStatus } = useOutletContext();
  const [activeTab, setActiveTab] = React.useState("inference");
  const { settings, query, save, savedKeys, needsRestart, saveError } =
    useSettings();

  const isLoading = query.isLoading;

  const tabContent = {
    inference: html`<${InferenceTab}
      settings=${settings}
      gatewayStatus=${gatewayStatus}
      onSave=${save}
      savedKeys=${savedKeys}
      isLoading=${isLoading}
    />`,
    agent: html`<${AgentTab}
      settings=${settings}
      onSave=${save}
      savedKeys=${savedKeys}
      isLoading=${isLoading}
    />`,
    channels: html`<${ChannelsTab} />`,
    networking: html`<${NetworkingTab}
      settings=${settings}
      onSave=${save}
      savedKeys=${savedKeys}
      isLoading=${isLoading}
    />`,
    tools: html`<${ToolsTab} />`,
    skills: html`<${SkillsTab} />`,
    users: html`<${UsersTab} />`,
    language: html`<${LanguageTab} />`,
  };

  return html`
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="v2-page-entrance flex-1 p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <${SettingsTabs}
                activeTab=${activeTab}
                onTabChange=${setActiveTab}
              />
            </div>
          </aside>

          <div className="xl:hidden">
            <${SettingsTabsMobile}
              activeTab=${activeTab}
              onTabChange=${setActiveTab}
            />
          </div>

          <div className="min-w-0 space-y-5">
            <${RestartBanner} visible=${needsRestart} />

            ${saveError &&
            html`
              <div
                className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                ${t("error.saveFailed", { message: saveError.message })}
              </div>
            `}
            ${tabContent[activeTab] || tabContent.inference}
          </div>
        </div>
      </div>
    </div>
  `;
}
