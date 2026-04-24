import { useLocation, useOutletContext } from "react-router";
import { React, html } from "../../lib/html.js";
import { Chat } from "./chat.js";

export function ChatPage() {
  const { threadsState, gatewayStatus } = useOutletContext();
  const location = useLocation();
  const composerDraft = location.state?.composerDraft || "";
  const requestedThreadId = location.state?.threadId || null;

  React.useEffect(() => {
    if (requestedThreadId) {
      threadsState.setActiveThreadId(requestedThreadId);
    }
  }, [requestedThreadId, threadsState]);

  return html`
    <${Chat}
      threads=${threadsState.threads}
      activeThreadId=${threadsState.activeThreadId}
      onSelectThread=${threadsState.setActiveThreadId}
      onCreateThread=${threadsState.createThread}
      isCreatingThread=${threadsState.isCreating}
      composerDraft=${composerDraft}
      composerResetKey=${location.key}
      gatewayStatus=${gatewayStatus}
    />
  `;
}
