import { useOutletContext } from "react-router";
import { html } from "../../lib/html.js";
import { Chat } from "./chat.js";

export function ChatPage() {
  const { threadsState } = useOutletContext();

  return html`
    <${Chat}
      threads=${threadsState.threads}
      activeThreadId=${threadsState.activeThreadId}
      onSelectThread=${threadsState.setActiveThreadId}
      onCreateThread=${threadsState.createThread}
      isCreatingThread=${threadsState.isCreating}
    />
  `;
}
