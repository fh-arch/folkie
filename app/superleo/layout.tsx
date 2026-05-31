import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/superadmin/auth";
import {
  LayoutDashboard, Users, Megaphone, Clock,
  DollarSign, FileText, BarChart3, Shield, LogOut,
} from "lucide-react";

const NAV = [
  { href: "/superleo",           label: "Dashboard",       icon: LayoutDashboard },
  { href: "/superleo/users",     label: "Users",           icon: Users },
  { href: "/superleo/campaigns", label: "Campaigns",       icon: Megaphone },
  { href: "/superleo/pending",   label: "Pending Queues",  icon: Clock },
  { href: "/superleo/revenue",   label: "Revenue",         icon: DollarSign },
  { href: "/superleo/payments",  label: "Payments",        icon: FileText },
  { href: "/superleo/analytics", label: "Analytics",       icon: BarChart3 },
];

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  // Redirect to login for all non-login pages
  return (
    <div className="flex h-screen bg-[#0D1226] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-white/10 bg-[#0a0f1e]">
        <div className="flex items-center gap-2 px-5 py-5">
          <Shield className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold text-white">Super Admin</span>
        </div>

        <nav className="flex-1 space-y-0.5 px-2 pb-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-3 py-3">
          <form action={async () => { "use server"; await destroySession(); redirect("/superleo/login"); }}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
          <p className="mt-2 px-3 text-xs text-white/30">{session?.email}</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
