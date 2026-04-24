export const defaultRoute = "/chat";

export const primaryRoutes = [
  {
    id: "dashboard",
    path: "/dashboard",
    label: "Dashboard",
    description: "Gateway health, runtime load, and the current agent operating picture.",
  },
  {
    id: "chat",
    path: "/chat",
    label: "Chat",
    description: "Primary agent workspace with threads, approvals, tools, and attachments.",
  },
  {
    id: "projects",
    path: "/projects",
    label: "Projects",
    description: "Workspaces, missions, files, and durable agent context.",
  },
  {
    id: "jobs",
    path: "/jobs",
    label: "Jobs",
    description: "Sandbox runs, background tasks, artifacts, and event streams.",
  },
  {
    id: "extensions",
    path: "/extensions",
    label: "Extensions",
    description: "Channels, tools, setup status, readiness, and install state.",
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    description: "Runtime configuration, tool policy, secrets, and operator controls.",
  },
];

export const routeSections = [
  {
    label: "Work",
    routes: primaryRoutes.filter((route) => ["dashboard", "chat", "projects", "jobs"].includes(route.id)),
  },
  {
    label: "System",
    routes: primaryRoutes.filter((route) => ["extensions", "settings"].includes(route.id)),
  },
];

export function routeForId(id) {
  return primaryRoutes.find((route) => route.id === id) || primaryRoutes[0];
}
