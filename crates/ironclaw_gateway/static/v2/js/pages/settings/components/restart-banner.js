import { html } from "../../../lib/html.js";
import { Icon } from "../../../design-system/icons.js";

export function RestartBanner({ visible }) {
  if (!visible) return null;

  return html`
    <div
      role="alert"
      className="flex items-center gap-3 rounded-xl border border-copper/30 bg-copper/10 px-4 py-3"
    >
      <${Icon} name="bolt" className="h-4 w-4 shrink-0 text-copper" />
      <span className="flex-1 text-sm text-copper">
        Some changes require a restart to take effect.
      </span>
    </div>
  `;
}
