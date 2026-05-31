import { requireSession } from "@/lib/superadmin/auth";
import { saFetch } from "@/lib/superadmin/api";
import { blockUser, unblockUser } from "./actions";
import { Shield, ShieldOff, CheckCircle2 } from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  isBlocked: boolean;
  blockedReason: string | null;
  blockedAt: string | null;
  createdAt: string;
}

interface UsersResult {
  total: number;
  page: number;
  pageSize: number;
  items: User[];
}

interface Props {
  searchParams: Promise<{ role?: string; q?: string; page?: string }>;
}

const ROLE_TAB = [
  { value: "", label: "All" },
  { value: "brand", label: "Brands" },
  { value: "creator", label: "Creators" },
];

export default async function SuperAdminUsersPage({ searchParams }: Props) {
  await requireSession();
  const sp = await searchParams;
  const role = sp.role ?? "";
  const q = sp.q ?? "";
  const page = parseInt(sp.page ?? "1");

  let data: UsersResult = { total: 0, page: 1, pageSize: 50, items: [] };
  let error: string | null = null;
  try {
    const qs = new URLSearchParams({ page: String(page) });
    if (role) qs.set("role", role);
    if (q) qs.set("q", q);
    data = await saFetch<UsersResult>(`/api/v1/superadmin/users?${qs}`);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="mt-1 text-sm text-white/40">{data.total} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {ROLE_TAB.map((t) => (
          <a
            key={t.value}
            href={`/superleo/users?role=${t.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${role === t.value ? "bg-primary text-white" : "bg-white/10 text-white/60 hover:bg-white/15 hover:text-white"}`}
          >
            {t.label}
          </a>
        ))}
        <form method="get" action="/superleo/users" className="ml-auto">
          <input type="hidden" name="role" value={role} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search email or name..."
            className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none w-64"
          />
        </form>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {["Name / Email", "Role", "Joined", "Status", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-white/40">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.items.map((u) => (
              <tr key={u.id} className={`border-b border-white/5 ${u.isBlocked ? "bg-red-500/5" : "hover:bg-white/3"}`}>
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{u.fullName ?? "—"}</div>
                  <div className="text-xs text-white/40">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${u.role === "brand" ? "bg-blue-500/20 text-blue-400" : u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-emerald-500/20 text-emerald-400"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-white/40">
                  {new Date(u.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-4 py-3">
                  {u.isBlocked ? (
                    <div>
                      <span className="rounded-full bg-red-500/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">Blocked</span>
                      {u.blockedReason && <div className="mt-0.5 text-xs text-white/30">{u.blockedReason}</div>}
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.isBlocked ? (
                    <form action={unblockUser}>
                      <input type="hidden" name="userId" value={u.id} />
                      <button className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3" /> Unblock
                      </button>
                    </form>
                  ) : (
                    <BlockForm userId={u.id} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.items.length === 0 && !error && (
          <div className="py-12 text-center text-sm text-white/30">No users found</div>
        )}
      </div>

      {/* Pagination */}
      {data.total > data.pageSize && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          {page > 1 && (
            <a href={`/superleo/users?role=${role}&q=${q}&page=${page - 1}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-white/60 hover:bg-white/15">← Prev</a>
          )}
          <span className="text-white/40">Page {page} of {Math.ceil(data.total / data.pageSize)}</span>
          {page < Math.ceil(data.total / data.pageSize) && (
            <a href={`/superleo/users?role=${role}&q=${q}&page=${page + 1}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-white/60 hover:bg-white/15">Next →</a>
          )}
        </div>
      )}
    </div>
  );
}

function BlockForm({ userId }: { userId: string }) {
  return (
    <form action={blockUser} className="flex items-center gap-1">
      <input type="hidden" name="userId" value={userId} />
      <input
        name="reason"
        placeholder="Reason..."
        required
        className="w-32 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-400"
      />
      <button className="flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/30">
        <ShieldOff className="h-3 w-3" /> Block
      </button>
    </form>
  );
}
