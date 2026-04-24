import { useForm } from "react-hook-form";
import { Button } from "../../design-system/button.js";
import { html } from "../../lib/html.js";
import { Icon } from "../../design-system/icons.js";

export function LoginPage({ initialToken, error, onSubmit }) {
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: {
      token: initialToken || "",
    },
  });

  return html`
    <main className="v2-noise grid min-h-[100dvh] px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)] lg:items-center lg:gap-12 lg:px-12">
      <section className="hidden max-w-2xl self-center lg:block">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">Gateway v2</p>
        <h1 className="mt-4 font-serif text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-white">
          Local agent control without losing the operator trail.
        </h1>
        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-iron-300">
          Token access keeps the browser console tied to the same gateway runtime, approvals, tools, and thread state.
        </p>
        <div className="mt-10 grid max-w-xl grid-cols-[1fr_0.7fr] gap-3">
          <div className="v2-panel rounded-xl p-6">
            <div className="flex items-center gap-3 text-signal">
              <${Icon} name="lock" className="h-5 w-5" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">Bearer auth</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-iron-300">Paste the local gateway token to open the operator surface.</p>
          </div>
          <div className="v2-panel rounded-xl p-6">
            <div className="h-2 w-16 rounded bg-signal/60" />
            <div className="mt-4 space-y-2">
              <div className="v2-skeleton h-2 rounded" />
              <div className="v2-skeleton h-2 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </section>

      <section className="v2-panel v2-page-entrance w-full max-w-md self-center rounded-xl p-6 sm:ml-auto">
        <div className="mb-8">
          <p
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal"
          >
            Gateway v2
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-white">
            IronClaw console
          </h1>
          <p className="mt-4 text-sm leading-6 text-iron-300">
            Secure access to the local agent gateway.
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit=${handleSubmit(({ token }) => onSubmit(token))}
        >
          <label
            className="block text-sm font-medium text-iron-200"
            htmlFor="v2-token"
            >Gateway token</label
          >
          <div className="grid gap-2">
            <input
              id="v2-token"
              type="password"
              ...${register("token", {
                required: "Gateway token is required",
                setValueAs: (value) => value.trim(),
              })}
              className="h-11 w-full rounded-md border border-white/10 bg-iron-900/86 px-3 text-sm text-white outline-none transition placeholder:text-iron-700 focus:border-signal"
              placeholder="Paste your auth token"
              autoComplete="current-password"
            />
            <p className="text-xs leading-5 text-iron-300">Use the token printed by the local gateway process.</p>
            ${errors.token &&
            html`<p className="text-sm text-red-200">
              ${errors.token.message}
            </p>`}
          </div>
          ${error &&
          html`<p
            className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
          >
            ${error}
          </p>`}
          <${Button} className="w-full" type="submit" disabled=${isSubmitting}>Connect<//>
        </form>
      </section>
    </main>
  `;
}
