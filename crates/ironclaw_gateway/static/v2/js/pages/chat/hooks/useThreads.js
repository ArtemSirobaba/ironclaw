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
  const createInFlightRef = React.useRef(null);

  const handleCreateThread = React.useCallback(async () => {
    const activeFromServer = query.data?.active_thread || null;
    const candidateId = activeThreadId || activeFromServer;
    const candidate =
      candidateId && query.data?.threads ? query.data.threads.find((thread) => thread.id === candidateId) : null;

    if (candidateId && candidate && (candidate.turn_count || 0) === 0) {
      setActiveThreadId(candidateId);
      return candidateId;
    }

    if (createInFlightRef.current) {
      return createInFlightRef.current;
    }
    setIsCreating(true);
    const createPromise = (async () => {
      try {
        const data = await createThread();
        queryClient.invalidateQueries({ queryKey: ["threads"] });
        setActiveThreadId(data.thread_id);
        return data.thread_id;
      } finally {
        setIsCreating(false);
        createInFlightRef.current = null;
      }
    })();

    createInFlightRef.current = createPromise;
    return createPromise;
  }, [activeThreadId, query.data]);

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
