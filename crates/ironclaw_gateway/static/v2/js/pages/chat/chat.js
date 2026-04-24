import { React, html } from "../../lib/html.js";
import { ApprovalCard } from "./components/approval-card.js";
import { ChatInput } from "./components/chat-input.js";
import { ConnectionStatus } from "./components/connection-status.js";
import { EmptyState } from "./components/empty-state.js";
import { MessageList } from "./components/message-list.js";
import { SuggestionChips } from "./components/suggestion-chips.js";
import { ThreadSidebar } from "./components/thread-sidebar.js";
import { TypingIndicator } from "./components/typing-indicator.js";
import { useChat } from "./hooks/useChat.js";

export function Chat({
  threads,
  activeThreadId,
  onSelectThread,
  onCreateThread,
  isCreatingThread,
  composerDraft = "",
  composerResetKey = "",
  gatewayStatus,
}) {
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

  const activeThread = React.useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) || null,
    [threads, activeThreadId]
  );
  const runtimeContext = React.useMemo(
    () => buildRuntimeContext({ gatewayStatus, activeThread }),
    [gatewayStatus, activeThread]
  );
  const hasMessages =
    messages.length > 0 || isProcessing || Boolean(pendingGate);
  const showLanding = !historyLoading && !hasMessages;

  const handleSend = React.useCallback(
    async (content, { images = [], attachments = [] } = {}) => {
      let targetThreadId = activeThreadId;
      if (!targetThreadId && onCreateThread) {
        targetThreadId = await onCreateThread();
      }
      if (!targetThreadId) return;
      send(content, { images, attachments, threadId: targetThreadId });
    },
    [activeThreadId, onCreateThread, send]
  );

  const handleSuggestion = React.useCallback(
    async (text) => {
      setSuggestions([]);
      await handleSend(text);
    },
    [handleSend, setSuggestions]
  );

  return html`
    <div className="flex h-full min-h-0 overflow-hidden">
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
        <div
          className="border-b border-white/10 bg-iron-950/76 px-3 py-2 md:hidden"
        >
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

        ${showLanding &&
        html`
          <${EmptyState}
            onSuggestion=${handleSuggestion}
            onSend=${handleSend}
            disabled=${isProcessing && !pendingGate}
            initialText=${composerDraft}
            resetKey=${composerResetKey}
            context=${runtimeContext}
          />
        `}
        ${!showLanding &&
        html`
          <${MessageList}
            messages=${messages}
            isLoading=${historyLoading}
            hasMore=${hasMore}
            onLoadMore=${loadMore}
          >
            ${isProcessing && !pendingGate && html`<${TypingIndicator} />`}
            ${pendingGate &&
            html`
              <${ApprovalCard}
                gate=${pendingGate}
                onApprove=${() =>
                  approve(pendingGate.requestId, "approve", pendingGate.kind)}
                onDeny=${() =>
                  approve(pendingGate.requestId, "deny", pendingGate.kind)}
                onAlways=${() =>
                  approve(pendingGate.requestId, "always", pendingGate.kind)}
              />
            `}
          <//>

          <${SuggestionChips}
            suggestions=${suggestions}
            onSelect=${handleSuggestion}
          />

          <${ChatInput}
            onSend=${handleSend}
            disabled=${isProcessing && !pendingGate}
            initialText=${composerDraft}
            resetKey=${composerResetKey}
            context=${runtimeContext}
          />
        `}
      </div>
    </div>
  `;
}

function buildRuntimeContext({ gatewayStatus, activeThread }) {
  const turnCount = activeThread?.turn_count || 0;
  const connections = gatewayStatus?.total_connections;
  const engineLabel =
    gatewayStatus?.engine_v2_enabled === false ? "Engine v1" : "Engine v2";

  return {
    mode: "Auto-review",
    runtime: "Work locally",
    workspace: "ironclaw",
    model: gatewayStatus?.llm_model,
    backend: gatewayStatus?.llm_backend,
    threadLabel: activeThread?.title || "New thread",
    turnCountLabel: `${turnCount} ${turnCount === 1 ? "turn" : "turns"}`,
    engineLabel,
    connectionLabel:
      typeof connections === "number"
        ? `${connections} live ${
            connections === 1 ? "connection" : "connections"
          }`
        : null,
  };
}
