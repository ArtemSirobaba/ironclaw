import { React } from "../lib/html.js";
import { useNavigate } from "react-router";

export function useSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const close = React.useCallback(() => setOpen(false), []);
  const toggle = React.useCallback(() => setOpen((v) => !v), []);

  const newChat = React.useCallback(() => {
    navigate("/chat");
    close();
  }, [navigate, close]);

  const selectThread = React.useCallback(
    (id) => {
      navigate(`/chat/${id}`);
      close();
    },
    [navigate, close]
  );

  return { open, close, toggle, newChat, selectThread };
}
