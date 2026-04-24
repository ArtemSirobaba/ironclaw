import { useForm } from "react-hook-form";
import { Button } from "../../design-system/button.js";
import { Icon } from "../../design-system/icons.js";
import { useInterfaceTheme } from "../../design-system/theme.js";
import { html } from "../../lib/html.js";
import { useT } from "../../lib/i18n.js";

export function LoginPage({ initialToken, error, onSubmit }) {
  const t = useT();
  const { theme, toggleTheme } = useInterfaceTheme();
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
    <main
      className="relative grid min-h-[100dvh] px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)] lg:items-center lg:gap-12 lg:px-12"
    >
      <button
        type="button"
        onClick=${toggleTheme}
        className="v2-button absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-md border border-iron-700 bg-iron-800/70 text-iron-300 hover:text-iron-100 sm:right-6 sm:top-6"
        aria-label=${theme === "dark"
          ? t("theme.switchToLight")
          : t("theme.switchToDark")}
        title=${theme === "dark" ? t("theme.light") : t("theme.dark")}
      >
        <${Icon}
          name=${theme === "dark" ? "sun" : "moon"}
          className="h-4 w-4"
        />
      </button>

      <section className="hidden max-w-2xl self-center lg:block">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
          ${t("login.tagline")}
        </p>
        <h1
          className="mt-4 font-serif text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-iron-100"
        >
          ${t("login.hero")}
        </h1>

        <div className="mt-10 grid max-w-xl grid-cols-[1fr_0.7fr] gap-3">
          <div className="v2-panel rounded-xl p-6">
            <div className="flex items-center gap-3 text-signal">
              <${Icon} name="lock" className="h-5 w-5" />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.16em]"
                >${t("login.bearerAuth")}</span
              >
            </div>
            <p className="mt-4 text-sm leading-6 text-iron-300">
              ${t("login.bearerDesc")}
            </p>
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

      <section
        className="v2-panel w-full max-w-md self-center rounded-xl p-6 sm:ml-auto"
      >
        <div className="mb-8">
          <p
            className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-signal"
          >
            ${t("login.tagline")}
          </p>
          <h1
            className="font-serif text-5xl font-semibold leading-none tracking-[-0.04em] text-iron-100"
          >
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
              className="h-11 w-full rounded-md border border-iron-700 bg-iron-900 px-3 text-sm text-iron-100 outline-none placeholder:text-iron-400 focus:border-signal"
              placeholder=${t("login.tokenPlaceholder")}
              autocomplete="current-password"
            />
            <p className="text-xs leading-5 text-iron-300">
              ${t("login.tokenHint")}
            </p>
            ${errors.token &&
            html`<p className="text-sm text-[var(--v2-danger-text)]">
              ${errors.token.message}
            </p>`}
          </div>
          ${error &&
          html`<p
            className="rounded-md border border-[color-mix(in_srgb,var(--v2-danger-text)_36%,var(--v2-panel-border))] bg-[var(--v2-danger-soft)] px-3 py-2 text-sm text-[var(--v2-danger-text)]"
          >
            ${error}
          </p>`}
          <${Button} className="w-full" type="submit" disabled=${isSubmitting}
            >${t("login.connect")}<//
          >
        </form>
      </section>
    </main>
  `;
}
