import { html } from "../lib/html.js";

const paths = {
  attach: html`<path d="M17.5 7.5 8.7 16.3a4 4 0 0 1-5.7-5.7l9.1-9.1a2.7 2.7 0 0 1 3.8 3.8l-8.7 8.7a1.3 1.3 0 0 1-1.9-1.9l7.7-7.7" />`,
  bolt: html`<path d="m12.5 2-7 10.4h5L9.5 22l7-11h-5l1-9Z" />`,
  check: html`<path d="m5 12.5 4.2 4.2L19 6.8" />`,
  chat: html`<path d="M5 5.8h14v9.8H9.2L5 19.2V5.8Z" /><path d="M8.5 9.2h7M8.5 12.2h4.5" />`,
  close: html`<path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />`,
  file: html`<path d="M6.5 3.5h7L18 8v12.5H6.5v-17Z" /><path d="M13.5 3.5V8H18" />`,
  flag: html`<path d="M6.5 21V4.5" /><path d="M6.5 5h10.8l-1.5 4 1.5 4H6.5" />`,
  folder: html`<path d="M3.5 6.5h6l2 2h9v9.8a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2V6.5Z" />`,
  layers: html`<path d="m12 3.5 8.5 4.4L12 12.3 3.5 7.9 12 3.5Z" /><path d="m5.2 11 6.8 3.5 6.8-3.5" /><path d="m5.2 14.7 6.8 3.5 6.8-3.5" />`,
  list: html`<path d="M8.5 6.5h11M8.5 12h11M8.5 17.5h11" /><path d="M4.5 6.5h.1M4.5 12h.1M4.5 17.5h.1" />`,
  lock: html`<path d="M7 10V7a5 5 0 0 1 10 0v3" /><path d="M5.5 10h13v10.5h-13V10Z" /><path d="M12 14.4v2.2" />`,
  moon: html`<path d="M20 14.6A7.6 7.6 0 0 1 9.4 4a8.2 8.2 0 1 0 10.6 10.6Z" />`,
  plug: html`<path d="M9 3.5v5M15 3.5v5" /><path d="M7.5 8.5h9v3a4.5 4.5 0 0 1-9 0v-3Z" /><path d="M12 16v4.5" />`,
  plus: html`<path d="M12 5.5v13M5.5 12h13" />`,
  pulse: html`<path d="M3.5 12h4l2-5.5 4.3 11 2.1-5.5h4.6" />`,
  send: html`<path d="M4 11.7 20 4l-4.9 16-3.1-6.9L4 11.7Z" /><path d="m12 13.1 4.4-4.5" />`,
  settings: html`<path d="M12 8.2a3.8 3.8 0 1 1 0 7.6 3.8 3.8 0 0 1 0-7.6Z" /><path d="M18.7 13.6a7.7 7.7 0 0 0 .1-1.6l2-1.5-2-3.4-2.4 1a7.6 7.6 0 0 0-1.4-.8L14.7 4h-4l-.4 3.3c-.5.2-1 .5-1.4.8l-2.4-1-2 3.4 2 1.5a7.7 7.7 0 0 0 0 1.7l-2 1.5 2 3.4 2.4-1c.4.3.9.6 1.4.8l.4 3.2h4l.4-3.2c.5-.2 1-.5 1.4-.8l2.4 1 2-3.4-2.2-1.6Z" />`,
  spark: html`<path d="M12 3.5 14 10l6.5 2-6.5 2-2 6.5-2-6.5-6.5-2 6.5-2 2-6.5Z" />`,
  sun: html`<path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" /><path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />`,
  shield: html`<path d="M12 3 4 7v4.5c0 4.7 3.4 9.1 8 10.5 4.6-1.4 8-5.8 8-10.5V7l-8-4Z" /><path d="m9.5 12 2 2 3.5-3.5" />`,
  tool: html`<path d="M15 4.5a4.5 4.5 0 0 0-5.5 5.7L4.7 15a2.7 2.7 0 1 0 3.8 3.8l4.8-4.8A4.5 4.5 0 0 0 19 8.5l-3.2 3.2-3.5-3.5L15 4.5Z" />`,
};

export function Icon({ name, className = "" }) {
  return html`
    <svg
      aria-hidden="true"
      className=${className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      ${paths[name] || paths.spark}
    </svg>
  `;
}
