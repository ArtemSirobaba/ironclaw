export const defaultRoute = "/chat";

export const primaryRoutes = [
  {
    id: "chat",
    path: "/chat",
    label: "Chat",
  },
  {
    id: "projects",
    path: "/projects",
    label: "Projects",
  },
  {
    id: "jobs",
    path: "/jobs",
    label: "Jobs",
  },
  {
    id: "extensions",
    path: "/extensions",
    label: "Extensions",
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
  },
];

export const routeSections = [
  {
    label: "Work",
    routes: primaryRoutes.filter((route) => ["chat", "projects", "jobs"].includes(route.id)),
  },
  {
    label: "System",
    routes: primaryRoutes.filter((route) => ["extensions", "settings"].includes(route.id)),
  },
];

export function routeForId(id) {
  return primaryRoutes.find((route) => route.id === id) || primaryRoutes[0];
}
