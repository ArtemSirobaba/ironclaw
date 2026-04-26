import { React } from "../lib/html.js";
import { useNavigate } from "react-router";

export function useSidebar(threadsState) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((v) => !v), []);

  const newChat = React.useCallback(() => {
    threadsState.setActiveThreadId(null);
    navigate("/chat");
    close();
  }, [threadsState, navigate, close]);

  const selectThread = React.useCallback(
    (id) => {
      threadsState.setActiveThreadId(id);
      navigate("/chat");
      close();
    },
    [threadsState, navigate, close]
  );

  return { open, close, toggle, newChat, selectThread };
}
