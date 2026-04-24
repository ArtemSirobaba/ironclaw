import { React } from "../../../lib/html.js";

export function useChatEvents({ threadId, setMessages, setIsProcessing, setPendingGate, setSuggestions }) {
  const streamingIdRef = React.useRef(null);

  return React.useCallback(
    (event) => {
      const { type, data } = event;
      if (data.thread_id && data.thread_id !== threadId) return;

      if (type === "stream_chunk") {
        setMessages((prev) => upsertStreamingMessage(prev, data, streamingIdRef));
        setIsProcessing(true);
        return;
      }

      if (type === "response") {
        setMessages((prev) => finishStreamingMessage(prev, data, streamingIdRef));
        setIsProcessing(false);
        return;
      }

      if (type === "tool_started") {
        setMessages((prev) => [...prev, toolStartedMessage(data)]);
        setIsProcessing(true);
        return;
      }

      if (type === "tool_completed" || type === "tool_result") {
        setMessages((prev) => updateToolMessage(prev, data, type));
        return;
      }

      if (type === "gate_required" || type === "approval_needed") {
        setPendingGate(toPendingGate(type, data));
        setIsProcessing(false);
        return;
      }

      if (type === "gate_resolved") {
        setPendingGate(null);
        return;
      }

      if (type === "error") {
        setMessages((prev) => [...prev, errorMessage(data)]);
        setIsProcessing(false);
        return;
      }

      if (type === "image_generated") {
        setMessages((prev) => [...prev, generatedImageMessage(data)]);
        return;
      }

      if (type === "suggestions") {
        setSuggestions(data.suggestions || []);
        return;
      }

      if (type === "status" && ["Done", "Idle"].includes(data.content)) {
        setIsProcessing(false);
      }
    },
    [threadId, setMessages, setIsProcessing, setPendingGate, setSuggestions]
  );
}

function upsertStreamingMessage(messages, data, streamingIdRef) {
  if (streamingIdRef.current) {
    const index = messages.findIndex((message) => message.id === streamingIdRef.current);
    if (index >= 0) {
      const next = [...messages];
      next[index] = { ...next[index], content: next[index].content + data.content };
      return next;
    }
  }

  const id = `stream-${Date.now()}`;
  streamingIdRef.current = id;
  return [...messages, { id, role: "assistant", content: data.content, timestamp: new Date().toISOString(), isStreaming: true }];
}

function finishStreamingMessage(messages, data, streamingIdRef) {
  if (streamingIdRef.current) {
    const index = messages.findIndex((message) => message.id === streamingIdRef.current);
    if (index >= 0) {
      const next = [...messages];
      next[index] = { ...next[index], content: data.content, isStreaming: false };
      streamingIdRef.current = null;
      return next;
    }
  }

  return [...messages, { id: `resp-${Date.now()}`, role: "assistant", content: data.content, timestamp: new Date().toISOString(), isStreaming: false }];
}

function toolStartedMessage(data) {
  return {
    id: `tool-start-${data.call_id || Date.now()}`,
    role: "tool_activity",
    content: "",
    toolName: data.name,
    toolStatus: "running",
    toolDetail: data.detail,
    callId: data.call_id,
    timestamp: new Date().toISOString(),
  };
}

function updateToolMessage(messages, data, type) {
  const index = messages.findIndex((message) => message.role === "tool_activity" && message.callId === data.call_id);
  if (index < 0) return messages;

  const next = [...messages];
  next[index] =
    type === "tool_result"
      ? { ...next[index], toolResultPreview: data.preview }
      : {
          ...next[index],
          toolStatus: data.success ? "success" : "error",
          toolError: data.error,
          toolDurationMs: data.duration_ms,
          toolParameters: data.parameters,
        };
  return next;
}

function toPendingGate(type, data) {
  const gate = {
    requestId: data.request_id,
    toolName: data.tool_name,
    description: data.description,
    parameters: data.parameters,
    allowAlways: data.allow_always,
  };

  if (type === "gate_required") {
    return { ...gate, kind: "gate", gateName: data.gate_name, extensionName: data.extension_name };
  }
  return { ...gate, kind: "legacy", gateName: "approval" };
}

function errorMessage(data) {
  return { id: `err-${Date.now()}`, role: "error", content: data.message, timestamp: new Date().toISOString() };
}

function generatedImageMessage(data) {
  return {
    id: `img-${data.event_id}`,
    role: "image",
    content: "",
    generatedImages: [{ data_url: data.data_url, path: data.path }],
    timestamp: new Date().toISOString(),
  };
}
