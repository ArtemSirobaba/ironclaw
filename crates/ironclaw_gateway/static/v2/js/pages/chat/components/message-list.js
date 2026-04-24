import { React, html } from "../../../lib/html.js";
import { MessageBubble } from "./message-bubble.js";

export function MessageList({ messages, isLoading, hasMore, onLoadMore, children }) {
  const containerRef = React.useRef(null);
  const shouldScrollRef = React.useRef(true);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !shouldScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onScroll = React.useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100;
    shouldScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;

    if (hasMore && el.scrollTop < threshold && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore, isLoading]);

  return html`
    <div
      ref=${containerRef}
      onScroll=${onScroll}
      className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-6 sm:px-5 lg:px-8"
    >
      ${hasMore && html`
        <div className="text-center">
          <button
            onClick=${onLoadMore}
            disabled=${isLoading}
            className="v2-button rounded-md border border-white/10 px-3 py-1.5 text-xs text-iron-300 hover:border-signal/35 hover:text-white disabled:opacity-50"
          >
            ${isLoading ? "Loading..." : "Load older messages"}
          </button>
        </div>
      `}

      ${messages.map((msg) => html`<${MessageBubble} key=${msg.id} message=${msg} />`)}

      ${children}
    </div>
  `;
}
