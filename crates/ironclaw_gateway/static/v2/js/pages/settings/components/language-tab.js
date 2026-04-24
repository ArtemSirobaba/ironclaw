import { html } from "../../../lib/html.js";
import { AVAILABLE_LANGUAGES, useI18n, useT } from "../../../lib/i18n.js";

export function LanguageTab() {
  const t = useT();
  const { lang, setLang } = useI18n();

  const current = AVAILABLE_LANGUAGES.find((l) => l.code === lang) || AVAILABLE_LANGUAGES[0];

  return html`
    <div className="v2-panel rounded-[18px] p-5 sm:p-6">
      <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
        ${t("lang.title")}
      </h3>
      <p className="text-sm leading-6 text-iron-300">
        ${t("lang.description")}
      </p>

      <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="text-xs text-iron-300">${t("lang.current")}</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-white">${current.native}</span>
          <span className="font-mono text-xs text-iron-700">${current.name}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        ${AVAILABLE_LANGUAGES.map(
          (l) => html`
            <button
              key=${l.code}
              type="button"
              onClick=${() => setLang(l.code)}
              className=${[
                "flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition",
                l.code === lang
                  ? "border-signal/35 bg-signal/10 text-white"
                  : "border-white/[0.06] bg-white/[0.02] text-iron-300 hover:border-white/10 hover:bg-white/[0.035] hover:text-white",
              ].join(" ")}
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">${l.native}</div>
                <div className="truncate font-mono text-[11px] text-iron-700">${l.name}</div>
              </div>
              <div className="shrink-0 font-mono text-[11px] text-iron-700">${l.code}</div>
            </button>
          `
        )}
      </div>
    </div>
  `;
}

