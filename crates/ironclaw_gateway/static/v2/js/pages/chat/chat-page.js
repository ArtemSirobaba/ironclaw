import { useLocation, useNavigate, useOutletContext, useParams } from "react-router";
import { React, html } from "../../lib/html.js";
import { Chat } from "./chat.js";

export function ChatPage() {
  const { threadsState, gatewayStatus } = useOutletContext();
  const { threadId: urlThreadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const composerDraft = location.state?.composerDraft || "";

  React.useEffect(() => {
    if (urlThreadId && urlThreadId !== threadsState.activeThreadId) {
      threadsState.setActiveThreadId(urlThreadId);
    } else if (!urlThreadId) {
      threadsState.setActiveThreadId(null);
    }
  }, [urlThreadId]);

  const handleCreateThread = React.useCallback(async () => {
    const id = await threadsState.createThread();
    if (id) {
      navigate(`/chat/${id}`, { replace: true });
    }
    return id;
  }, [threadsState, navigate]);

  return html`
    <${Chat}
      threads=${threadsState.threads}
      activeThreadId=${threadsState.activeThreadId}
      onSelectThread=${threadsState.setActiveThreadId}
      onCreateThread=${handleCreateThread}
      isCreatingThread=${threadsState.isCreating}
      composerDraft=${composerDraft}
      composerResetKey=${location.key}
      gatewayStatus=${gatewayStatus}
    />
  `;
}
