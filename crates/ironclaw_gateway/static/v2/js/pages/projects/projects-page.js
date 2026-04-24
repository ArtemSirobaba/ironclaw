import { routeForId } from "../../app/routes.js";
import { html } from "../../lib/html.js";
import { PlaceholderPage } from "../shared/placeholder-page.js";

export function ProjectsPage() {
  return html`<${PlaceholderPage} route=${routeForId("projects")} />`;
}
