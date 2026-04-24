import { React, html } from "../../../lib/html.js";
import { Panel, StatusPill, EmptyPanel } from "../../../design-system/primitives.js";
import { Button } from "../../../design-system/button.js";
import { Icon } from "../../../design-system/icons.js";
import { useAdminUsers } from "../hooks/useAdminUsers.js";
import {
  formatRelativeTime,
  formatCost,
  truncateId,
  statusTone,
  roleTone,
  filterUsers,
} from "../lib/admin-presenters.js";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "admin", label: "Admins" },
];

function TokenBanner({ token, onDismiss }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return html`
    <div className="rounded-xl border border-signal/30 bg-signal/10 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Token created</p>
          <p className="mt-1 text-xs text-iron-300">Copy this now — it will not be shown again.</p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-iron-100">
              ${token}
            </code>
            <${Button} variant="secondary" onClick=${handleCopy}>
              ${copied ? "Copied" : "Copy"}
            <//>
          </div>
        </div>
        <button onClick=${onDismiss} className="text-iron-300 hover:text-white">
          <${Icon} name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  `;
}

function CreateUserForm({ onCreate, isCreating, error }) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState("member");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreate({ display_name: name.trim(), email: email.trim() || undefined, role });
    setName("");
    setEmail("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return html`
      <${Button} variant="secondary" onClick=${() => setIsOpen(true)}>
        <${Icon} name="plus" className="mr-2 h-4 w-4" />
        New user
      <//>
    `;
  }

  return html`
    <${Panel} className="p-5 sm:p-6">
      <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Create user</h3>
      <form onSubmit=${handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs text-iron-300">Display name</label>
            <input
              type="text"
              value=${name}
              onChange=${(e) => setName(e.target.value)}
              required
              className="h-9 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-iron-300">Email</label>
            <input
              type="email"
              value=${email}
              onChange=${(e) => setEmail(e.target.value)}
              className="h-9 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
              placeholder="jane@example.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-iron-300">Role</label>
            <select
              value=${role}
              onChange=${(e) => setRole(e.target.value)}
              className="h-9 w-full rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition focus:border-signal/45"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        ${error && html`<p className="text-sm text-red-200">${error.message}</p>`}
        <div className="flex gap-2">
          <${Button} type="submit" disabled=${isCreating}>
            ${isCreating ? "Creating…" : "Create user"}
          <//>
          <${Button} variant="ghost" type="button" onClick=${() => setIsOpen(false)}>Cancel<//>
        </div>
      </form>
    <//>
  `;
}

function ConfirmModal({ title, message, confirmLabel, onConfirm, onCancel }) {
  return html`
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick=${onCancel}>
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-iron-900 p-6 shadow-2xl" onClick=${(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-white">${title}</h3>
        <p className="mt-2 text-sm text-iron-300">${message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <${Button} variant="ghost" onClick=${onCancel}>Cancel<//>
          <button
            onClick=${onConfirm}
            className="v2-button inline-flex h-10 items-center justify-center rounded-md bg-red-500/20 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
          >
            ${confirmLabel}
          </button>
        </div>
      </div>
    </div>
  `;
}

function UserRow({ user, onSelect, onSuspend, onActivate, onChangeRole, onCreateToken }) {
  return html`
    <div className="flex items-center justify-between gap-4 border-t border-white/[0.06] py-3.5 first:border-0 first:pt-0">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick=${() => onSelect(user.id)}
            className="text-sm font-medium text-signal hover:underline"
          >
            ${user.display_name || user.id}
          </button>
          <${StatusPill} tone=${roleTone(user.role)} label=${user.role || "member"} />
          <${StatusPill} tone=${statusTone(user.status)} label=${user.status || "active"} />
        </div>
        <div className="mt-0.5 flex flex-wrap gap-x-4 gap-y-0.5">
          ${user.email && html`<span className="font-mono text-xs text-iron-300">${user.email}</span>`}
          <span className="font-mono text-xs text-iron-700">${truncateId(user.id)}</span>
        </div>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <span className="hidden font-mono text-xs text-iron-300 sm:inline">
          ${user.job_count != null ? `${user.job_count} jobs` : ""}
          ${user.total_cost != null ? ` · ${formatCost(user.total_cost)}` : ""}
        </span>
        <span className="hidden text-xs text-iron-700 lg:inline">${formatRelativeTime(user.last_active_at)}</span>
        <div className="flex gap-1">
          ${user.status === "active"
            ? html`<button onClick=${() => onSuspend(user.id)} className="rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-iron-300 transition hover:border-red-400/30 hover:text-red-200">Suspend</button>`
            : html`<button onClick=${() => onActivate(user.id)} className="rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-iron-300 transition hover:border-signal/30 hover:text-signal">Activate</button>`}
          <button
            onClick=${() => onChangeRole(user.id, user.role === "admin" ? "member" : "admin")}
            className="rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-iron-300 transition hover:border-white/20 hover:text-white"
          >
            ${user.role === "admin" ? "Demote" : "Promote"}
          </button>
          <button
            onClick=${() => onCreateToken(user.id, user.display_name)}
            className="rounded-md border border-white/10 px-2.5 py-1.5 text-[11px] font-medium text-iron-300 transition hover:border-signal/30 hover:text-signal"
          >
            Token
          </button>
        </div>
      </div>
    </div>
  `;
}

export function AdminUsersTab({ selectedUserId, onSelectUser }) {
  const {
    users, query, isForbidden, createUser, isCreating, createError,
    updateUser, deleteUser, suspendUser, activateUser, createToken,
    newToken, clearToken,
  } = useAdminUsers();

  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("all");
  const [confirm, setConfirm] = React.useState(null);

  const filtered = filterUsers(users, { search, filter });

  const handleSuspend = (id) => {
    setConfirm({
      title: "Suspend user",
      message: "This will prevent the user from authenticating. Continue?",
      confirmLabel: "Suspend",
      onConfirm: () => { suspendUser(id); setConfirm(null); },
    });
  };

  const handleCreateToken = async (userId, displayName) => {
    const name = window.prompt(`Token name for ${displayName || "user"}:`);
    if (!name) return;
    await createToken(userId, name);
  };

  if (query.isLoading) {
    return html`
      <${Panel} className="p-5 sm:p-6">
        <div className="v2-skeleton mb-4 h-3 w-24 rounded" />
        ${[1, 2, 3].map((i) => html`
          <div key=${i} className="flex items-center justify-between border-t border-white/[0.06] py-3.5 first:border-0">
            <div className="v2-skeleton h-4 w-32 rounded" />
            <div className="v2-skeleton h-6 w-20 rounded-full" />
          </div>
        `)}
      <//>
    `;
  }

  if (isForbidden) {
    return html`
      <${Panel} className="p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <${Icon} name="lock" className="h-5 w-5 text-iron-700" />
          <h3 className="text-lg font-semibold text-white">Admin access required</h3>
        </div>
        <p className="mt-2 max-w-md text-sm leading-6 text-iron-300">
          User management is only available to accounts with admin privileges.
        </p>
      <//>
    `;
  }

  return html`
    <div className="space-y-5">
      ${newToken && html`
        <${TokenBanner}
          token=${newToken.token || newToken.plaintext_token}
          onDismiss=${clearToken}
        />
      `}

      <${CreateUserForm} onCreate=${createUser} isCreating=${isCreating} error=${createError} />

      <${Panel} className="p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
            Users (${filtered.length}${filtered.length !== users.length ? ` / ${users.length}` : ""})
          </h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search…"
              value=${search}
              onChange=${(e) => setSearch(e.target.value)}
              className="h-8 w-48 rounded-md border border-white/12 bg-white/[0.04] px-3 text-xs text-iron-100 outline-none transition placeholder:text-iron-700 focus:border-signal/45"
            />
            <div className="flex gap-1">
              ${FILTERS.map(
                (f) => html`
                  <button
                    key=${f.value}
                    onClick=${() => setFilter(f.value)}
                    className=${[
                      "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition",
                      filter === f.value
                        ? "border border-signal/35 bg-signal/10 text-white"
                        : "border border-transparent text-iron-300 hover:text-white",
                    ].join(" ")}
                  >
                    ${f.label}
                  </button>
                `
              )}
            </div>
          </div>
        </div>

        ${filtered.length === 0
          ? html`<p className="py-4 text-sm text-iron-300">No users match the current filters.</p>`
          : filtered.map(
              (user) => html`
                <${UserRow}
                  key=${user.id}
                  user=${user}
                  onSelect=${onSelectUser}
                  onSuspend=${handleSuspend}
                  onActivate=${activateUser}
                  onChangeRole=${(id, role) => updateUser(id, { role })}
                  onCreateToken=${handleCreateToken}
                />
              `
            )}
      <//>

      ${confirm && html`
        <${ConfirmModal}
          title=${confirm.title}
          message=${confirm.message}
          confirmLabel=${confirm.confirmLabel}
          onConfirm=${confirm.onConfirm}
          onCancel=${() => setConfirm(null)}
        />
      `}
    </div>
  `;
}
