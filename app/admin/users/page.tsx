import { Users } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { apiFetch } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { UsersTable, type AdminUser } from "./UsersTable";

export default async function AdminUsersPage() {
  let users: AdminUser[] = [];
  let fetchError: string | null = null;
  try {
    users = await apiFetch<AdminUser[]>(ENDPOINTS.admin.users());
  } catch (e) {
    fetchError = e instanceof Error ? e.message : "Bilinmeyen hata";
  }

  if (users.length === 0) {
    return (
      <div>
        <PageHeader
          title="Kullanıcılar"
          description="Tüm Folkie kullanıcıları ve profilleri."
        />
        <section className="card-folkie">
          <EmptyState
            icon={Users}
            title={fetchError ? "Yüklenemedi" : "Henüz kullanıcı yok"}
            description={fetchError ?? "Kayıt olan kullanıcılar burada görünecek."}
            size="lg"
          />
        </section>
      </div>
    );
  }

  const counts = {
    influencer: users.filter((u) => u.role === "influencer").length,
    brand: users.filter((u) => u.role === "brand").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div>
      <PageHeader
        title="Kullanıcılar"
        description={`${users.length} toplam — ${counts.influencer} creator, ${counts.brand} marka, ${counts.admin} admin`}
      />

      <section className="card-folkie p-4 sm:p-5">
        <UsersTable users={users} />
      </section>
    </div>
  );
}
