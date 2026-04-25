import { useForm } from "react-hook-form";
import { Button } from "../../design-system/button.js";
import { Card } from "../../design-system/card.js";
import { Input, FormField, Label } from "../../design-system/input.js";
import { Icon } from "../../design-system/icons.js";
import { useInterfaceTheme } from "../../design-system/theme.js";
import { html } from "../../lib/html.js";
import { useT } from "../../lib/i18n.js";
import { cn } from "../../utils/cn.js";

export function LoginPage({ initialToken, error, onSubmit }) {
  const t = useT();
  const { theme, toggleTheme } = useInterfaceTheme();
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm({
    defaultValues: { token: initialToken || "" },
  });

  return html`
    <main
      className="relative grid min-h-[100dvh] bg-[var(--v2-canvas)] px-4 py-8 sm:px-6
        lg:grid-cols-[minmax(0,1fr)_minmax(380px,520px)] lg:items-center lg:gap-12 lg:px-12"
    >
      <!-- Theme toggle -->
      <${Button}
        variant="secondary"
        size="icon"
        onClick=${toggleTheme}
        aria-label=${theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
        title=${theme === "dark" ? t("theme.light") : t("theme.dark")}
        className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6"
      >
        <${Icon} name=${theme === "dark" ? "sun" : "moon"} className="h-4 w-4" />
      <//>

      <!-- Left: marketing copy (desktop only) -->
      <section className="hidden max-w-2xl self-center lg:block">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--v2-accent-text)]">
          ${t("login.tagline")}
        </p>
        <h1
          className="mt-4 font-sans text-6xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--v2-text-strong)]"
        >
          ${t("login.hero")}
        </h1>

        <div className="mt-10 grid max-w-xl grid-cols-[1fr_0.7fr] gap-3">
          <${Card} padding="md">
            <div className="flex items-center gap-3 text-[var(--v2-accent-text)]">
              <${Icon} name="lock" className="h-5 w-5" />
              <span className="font-mono text-[11px] uppercase tracking-[0.16em]">
                ${t("login.bearerAuth")}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--v2-text-muted)]">
              ${t("login.bearerDesc")}
            </p>
          <//>

          <${Card} padding="md">
            <div className="h-2 w-16 rounded bg-[var(--v2-accent)]/60" />
            <div className="mt-4 space-y-2">
              <!-- Skeleton lines -->
              <div
                className="h-2 rounded"
                style=${{ background: "linear-gradient(90deg, var(--v2-surface-muted), color-mix(in srgb, var(--v2-surface-muted) 64%, var(--v2-accent-soft)), var(--v2-surface-muted))" }}
              />
              <div
                className="h-2 w-2/3 rounded"
                style=${{ background: "linear-gradient(90deg, var(--v2-surface-muted), color-mix(in srgb, var(--v2-surface-muted) 64%, var(--v2-accent-soft)), var(--v2-surface-muted))" }}
              />
            </div>
          <//>
        </div>
      </section>

      <!-- Right: login form -->
      <${Card}
        as="section"
        radius="lg"
        padding="md"
        className="w-full max-w-md self-center p-6 sm:ml-auto sm:p-8"
      >
        <div className="mb-8">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-[var(--v2-accent-text)]">
            ${t("login.tagline")}
          </p>
          <h1
            className="text-5xl font-semibold leading-none tracking-[-0.04em] text-[var(--v2-text-strong)]"
          >
            ${t("login.console")}
          </h1>
          <p className="mt-4 text-sm leading-6 text-[var(--v2-text-muted)]">
            ${t("login.secureSub")}
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit=${handleSubmit(({ token }) => onSubmit(token))}
        >
          <${FormField}
            label=${t("login.tokenLabel")}
            htmlFor="v2-token"
            error=${errors.token?.message ?? ""}
            hint=${t("login.tokenHint")}
          >
            <${Input}
              id="v2-token"
              type="password"
              error=${!!errors.token}
              ...${register("token", {
                required: t("login.tokenRequired"),
                setValueAs: (v) => v.trim(),
              })}
              placeholder=${t("login.tokenPlaceholder")}
              autocomplete="current-password"
            />
          <//>

          ${error &&
            html`<p
              className=${cn(
                "rounded-[10px] border px-3 py-2 text-sm",
                "border-[color-mix(in_srgb,var(--v2-danger-text)_36%,var(--v2-panel-border))]",
                "bg-[var(--v2-danger-soft)] text-[var(--v2-danger-text)]"
              )}
            >${error}</p>`}

          <${Button}
            type="submit"
            variant="primary"
            fullWidth
            disabled=${isSubmitting}
          >
            ${t("login.connect")}
          <//>
        </form>
      <//>
    </main>
  `;
}
