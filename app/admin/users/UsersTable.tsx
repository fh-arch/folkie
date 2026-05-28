"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

export interface AdminUser {
  id: string;
  clerkUserId: string;
  email: string;
  role: string;
  fullName: string | null;
  hasProfile: boolean;
  createdAt: string;
}

const ROLE_BADGE: Record<string, string> = {
  influencer: "bg-accent/30 text-foreground",
  brand: "bg-primary-light text-primary",
  admin: "bg-destructive/15 text-destructive",
};

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.email.toLocaleLowerCase("tr").includes(q) ||
        (u.fullName ?? "").toLocaleLowerCase("tr").includes(q)
      );
    });
  }, [users, query, roleFilter]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <div className="relative flex-1 sm:flex-initial">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="E-posta veya isim ara..."
            className="h-9 w-full rounded-full border border-border bg-background pl-9 pr-3 text-small focus:border-primary focus:outline-none sm:w-72"
          />
        </div>

        <div className="flex gap-1">
          {[
            { value: "all", label: "Tümü" },
            { value: "brand", label: "Markalar" },
            { value: "influencer", label: "Creator'lar" },
            { value: "admin", label: "Adminler" },
          ].map((r) => (
            <button
              key={r.value}
              onClick={() => setRoleFilter(r.value)}
              className={`rounded-full px-3 py-1.5 text-small font-medium ${
                roleFilter === r.value
                  ? "bg-primary-light text-primary"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <span className="ml-auto text-caption text-muted-foreground">
          {filtered.length} sonuç
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center">
          <Search className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-small font-semibold">
            Eşleşen kullanıcı yok
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-4 hidden overflow-x-auto md:block">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-border text-left text-caption text-muted-foreground">
                  <th className="py-3 pr-4 font-medium">Kullanıcı</th>
                  <th className="py-3 pr-4 font-medium">Rol</th>
                  <th className="py-3 pr-4 font-medium">Profil</th>
                  <th className="py-3 pr-4 font-medium">Kayıt</th>
                  <th className="py-3 font-medium">Clerk ID</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-border last:border-0 cursor-pointer hover:bg-muted/30"
                  >
                    <td className="py-3 pr-4">
                      <Link href={`/admin/users/${u.id}`} className="block">
                        <div className="font-semibold hover:text-primary">
                          {u.fullName ?? "(İsim yok)"}
                        </div>
                        <div className="text-caption text-muted-foreground">
                          {u.email}
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-caption font-semibold capitalize ${ROLE_BADGE[u.role] ?? "bg-muted"}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {u.hasProfile ? (
                        <span className="text-success">✓ Tam</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-caption text-muted-foreground">
                      {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                    </td>
                    <td className="py-3 font-mono text-caption text-muted-foreground">
                      {u.clerkUserId.slice(0, 16)}…
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="mt-4 space-y-3 md:hidden">
            {filtered.map((u) => (
              <Link
                key={u.id}
                href={`/admin/users/${u.id}`}
                className="block rounded-2xl border border-border bg-background p-4 hover:border-primary"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">
                      {u.fullName ?? "(İsim yok)"}
                    </div>
                    <div className="truncate text-caption text-muted-foreground">
                      {u.email}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-caption font-semibold capitalize ${ROLE_BADGE[u.role] ?? "bg-muted"}`}
                  >
                    {u.role}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-caption text-muted-foreground">
                  <span>
                    Kayıt: {new Date(u.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                  <span>{u.hasProfile ? "✓ Profil tam" : "Profil yok"}</span>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
