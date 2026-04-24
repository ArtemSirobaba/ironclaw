import { React, html } from "../../lib/html.js";
import { useChat } from "./hooks/useChat.js";
import { ThreadSidebar } from "./components/thread-sidebar.js";
import { MessageList } from "./components/message-list.js";
import { TypingIndicator } from "./components/typing-indicator.js";
import { ApprovalCard } from "./components/approval-card.js";
import { SuggestionChips } from "./components/suggestion-chips.js";
import { ChatInput } from "./components/chat-input.js";
import { ConnectionStatus } from "./components/connection-status.js";
import { EmptyState } from "./components/empty-state.js";

export function Chat({ threads, activeThreadId, onSelectThread, onCreateThread, isCreatingThread }) {
  const {
    messages,
    isProcessing,
    pendingGate,
    suggestions,
    sseStatus,
    historyLoading,
    hasMore,
    send,
    approve,
    loadMore,
    setSuggestions,
  } = useChat(activeThreadId);

  const handleSend = React.useCallback(
    (content, { images, attachments }) => {
      send(content, { images, attachments });
    },
    [send]
  );

  const handleSuggestion = React.useCallback(
    (text) => {
      setSuggestions([]);
      send(text);
    },
    [send, setSuggestions]
  );

  return html`
    <div className="v2-workspace-surface flex h-full min-h-0 overflow-hidden">
      <div className="hidden w-[336px] shrink-0 md:block">
        <${ThreadSidebar}
          threads=${threads}
          activeThreadId=${activeThreadId}
          onSelect=${onSelectThread}
          onCreate=${onCreateThread}
          isCreating=${isCreatingThread}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-white/10 bg-iron-950/76 px-3 py-2 md:hidden">
          <${ThreadSidebar}
            threads=${threads}
            activeThreadId=${activeThreadId}
            onSelect=${onSelectThread}
            onCreate=${onCreateThread}
            isCreating=${isCreatingThread}
            compact=${true}
          />
        </div>
        <${ConnectionStatus} status=${sseStatus} />

        ${!activeThreadId && html`<${EmptyState} onSuggestion=${handleSuggestion} />`}

        ${activeThreadId && html`
          <${MessageList}
            messages=${messages}
            isLoading=${historyLoading}
            hasMore=${hasMore}
            onLoadMore=${loadMore}
          >
            ${isProcessing && !pendingGate && html`<${TypingIndicator} />`}

            ${pendingGate && html`
              <${ApprovalCard}
                gate=${pendingGate}
                onApprove=${() => approve(pendingGate.requestId, "approve", pendingGate.kind)}
                onDeny=${() => approve(pendingGate.requestId, "deny", pendingGate.kind)}
                onAlways=${() => approve(pendingGate.requestId, "always", pendingGate.kind)}
              />
            `}
          <//>

          <${SuggestionChips} suggestions=${suggestions} onSelect=${handleSuggestion} />

          <${ChatInput} onSend=${handleSend} disabled=${isProcessing && !pendingGate} />
        `}
      </div>
    </div>
  `;
}
