import { Button } from "../../../design-system/button.js";
import { Icon } from "../../../design-system/icons.js";
import { StatusPill } from "../../../design-system/primitives.js";
import { React, html } from "../../../lib/html.js";
import { useT } from "../../../lib/i18n.js";
import { useUsers } from "../hooks/useUsers.js";

function CreateUserForm({ onCreate, isCreating, error }) {
  const t = useT();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("member");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(
      { display_name: name.trim(), email: email.trim() || undefined, role },
      {
        onSuccess: () => {
          setName("");
          setEmail("");
          setIsOpen(false);
        },
      }
    );
  };

  if (!isOpen) {
    return html`
      <${Button} variant="secondary" onClick=${() => setIsOpen(true)}>
        <${Icon} name="plus" className="mr-2 h-4 w-4" />
        ${t("users.addUser")}
      <//>
    `;
  }

  return html`
    <div className="v2-panel rounded-[18px] p-5 sm:p-6">
      <h3
        className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal"
      >
        ${t("users.newUser")}
      </h3>
      <form onSubmit=${handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-iron-300"
              >${t("users.displayName")}</label
            >
            <input
              type="text"
              value=${name}
              onChange=${(e) => setName(e.target.value)}
              required
              className="h-9 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-iron-300"
              >${t("users.email")}</label
            >
            <input
              type="email"
              value=${email}
              onChange=${(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-iron-300"
            >${t("users.role")}</label
          >
          <select
            value=${role}
            onChange=${(e) => setRole(e.target.value)}
            className="h-9 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition focus:border-signal/45"
          >
            <option value="member">${t("users.member")}</option>
            <option value="admin">${t("users.admin")}</option>
          </select>
        </div>
        ${error &&
        html` <p className="text-sm text-red-200">${error.message}</p> `}
        <div className="flex gap-2">
          <${Button} type="submit" disabled=${isCreating}>
            ${isCreating ? t("users.creating") : t("users.createUser")}
          <//>
          <${Button}
            variant="ghost"
            type="button"
            onClick=${() => setIsOpen(false)}
            >${t("users.cancel")}<//
          >
        </div>
      </form>
    </div>
  `;
}

function UserRow({ user }) {
  const t = useT();
  const statusTone = user.status === "active" ? "success" : "danger";
  const roleTone = user.role === "admin" ? "signal" : "muted";

  return html`
    <div
      className="flex items-center justify-between gap-4 border-t border-white/[0.06] py-3.5 first:border-0 first:pt-0"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-iron-200"
            >${user.display_name || user.id}</span
          >
          <${StatusPill}
            tone=${roleTone}
            label=${user.role === "admin"
              ? t("users.admin")
              : t("users.member")}
          />
          <${StatusPill} tone=${statusTone} label=${user.status || "active"} />
        </div>
        ${user.email &&
        html`
          <div className="mt-0.5 font-mono text-xs text-iron-300">
            ${user.email}
          </div>
        `}
      </div>
      <div
        className="flex shrink-0 items-center gap-4 font-mono text-[11px] text-iron-700"
      >
        ${user.last_active &&
        html`<span>${new Date(user.last_active).toLocaleDateString()}</span>`}
      </div>
    </div>
  `;
}

export function UsersTab() {
  const t = useT();
  const { users, query, isForbidden, createUser, createError, isCreating } =
    useUsers();

  if (query.isLoading) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <div className="v2-skeleton mb-4 h-3 w-24 rounded" />
        ${[1, 2, 3].map(
          (i) => html`
            <div
              key=${i}
              className="flex items-center justify-between border-t border-white/[0.06] py-3.5 first:border-0"
            >
              <div className="v2-skeleton h-4 w-32 rounded" />
              <div className="v2-skeleton h-6 w-20 rounded-full" />
            </div>
          `
        )}
      </div>
    `;
  }

  if (isForbidden) {
    return html`
      <div className="v2-panel rounded-[18px] p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <${Icon} name="lock" className="h-5 w-5 text-iron-700" />
          <h3 className="text-lg font-semibold text-white">
            ${t("users.adminRequired")}
          </h3>
        </div>
        <p className="mt-2 max-w-md text-sm leading-6 text-iron-300">
          ${t("users.adminRequiredDesc")}
        </p>
      </div>
    `;
  }

  if (query.error) {
    return html`
      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <p className="text-sm text-red-200">
          ${t("users.failedLoad", { message: query.error.message })}
        </p>
      </div>
    `;
  }

  return html`
    <div className="space-y-5">
      <${CreateUserForm}
        onCreate=${createUser}
        isCreating=${isCreating}
        error=${createError}
      />

      <div className="v2-panel rounded-[18px] p-5 sm:p-6">
        <h3
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal"
        >
          ${t("users.title", { count: users.length })}
        </h3>
        ${users.length === 0
          ? html`<p className="py-4 text-sm text-iron-300">
              ${t("users.noUsers")}
            </p>`
          : users.map(
              (user) => html`<${UserRow} key=${user.id} user=${user} />`
            )}
      </div>
    </div>
  `;
}
