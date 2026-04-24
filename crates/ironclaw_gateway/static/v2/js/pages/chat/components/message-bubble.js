import { html } from "../../../lib/html.js";
import { Avatar } from "./avatar.js";
import { MarkdownRenderer } from "./markdown-renderer.js";
import { ToolActivity } from "./tool-activity.js";
import { Icon } from "../../../design-system/icons.js";

const ROLE_STYLES = {
  user: "ml-auto bg-signal/10 text-iron-100 border-signal/25",
  assistant: "mr-auto bg-iron-800/58 text-iron-100 border-white/10",
  system: "mx-auto bg-copper/10 text-copper border-copper/20 text-center",
  error: "mx-auto bg-red-500/10 text-red-200 border-red-400/20 text-center",
};

export function MessageBubble({ message }) {
  const { role, content, images, attachments, generatedImages, isOptimistic, status, error, toolCalls } = message;
  const isUser = role === "user";

  if (role === "tool_activity" || (toolCalls && toolCalls.length > 0)) {
    const activity = (toolCalls && toolCalls.length > 0)
      ? {
          id: message.id,
          toolName: toolCalls[0]?.name || "tool",
          toolStatus: toolCalls[0]?.has_error ? "error" : toolCalls[0]?.has_result ? "success" : "running",
          toolError: toolCalls[0]?.error,
          toolResultPreview: toolCalls[0]?.result_preview,
          toolParameters: toolCalls[0]?.parameters,
        }
      : message;
    return html`<${ToolActivity} activity=${activity} />`;
  }

  if (role === "image") {
    const imgs = generatedImages || [];
    return html`
      <div className="flex gap-3">
        <${Avatar} role="assistant" />
        <div className="flex flex-wrap gap-2">
          ${imgs.map((img, i) => html`<img key=${i} src=${img.data_url} className="max-h-64 rounded-lg border border-iron-700 object-cover" alt="Generated result" />`)}
        </div>
      </div>
    `;
  }

  return html`
    <div className=${["flex gap-3", isUser ? "flex-row-reverse" : "flex-row"].join(" ")}>
      <${Avatar} role=${role} />
      <div className="flex min-w-0 max-w-[85%] flex-col gap-1">
        <div
          className=${[
            "rounded-[18px] border px-4 py-3 text-sm leading-6",
            ROLE_STYLES[role] || ROLE_STYLES.assistant,
            isOptimistic ? "opacity-70" : "",
          ].join(" ")}
        >
          ${role === "assistant" || role === "system" || role === "error"
            ? html`<${MarkdownRenderer} content=${content} />`
            : html`<div className="whitespace-pre-wrap">${content}</div>`}

          ${status === "error" && html`<div className="mt-2 text-xs text-red-300">${error}</div>`}

          ${images && images.length > 0 && html`
            <div className="mt-2 flex flex-wrap gap-2">
              ${images.map((src, i) => html`<img key=${i} src=${src} className="max-h-48 rounded-lg border border-iron-700 object-cover" alt="Message attachment" />`)}
            </div>
          `}

          ${attachments && attachments.length > 0 && html`
            <div className="mt-2 flex flex-col gap-1.5">
              ${attachments.map((att, i) => html`
                <div key=${i} className="flex items-center gap-2 rounded-md border border-iron-700 bg-iron-900/50 px-3 py-2 text-xs">
                  <${Icon} name="file" className="h-3.5 w-3.5 text-signal" />
                  <span className="truncate">${att.filename || "attachment"}</span>
                  <span className="ml-auto shrink-0 text-iron-200">${att.mime_type} ${att.size_label ? " / " + att.size_label : ""}</span>
                </div>
              `)}
            </div>
          `}
        </div>
      </div>
    </div>
  `;
}
