import { React, html } from "../../lib/html.js";
import { AdminTabs, AdminTabsMobile } from "./components/admin-tabs.js";
import { DashboardTab } from "./components/dashboard-tab.js";
import { AdminUsersTab } from "./components/users-tab.js";
import { UserDetail } from "./components/user-detail.js";
import { UsageTab } from "./components/usage-tab.js";

export function AdminPage() {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [selectedUserId, setSelectedUserId] = React.useState(null);

  const handleSelectUser = React.useCallback((userId) => {
    setSelectedUserId(userId);
    setActiveTab("users");
  }, []);

  const handleBack = React.useCallback(() => {
    setSelectedUserId(null);
  }, []);

  const tabContent = {
    dashboard: html`<${DashboardTab}
      onSelectUser=${handleSelectUser}
      onNavigateTab=${setActiveTab}
    />`,
    users: selectedUserId
      ? html`<${UserDetail} userId=${selectedUserId} onBack=${handleBack} />`
      : html`<${AdminUsersTab}
          selectedUserId=${selectedUserId}
          onSelectUser=${handleSelectUser}
        />`,
    usage: html`<${UsageTab} onSelectUser=${handleSelectUser} />`,
  };

  return html`
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="v2-page-entrance flex-1 p-4 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="sticky top-6">
              <${AdminTabs} activeTab=${activeTab} onTabChange=${(id) => { setActiveTab(id); setSelectedUserId(null); }} />
            </div>
          </aside>

          <div className="xl:hidden">
            <${AdminTabsMobile} activeTab=${activeTab} onTabChange=${(id) => { setActiveTab(id); setSelectedUserId(null); }} />
          </div>

          <div className="min-w-0 space-y-5">
            ${tabContent[activeTab] || tabContent.dashboard}
          </div>
        </div>
      </div>
    </div>
  `;
}
