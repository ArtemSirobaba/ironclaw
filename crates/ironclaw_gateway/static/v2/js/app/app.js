import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router";
import { React, html } from "../lib/html.js";
import { useAuthSession } from "./auth.js";
import { defaultRoute } from "./routes.js";
import { GatewayLayout } from "../layout/gateway-layout.js";
import { LoginPage as LoginView } from "../pages/login/login-page.js";
import { ChatPage } from "../pages/chat/chat-page.js";
import { DashboardPage } from "../pages/dashboard/dashboard-page.js";
import { ProjectsPage } from "../pages/projects/projects-page.js";
import { JobsPage } from "../pages/jobs/jobs-page.js";
import { ExtensionsPage } from "../pages/extensions/extensions-page.js";
import { SettingsPage } from "../pages/settings/settings-page.js";

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
          <${Route} path="overview" element=${html`<${Navigate} to="/dashboard" replace />`} />
          <${Route} path="dashboard" element=${html`<${DashboardPage} />`} />
          <${Route} path="chat" element=${html`<${ChatPage} />`} />
          <${Route} path="projects" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId/missions/:missionId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="projects/:projectId/threads/:threadId" element=${html`<${ProjectsPage} />`} />
          <${Route} path="jobs" element=${html`<${JobsPage} />`} />
          <${Route} path="jobs/:jobId" element=${html`<${JobsPage} />`} />
          <${Route} path="extensions" element=${html`<${ExtensionsPage} />`} />
          <${Route} path="settings" element=${html`<${SettingsPage} />`} />
        <//>
        <${Route} path="*" element=${html`<${Navigate} to=${defaultRoute} replace />`} />
      <//>
    <//>
  `;
}
