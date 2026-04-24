import { html } from "../../../lib/html.js";

const STYLES = {
  connected: "bg-mint/20 text-mint border-mint/30",
  reconnecting: "bg-copper/20 text-copper border-copper/30",
  disconnected: "bg-red-500/20 text-red-200 border-red-400/30",
  connecting: "bg-iron-700/50 text-iron-200 border-iron-700/50",
  idle: "hidden",
};

const LABELS = {
  connected: "Connected",
  reconnecting: "Reconnecting...",
  disconnected: "Disconnected",
  connecting: "Connecting...",
};

export function ConnectionStatus({ status }) {
  if (status === "idle" || status === "connected" || !status) return null;
  return html`
    <div
      className=${[
        "sticky top-0 z-20 mx-auto mb-2 max-w-md rounded-full border px-4 py-1.5 text-center text-xs font-medium backdrop-blur-xl",
        STYLES[status] || STYLES.connecting,
      ].join(" ")}
    >
      ${LABELS[status] || status}
    </div>
  `;
}
