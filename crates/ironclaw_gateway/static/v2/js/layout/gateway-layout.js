import { Link, NavLink, Outlet } from "react-router";
import { html } from "../lib/html.js";
import { routeSections } from "../app/routes.js";
import { useGatewayStatus } from "../hooks/useGatewayStatus.js";
import { useThreads } from "../pages/chat/hooks/useThreads.js";
import { Button } from "../design-system/button.js";
import { StatusPill } from "../design-system/primitives.js";
import { Icon } from "../design-system/icons.js";

function RouteGlyph({ label }) {
  return html`
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.035] font-mono text-[10px] text-iron-300 transition group-hover:border-signal/35 group-hover:text-signal">
      ${label.slice(0, 2).toUpperCase()}
    </span>
  `;
}

function NavigationSection({ section }) {
  return html`
    <div className="space-y-1">
      <div className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-iron-700">
        ${section.label}
      </div>
      ${section.routes.map((route) => html`
        <${NavLink}
          key=${route.id}
          to=${route.path}
          className=${({ isActive }) =>
            [
              "group flex items-center gap-3 rounded-md px-2 py-2 text-sm transition",
              isActive ? "v2-nav-active text-white" : "text-iron-300 hover:bg-white/[0.045] hover:text-white",
            ].join(" ")}
        >
          <${RouteGlyph} label=${route.label} />
          <span className="min-w-0 truncate">${route.label}</span>
        <//>
      `)}
    </div>
  `;
}

export function GatewayLayout({ token, onSignOut }) {
  const statusQuery = useGatewayStatus(token);
  const threadsState = useThreads();
  const status = statusQuery.data;
  const statusTone = statusQuery.error ? "danger" : statusQuery.isLoading ? "muted" : "success";
  const statusLabel = statusQuery.error ? "offline" : statusQuery.isLoading ? "checking" : status?.status || "online";

  return html`
    <div className="v2-app-bg min-h-[100dvh] overflow-hidden">
      <header className="v2-topbar sticky top-0 z-30 h-[76px] border-b border-white/10 bg-iron-950/88 backdrop-blur-xl">
        <div className="mx-auto flex h-full w-full max-w-[1500px] items-center gap-4 px-4 sm:px-6">
          <${Link} to="/chat" className="flex shrink-0 items-center gap-3 text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-signal/25 bg-signal/10 text-signal shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
              <${Icon} name="bolt" className="h-5 w-5" />
            </span>
            <span className="text-base font-semibold tracking-tight">IronClaw</span>
            <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[11px] uppercase text-iron-300">
              v2
            </span>
          <//>
          <div className="hidden min-w-0 flex-1 items-center gap-3 md:flex">
            <span className="h-px flex-1 bg-white/10" />
            <${StatusPill} tone=${statusTone} label=${statusLabel} />
          </div>
          <${Button} variant="ghost" onClick=${onSignOut} className="ml-auto">Sign out<//>
        </div>
      </header>

      <div className="mx-auto grid h-[calc(100dvh-76px)] w-screen max-w-[1500px] grid-cols-1 overflow-hidden md:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[316px_minmax(0,1fr)]">
        <aside className="v2-nav-rail hidden border-r border-white/10 px-4 py-5 md:block">
          <div className="mb-7 border-b border-white/10 pb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-iron-300">Operator surface</p>
            <p className="mt-2 max-w-[22ch] text-sm leading-6 text-iron-200">Threads, runtime checks, and extension state in one working console.</p>
          </div>
          <nav className="space-y-6">
            ${routeSections.map((section) => html`<${NavigationSection} key=${section.label} section=${section} />`)}
          </nav>
        </aside>

        <div className="border-b border-white/10 bg-iron-950/72 px-3 py-2 md:hidden">
          <nav className="flex gap-2 overflow-x-auto">
            ${routeSections.flatMap((section) => section.routes).map((route) => html`
              <${NavLink}
                key=${route.id}
                to=${route.path}
                className=${({ isActive }) =>
                  [
                    "rounded-md px-3 py-2 text-sm whitespace-nowrap transition",
                    isActive ? "border border-signal/35 bg-signal/10 text-white" : "border border-white/0 text-iron-300",
                  ].join(" ")}
              >
                ${route.label}
              <//>
            `)}
          </nav>
        </div>

        <main className="min-h-0 min-w-0 overflow-hidden">
          ${statusQuery.error
            ? html`<div className="mx-4 mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                ${statusQuery.error.message || "Unable to connect to the gateway"}
              </div>`
            : null}
          <${Outlet}
            context=${{
              gatewayStatus: status,
              gatewayStatusQuery: statusQuery,
              threadsState,
            }}
          />
        </main>
      </div>
    </div>
  `;
}
