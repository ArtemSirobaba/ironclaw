import { html } from "../lib/html.js";

const variants = {
  primary: "border border-signal/40 bg-signal text-iron-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] hover:bg-signal/90",
  secondary: "border border-white/12 bg-white/[0.04] text-iron-100 hover:border-signal/45 hover:bg-signal/10",
  ghost: "border border-transparent text-iron-200 hover:border-white/10 hover:bg-white/[0.045]",
};

export function Button({ children, className = "", variant = "primary", ...props }) {
  return html`
    <button
      className=${[
        "v2-button inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] || variants.primary,
        className,
      ].join(" ")}
      ...${props}
    >
      ${children}
    </button>
  `;
}
