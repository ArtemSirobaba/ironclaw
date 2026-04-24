import { React, html } from "../../../lib/html.js";
import { Panel, StatCard, StatusPill } from "../../../design-system/primitives.js";
import { Button } from "../../../design-system/button.js";
import { Icon } from "../../../design-system/icons.js";
import { useAdminUserDetail, useAdminUsers } from "../hooks/useAdminUsers.js";
import { useUsage } from "../hooks/useAdminUsage.js";
import {
  formatRelativeTime,
  formatCost,
  formatTokenCount,
  truncateId,
  statusTone,
  roleTone,
} from "../lib/admin-presenters.js";

function DetailRow({ label, children }) {
  return html`
    <div className="flex items-start justify-between gap-4 border-t border-white/[0.06] py-3 first:border-0 first:pt-0">
      <span className="text-xs text-iron-300">${label}</span>
      <span className="text-right text-sm text-iron-100">${children}</span>
    </div>
  `;
}

export function UserDetail({ userId, onBack }) {
  const userQuery = useAdminUserDetail(userId);
  const usageQuery = useUsage("month", userId);
  const { suspendUser, activateUser, updateUser, deleteUser, createToken, newToken, clearToken } = useAdminUsers();

  const [role, setRole] = React.useState(null);
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const user = userQuery.data;
  const usageEntries = usageQuery.data?.usage || [];

  React.useEffect(() => {
    if (user && role === null) setRole(user.role);
  }, [user]);

  if (userQuery.isLoading) {
    return html`
      <div className="space-y-5">
        <${Panel} className="p-5 sm:p-6">
          <div className="v2-skeleton mb-2 h-6 w-48 rounded" />
          <div className="v2-skeleton h-4 w-32 rounded" />
        <//>
      </div>
    `;
  }

  if (userQuery.error) {
    return html`
      <${Panel} className="p-5 sm:p-6">
        <p className="text-sm text-red-200">Failed to load user: ${userQuery.error.message}</p>
      <//>
    `;
  }

  if (!user) return null;

  const handleSaveRole = async () => {
    if (role && role !== user.role) {
      await updateUser(user.id, { role });
    }
  };

  const handleDelete = async () => {
    await deleteUser(user.id);
    onBack();
  };

  const handleCreateToken = async () => {
    const name = window.prompt(`Token name for ${user.display_name || "user"}:`);
    if (!name) return;
    await createToken(user.id, name);
  };

  return html`
    <div className="space-y-5">
      <button
        onClick=${onBack}
        className="flex items-center gap-1.5 text-xs text-iron-300 transition hover:text-white"
      >
        <span>←</span>
        <span>Back to users</span>
      </button>

      <${Panel} className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-white">${user.display_name || user.id}</h2>
            <div className="mt-2 flex items-center gap-2">
              <${StatusPill} tone=${roleTone(user.role)} label=${user.role || "member"} />
              <${StatusPill} tone=${statusTone(user.status)} label=${user.status || "active"} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            ${user.status === "active"
              ? html`<${Button} variant="secondary" onClick=${() => suspendUser(user.id)}>Suspend<//>`
              : html`<${Button} variant="secondary" onClick=${() => activateUser(user.id)}>Activate<//>`}
            <${Button} variant="secondary" onClick=${handleCreateToken}>Create token<//>
            <button
              onClick=${() => setConfirmDelete(true)}
              className="v2-button inline-flex h-10 items-center justify-center rounded-md border border-red-400/30 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
            >
              Delete
            </button>
          </div>
        </div>
      <//>

      ${(newToken?.token || newToken?.plaintext_token) && html`
        <div className="rounded-xl border border-signal/30 bg-signal/10 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">Token created</p>
              <p className="mt-1 text-xs text-iron-300">Copy this now — it will not be shown again.</p>
              <code className="mt-2 block truncate rounded-md border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-xs text-iron-100">
                ${newToken.token || newToken.plaintext_token}
              </code>
            </div>
            <button onClick=${clearToken} className="text-iron-300 hover:text-white">
              <${Icon} name="close" className="h-4 w-4" />
            </button>
          </div>
        </div>
      `}

      <div className="grid gap-5 lg:grid-cols-2">
        <${Panel} className="p-5 sm:p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Profile</h3>
          <${DetailRow} label="ID">
            <span className="font-mono text-xs">${user.id}</span>
          <//>
          <${DetailRow} label="Email">${user.email || "Not set"}<//>
          <${DetailRow} label="Created">${formatRelativeTime(user.created_at)}<//>
          <${DetailRow} label="Last login">${formatRelativeTime(user.last_login_at)}<//>
          ${user.created_by && html`
            <${DetailRow} label="Created by">
              <span className="font-mono text-xs">${truncateId(user.created_by)}</span>
            <//>
          `}
        <//>

        <${Panel} className="p-5 sm:p-6">
          <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Summary</h3>
          <${DetailRow} label="Jobs">${user.job_count ?? 0}<//>
          <${DetailRow} label="Total cost">${formatCost(user.total_cost)}<//>
          <${DetailRow} label="Last active">${formatRelativeTime(user.last_active_at)}<//>
        <//>
      </div>

      <${Panel} className="p-5 sm:p-6">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Role management</h3>
        <div className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-xs text-iron-300">Current role</label>
            <select
              value=${role || user.role}
              onChange=${(e) => setRole(e.target.value)}
              className="h-9 rounded-md border border-white/12 bg-white/[0.04] px-3 text-sm text-iron-100 outline-none transition focus:border-signal/45"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <${Button} onClick=${handleSaveRole} disabled=${!role || role === user.role}>
            Save role
          <//>
        </div>
      <//>

      <${Panel} className="p-5 sm:p-6">
        <h3 className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-signal">Usage (last 30 days)</h3>
        ${usageEntries.length === 0
          ? html`<p className="py-4 text-sm text-iron-300">No usage data.</p>`
          : html`
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-left">
                      <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">Model</th>
                      <th className="pb-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">Calls</th>
                      <th className="hidden pb-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300 sm:table-cell">Input</th>
                      <th className="hidden pb-3 pr-4 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300 sm:table-cell">Output</th>
                      <th className="pb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-iron-300">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${usageEntries.map(
                      (e, i) => html`
                        <tr key=${i} className="border-b border-white/[0.06] last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs text-iron-100">${e.model}</td>
                          <td className="py-3 pr-4 font-mono text-xs text-iron-300">${(e.call_count || 0).toLocaleString()}</td>
                          <td className="hidden py-3 pr-4 font-mono text-xs text-iron-300 sm:table-cell">${formatTokenCount(e.input_tokens)}</td>
                          <td className="hidden py-3 pr-4 font-mono text-xs text-iron-300 sm:table-cell">${formatTokenCount(e.output_tokens)}</td>
                          <td className="py-3 font-mono text-xs text-iron-100">${formatCost(e.total_cost)}</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            `}
      <//>

      ${confirmDelete && html`
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick=${() => setConfirmDelete(false)}>
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-iron-900 p-6 shadow-2xl" onClick=${(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">Delete user</h3>
            <p className="mt-2 text-sm text-iron-300">
              Are you sure you want to delete "${user.display_name}"? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <${Button} variant="ghost" onClick=${() => setConfirmDelete(false)}>Cancel<//>
              <button
                onClick=${handleDelete}
                className="v2-button inline-flex h-10 items-center justify-center rounded-md bg-red-500/20 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      `}
    </div>
  `;
}
