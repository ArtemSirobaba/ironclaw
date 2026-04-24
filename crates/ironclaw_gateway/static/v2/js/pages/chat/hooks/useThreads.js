import { useQuery } from "@tanstack/react-query";
import { React } from "../../../lib/html.js";
import { fetchThreads, createThread } from "../../../lib/api.js";
import { queryClient } from "../../../lib/query-client.js";

export function useThreads() {
  const query = useQuery({
    queryKey: ["threads"],
    queryFn: fetchThreads,
    refetchInterval: 5000,
  });

  const [activeThreadId, setActiveThreadId] = React.useState(null);
  const [isCreating, setIsCreating] = React.useState(false);

  React.useEffect(() => {
    if (query.data?.active_thread && !activeThreadId) {
      setActiveThreadId(query.data.active_thread);
    }
  }, [query.data, activeThreadId]);

  const handleCreateThread = React.useCallback(async () => {
    setIsCreating(true);
    try {
      const data = await createThread();
      queryClient.invalidateQueries({ queryKey: ["threads"] });
      setActiveThreadId(data.thread_id);
      return data.thread_id;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    threads: query.data?.threads || [],
    assistantThread: query.data?.assistant_thread,
    activeThreadId,
    setActiveThreadId,
    isLoading: query.isLoading,
    isCreating,
    createThread: handleCreateThread,
  };
}
