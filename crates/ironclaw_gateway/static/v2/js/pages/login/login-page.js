import { useForm } from "react-hook-form";
import { Button } from "../../design-system/button.js";
import { html } from "../../lib/html.js";
import { useT } from "../../lib/i18n.js";
import { Icon } from "../../design-system/icons.js";

export function LoginPage({ initialToken, error, onSubmit }) {
  const t = useT();
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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">${t("login.tagline")}</p>
        <h1 className="mt-4 font-serif text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-white">
          ${t("login.hero")}
        </h1>
        <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-iron-300">
          ${t("login.heroSub")}
        </p>
        <div className="mt-10 grid max-w-xl grid-cols-[1fr_0.7fr] gap-3">
          <div className="v2-panel rounded-xl p-6">
            <div className="flex items-center gap-3 text-signal">
              <${Icon} name="lock" className="h-5 w-5" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">${t("login.bearerAuth")}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-iron-300">${t("login.bearerDesc")}</p>
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
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal">
            ${t("login.tagline")}
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-white">
            ${t("login.console")}
          </h1>
          <p className="mt-4 text-sm leading-6 text-iron-300">
            ${t("login.secureSub")}
          </p>
        </div>
        <form
          className="space-y-4"
          onSubmit=${handleSubmit(({ token }) => onSubmit(token))}
        >
          <label
            className="block text-sm font-medium text-iron-200"
            htmlFor="v2-token"
            >${t("login.tokenLabel")}</label
          >
          <div className="grid gap-2">
            <input
              id="v2-token"
              type="password"
              ...${register("token", {
                required: t("login.tokenRequired"),
                setValueAs: (value) => value.trim(),
              })}
              className="h-11 w-full rounded-md border border-white/10 bg-iron-900/86 px-3 text-sm text-white outline-none transition placeholder:text-iron-700 focus:border-signal"
              placeholder=${t("login.tokenPlaceholder")}
              autoComplete="current-password"
            />
            <p className="text-xs leading-5 text-iron-300">${t("login.tokenHint")}</p>
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
          <${Button} className="w-full" type="submit" disabled=${isSubmitting}>${t("login.connect")}<//>
        </form>
      </section>
    </main>
  `;
}
