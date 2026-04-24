import { routeForId } from "../../app/routes.js";
import { html } from "../../lib/html.js";
import { PlaceholderPage } from "../shared/placeholder-page.js";

export function JobsPage() {
  return html`<${PlaceholderPage} route=${routeForId("jobs")} />`;
}
