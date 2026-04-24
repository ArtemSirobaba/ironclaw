import { routeForId } from "../../app/routes.js";
import { html } from "../../lib/html.js";
import { PlaceholderPage } from "../shared/placeholder-page.js";

export function SettingsPage() {
  return html`<${PlaceholderPage} route=${routeForId("settings")} />`;
}
