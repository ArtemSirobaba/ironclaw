export const defaultRoute = "/chat";

export const primaryRoutes = [
  { id: "chat", path: "/chat", labelKey: "nav.chat" },
  { id: "workspace", path: "/workspace", labelKey: "nav.workspace" },
  { id: "projects", path: "/projects", labelKey: "nav.projects" },
  { id: "jobs", path: "/jobs", labelKey: "nav.jobs" },
  { id: "missions", path: "/missions", labelKey: "nav.missions" },
  { id: "extensions", path: "/extensions", labelKey: "nav.extensions" },
  { id: "settings", path: "/settings", labelKey: "nav.settings" },
  { id: "admin", path: "/admin", labelKey: "nav.admin" },
];

export const routeSectionDefs = [
  {
    labelKey: "nav.sectionWork",
    ids: ["chat", "workspace", "projects", "jobs", "missions"],
  },
  {
    labelKey: "nav.sectionSystem",
    ids: ["extensions", "settings", "admin"],
  },
];

export function routeForId(id) {
  return primaryRoutes.find((route) => route.id === id) || primaryRoutes[0];
}
