import { React } from "../../../lib/html.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSettingsExport, updateSetting } from "../lib/settings-api.js";
import { RESTART_REQUIRED_KEYS } from "../lib/settings-schema.js";

export function useSettings() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["settings-export"],
    queryFn: fetchSettingsExport,
    staleTime: 30_000,
  });

  const settings = query.data?.settings || {};

  const [savedKeys, setSavedKeys] = React.useState({});
  const [needsRestart, setNeedsRestart] = React.useState(false);

  const mutation = useMutation({
    mutationFn: ({ key, value }) => updateSetting(key, value),
    onSuccess: (_data, { key, value }) => {
      queryClient.setQueryData(["settings-export"], (old) => {
        if (!old) return old;
        const next = { ...old, settings: { ...old.settings } };
        if (value === null || value === undefined) {
          delete next.settings[key];
        } else {
          next.settings[key] = value;
        }
        return next;
      });

      setSavedKeys((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedKeys((prev) => ({ ...prev, [key]: false })), 2000);

      if (RESTART_REQUIRED_KEYS.has(key)) {
        setNeedsRestart(true);
      }
    },
  });

  const save = React.useCallback(
    (key, value) => mutation.mutate({ key, value }),
    [mutation]
  );

  return { settings, query, save, savedKeys, needsRestart, saveError: mutation.error };
}
