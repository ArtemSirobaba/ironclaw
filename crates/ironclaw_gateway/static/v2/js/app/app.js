import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { React, html } from "../lib/html.js";
import { useAuthSession } from "./auth.js";
import { defaultRoute } from "./routes.js";
import { GatewayLayout } from "../layout/gateway-layout.js";
import { LoginPage as LoginView } from "../pages/login/login-page.js";
import { ChatPage } from "../pages/chat/chat-page.js";
import { WorkspacePage } from "../pages/workspace/workspace-page.js";
import { ProjectsPage } from "../pages/projects/projects-page.js";
import { MissionsPage } from "../pages/missions/missions-page.js";
import { JobsPage } from "../pages/jobs/jobs-page.js";
import { ExtensionsPage } from "../pages/extensions/extensions-page.js";
import { SettingsPage } from "../pages/settings/settings-page.js";
import { AdminPage } from "../pages/admin/admin-page.js";
import { LogsPage } from "../pages/logs/logs-page.js";

function LoginPage({ auth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || defaultRoute;

  const handleSubmit = React.useCallback(
    (token) => {
      auth.signIn(token);
      navigate(from, { replace: true });
    },
    [auth, from, navigate]
  );

  if (auth.isAuthenticated) {
    return html`<${Navigate} to=${from} replace />`;
  }

  return html`<${LoginView} initialToken=${auth.token} error=${auth.error} onSubmit=${handleSubmit} />`;
}

function RequireAuth({ auth, children }) {
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return html`<${Navigate} to="/login" replace state=${{ from: location }} />`;
  }

  return children;
}

function AuthenticatedLayout({ auth }) {
  return html`
    <${RequireAuth} auth=${auth}>
      <${GatewayLayout} token=${auth.token} onSignOut=${auth.signOut} />
    <//>
  `;
}

export function App() {
  const auth = useAuthSession();

  return html`
    <${BrowserRouter} basename="/v2">
      <${Routes}>
        <${Route} path="/login" element=${html`<${LoginPage} auth=${auth} />`} />
        <${Route} path="/" element=${html`<${AuthenticatedLayout} auth=${auth} />`}>
          <${Route} index element=${html`<${Navigate} to=${defaultRoute} replace />`} />
          <${Route} path="overview" element=${html`<${Navigate} to=${defaultRoute} replace />`} />
          <${Route} path="chat" element=${html`<${ChatPage} />`} />
          <${Route} path="workspace" element=${html`<${WorkspacePage} />`} />
          <${Route} path="workspace/*" element=${html`<${WorkspacePage} />`} />
          <${Route} path="projects" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId/missions/:missionId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId/threads/:threadId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="missions" element=${html`<${MissionsPage} />`} />
          <${Route} path="missions/:missionId" element=${html`<${MissionsPage} />`} />
          <${Route} path="jobs" element=${html`<${JobsPage} />`} />
          <${Route} path="jobs/:jobId" element=${html`<${JobsPage} />`} />
          <${Route} path="extensions" element=${html`<${ExtensionsPage} />`} />
          <${Route} path="extensions/:tab" element=${html`<${ExtensionsPage} />`} />
          <${Route} path="logs" element=${html`<${LogsPage} />`} />
          <${Route} path="settings" element=${html`<${SettingsPage} />`} />
          <${Route} path="settings/:tab" element=${html`<${SettingsPage} />`} />
          <${Route} path="admin" element=${html`<${AdminPage} />`} />
          <${Route} path="admin/:tab" element=${html`<${AdminPage} />`} />
        <//>
        <${Route} path="*" element=${html`<${Navigate} to=${defaultRoute} replace />`} />
      <//>
    <//>
  `;
}
