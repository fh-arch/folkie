import { redirect } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { getCurrentUserRole } from "@/lib/clerk/role";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getCurrentUserRole();
  if (role !== "admin") redirect("/admin-login");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-primary bg-card">
        <div className="container-folkie flex flex-wrap items-center justify-between gap-3 py-4">
          <Link href="/admin" className="text-h3 font-bold text-primary">
            Folkie · Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small">
            <Link href="/admin" className="hover:text-primary">
              Panel
            </Link>
            <Link href="/admin/brands" className="hover:text-primary">
              Brands
            </Link>
            <Link href="/admin/creators" className="hover:text-primary">
              Creators
            </Link>
            <Link href="/admin/payments" className="hover:text-primary">
              Payments
            </Link>
            <span className="hidden h-4 w-px bg-border md:inline" />
            <Link
              href="/admin/campaigns"
              className="text-muted-foreground hover:text-primary"
            >
              Campaigns
            </Link>
            <Link
              href="/admin/applications"
              className="text-muted-foreground hover:text-primary"
            >
              Applications
            </Link>
            <Link
              href="/admin/content"
              className="text-muted-foreground hover:text-primary"
            >
              Content
            </Link>
            <Link
              href="/admin/users"
              className="text-muted-foreground hover:text-primary"
            >
              Users
            </Link>
            <UserButton />
          </nav>
        </div>
      </header>
      <main className="container-folkie py-8">{children}</main>
    </div>
  );
}
