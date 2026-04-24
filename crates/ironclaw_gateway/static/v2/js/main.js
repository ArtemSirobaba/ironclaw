import { QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { App } from "./app/app.js";
import { html } from "./lib/html.js";
import { queryClient } from "./lib/query-client.js";

createRoot(document.getElementById("v2-root")).render(html`
  <${QueryClientProvider} client=${queryClient}>
    <${App} />
  <//>
`);
