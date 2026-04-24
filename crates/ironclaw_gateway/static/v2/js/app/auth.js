import { React } from "../lib/html.js";
import { queryClient } from "../lib/query-client.js";
import { readStoredToken, storeToken } from "../lib/api.js";

export function useAuthSession() {
  const [token, setToken] = React.useState(readStoredToken);
  const [error, setError] = React.useState("");

  const signIn = React.useCallback((nextToken) => {
    storeToken(nextToken);
    setToken(nextToken);
    setError("");
  }, []);

  const signOut = React.useCallback(() => {
    storeToken("");
    setToken("");
    setError("");
    queryClient.clear();
  }, []);

  return {
    token,
    error,
    setError,
    isAuthenticated: Boolean(token),
    signIn,
    signOut,
  };
}
