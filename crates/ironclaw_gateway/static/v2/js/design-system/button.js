import { html } from "../lib/html.js";

const variants = {
  primary: "v2-button-primary",
  secondary: "v2-button-secondary",
  ghost: "v2-button-ghost",
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
