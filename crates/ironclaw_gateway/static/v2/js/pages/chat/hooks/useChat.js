import { resolveGate, sendApproval, sendMessage } from "../../../lib/api.js";
import { React } from "../../../lib/html.js";
import { normalizeHistoryGate } from "../lib/gates.js";
import { useChatEvents } from "../lib/useChatEvents.js";
import { useHistory } from "./useHistory.js";
import { useSSE } from "./useSSE.js";

export function useChat(threadId) {
  const {
    messages,
    hasMore,
    oldestTimestamp,
    isLoading: historyLoading,
    inProgress,
    pendingGate: historyPendingGate,
    loadHistory,
    setMessages,
  } = useHistory(threadId);

  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pendingGate, setPendingGate] = React.useState(null);
  const [suggestions, setSuggestions] = React.useState([]);

  React.useEffect(() => {
    setIsProcessing(Boolean(inProgress));
  }, [inProgress]);

  React.useEffect(() => {
    if (historyPendingGate) {
      setPendingGate(normalizeHistoryGate(historyPendingGate));
    }
  }, [historyPendingGate]);

  const handleEvent = useChatEvents({
    threadId,
    setMessages,
    setIsProcessing,
    setPendingGate,
    setSuggestions,
  });

  const { status: sseStatus } = useSSE({
    onEvent: handleEvent,
    enabled: true,
  });

  const send = React.useCallback(
    async (
      content,
      { images = [], attachments = [], threadId: targetThreadId } = {}
    ) => {
      const sendThreadId = targetThreadId || threadId;

      const optimisticId = `pending-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: optimisticId,
          role: "user",
          content: content || "(attachment)",
          timestamp: new Date().toISOString(),
          images: images.map((img) => img.dataUrl),
          attachments: attachments.map((att) => ({
            filename: att.filename,
            mime_type: att.mime_type,
            size_label: att.size_label,
          })),
          isOptimistic: true,
        },
      ]);

      setIsProcessing(true);
      setSuggestions([]);
      setPendingGate(null);

      try {
        const response = await sendMessage({
          content,
          threadId: sendThreadId,
          images: images.map((img) => ({
            media_type: img.media_type || img.mime_type,
            data: img.data || img.base64,
          })),
          attachments: attachments.map((att) => ({
            mime_type: att.mime_type,
            filename: att.filename,
            data_base64: att.data_base64 || att.base64,
          })),
        });
        return response;
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === optimisticId
              ? {
                  ...m,
                  isOptimistic: false,
                  status: "error",
                  error: err.message,
                }
              : m
          )
        );
        setIsProcessing(false);
        throw err;
      }
    },
    [threadId, setMessages]
  );

  const approve = React.useCallback(
    async (requestId, action, kind = "legacy") => {
      if (kind === "gate") {
        await resolveGate({ requestId, resolution: action, threadId });
      } else {
        await sendApproval({ requestId, action, threadId });
      }
      setPendingGate(null);
      setIsProcessing(true);
    },
    [threadId]
  );

  const resolveGateAction = React.useCallback(
    async (requestId, resolution) => {
      await resolveGate({ requestId, resolution, threadId });
      setPendingGate(null);
      setIsProcessing(true);
    },
    [threadId]
  );

  const loadMore = React.useCallback(() => {
    if (hasMore && oldestTimestamp) {
      loadHistory(oldestTimestamp);
    }
  }, [hasMore, oldestTimestamp, loadHistory]);

  return {
    messages,
    isProcessing,
    pendingGate,
    suggestions,
    sseStatus,
    historyLoading,
    hasMore,
    send,
    approve,
    resolveGate: resolveGateAction,
    loadMore,
    setSuggestions,
  };
}
