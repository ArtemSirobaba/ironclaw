import { React } from "../../../lib/html.js";
import { fetchHistory } from "../../../lib/api.js";

function turnsToMessages(turns) {
  const messages = [];
  for (const turn of turns) {
    if (turn.user_input) {
      messages.push({
        id: `turn-${turn.turn_number}-user`,
        role: "user",
        content: turn.user_input,
        timestamp: turn.started_at,
        turnNumber: turn.turn_number,
      });
    }
    if (turn.tool_calls && turn.tool_calls.length > 0) {
      messages.push({
        id: `turn-${turn.turn_number}-tools`,
        role: "tool_activity",
        content: "",
        timestamp: turn.started_at,
        turnNumber: turn.turn_number,
        toolCalls: turn.tool_calls,
      });
    }
    if (turn.generated_images && turn.generated_images.length > 0) {
      for (const img of turn.generated_images) {
        messages.push({
          id: `turn-${turn.turn_number}-img-${img.event_id || Math.random().toString(36).slice(2)}`,
          role: "image",
          content: "",
          timestamp: turn.started_at,
          generatedImages: [{ data_url: img.data_url || img.url, path: img.path }],
        });
      }
    }
    if (turn.response) {
      messages.push({
        id: `turn-${turn.turn_number}-assistant`,
        role: "assistant",
        content: turn.response,
        timestamp: turn.completed_at || turn.started_at,
        turnNumber: turn.turn_number,
      });
    }
  }
  return messages;
}

export function useHistory(threadId) {
  const [state, setState] = React.useState({
    messages: [],
    hasMore: false,
    oldestTimestamp: null,
    isLoading: false,
    inProgress: null,
    pendingGate: null,
  });

  const loadHistory = React.useCallback(
    async (before) => {
      if (!threadId) {
        setState({
          messages: [],
          hasMore: false,
          oldestTimestamp: null,
          isLoading: false,
          inProgress: null,
          pendingGate: null,
        });
        return;
      }
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const data = await fetchHistory({ threadId, limit: 50, before });
        const newMessages = turnsToMessages(data.turns || []);

        setState((prev) => {
          const existingIds = new Set(prev.messages.map((m) => m.id));
          const deduped = before
            ? newMessages.filter((m) => !existingIds.has(m.id))
            : newMessages.filter((m) => !existingIds.has(m.id));
          return {
            messages: before ? [...deduped, ...prev.messages] : deduped,
            hasMore: data.has_more,
            oldestTimestamp: data.oldest_timestamp,
            isLoading: false,
            inProgress: data.in_progress || null,
            pendingGate: data.pending_gate || null,
          };
        });
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }));
        console.error("Failed to load history:", err);
      }
    },
    [threadId]
  );

  React.useEffect(() => {
    setState({
      messages: [],
      hasMore: false,
      oldestTimestamp: null,
      isLoading: false,
      inProgress: null,
      pendingGate: null,
    });
    if (threadId) {
      loadHistory();
    }
  }, [threadId, loadHistory]);

  return {
    messages: state.messages,
    hasMore: state.hasMore,
    oldestTimestamp: state.oldestTimestamp,
    isLoading: state.isLoading,
    inProgress: state.inProgress,
    pendingGate: state.pendingGate,
    loadHistory,
    setMessages: (updater) =>
      setState((s) => ({
        ...s,
        messages: typeof updater === "function" ? updater(s.messages) : updater,
      })),
  };
}
