import { useOutletContext } from "react-router";
import { html } from "../../lib/html.js";
import { PageHeader, Panel, StatCard, FlowList } from "../../design-system/primitives.js";

const operatingFlow = [
  {
    title: "Intake",
    description: "Threads, attachments, and approvals enter through the chat workspace with a single active context.",
  },
  {
    title: "Plan",
    description: "The agent turns user intent into tool calls, workspace changes, routines, and follow-up actions.",
  },
  {
    title: "Execute",
    description: "Jobs, extensions, and gateway events show the work as it moves through the runtime.",
  },
  {
    title: "Review",
    description: "Results, artifacts, and approvals stay visible so operators can continue or intervene quickly.",
  },
];

export function DashboardPage() {
  const { gatewayStatus, gatewayStatusQuery, threadsState } = useOutletContext();
  const threadCount = Array.isArray(threadsState.threads) ? threadsState.threads.length : 0;
  const status = gatewayStatusQuery.isLoading ? "checking" : gatewayStatus?.status || "online";

  return html`
    <div className="flex h-full flex-col overflow-y-auto">
      <${PageHeader}
        eyebrow="Gateway v2"
        title="Operator console"
        description="A working view for gateway health, active conversations, and the runtime surfaces that carry agent work from intake to review."
      />

      <div className="v2-page-entrance grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.55fr)]">
        <div className="space-y-5">
          <section className="v2-panel rounded-[18px] p-5 sm:p-6">
            <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2 xl:grid-cols-4">
              <${StatCard} label="Gateway" value=${status} tone=${gatewayStatusQuery.error ? "danger" : "success"} detail="Health probe" />
              <${StatCard} label="Channel" value=${gatewayStatus?.channel || "web"} tone="signal" detail="Browser gateway" />
              <${StatCard} label="Threads" value=${threadCount} tone="muted" detail="Local session store" />
              <${StatCard} label="Mode" value="operator" tone="warning" detail="Manual approval path" />
            </div>
          </section>

          <${Panel} className="p-5 sm:p-6">
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight text-white">Operating flow</h2>
              <p className="mt-2 max-w-[62ch] text-sm leading-6 text-iron-300">
                User intent, runtime work, and operator control remain visible as one continuous path.
              </p>
            </div>
            <div className="v2-stagger">
              <${FlowList} items=${operatingFlow} />
            </div>
          <//>
        </div>

        <${Panel} className="p-5 sm:p-6 xl:mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-white">Runtime areas</h2>
          <dl className="mt-5 divide-y divide-white/10 text-sm">
            <div className="py-4 first:pt-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Chat</dt>
              <dd className="mt-2 leading-6 text-iron-300">Live turns, streaming responses, approvals, and attachments.</dd>
            </div>
            <div className="py-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Projects</dt>
              <dd className="mt-2 leading-6 text-iron-300">Workspace memory, missions, and files used across turns.</dd>
            </div>
            <div className="py-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Jobs</dt>
              <dd className="mt-2 leading-6 text-iron-300">Sandbox runs, background execution, and emitted artifacts.</dd>
            </div>
            <div className="py-4">
              <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Extensions</dt>
              <dd className="mt-2 leading-6 text-iron-300">Tools, channels, credentials, and setup readiness.</dd>
            </div>
          </dl>
        <//>
      </div>
    </div>
  `;
}
