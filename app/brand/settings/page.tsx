"use client";

import { useState, useEffect } from "react";
import {
  User,
  Building2,
  CreditCard,
  Users,
  Bell,
  Lock,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { AvatarUpload } from "@/components/shared/AvatarUpload";
import { cn, formatTRY } from "@/lib/utils";
import { getBrandProfile, saveBrandProfile } from "./actions";

const TABS = [
  { key: "brand",    label: "Brand Profile", icon: Building2 },
  { key: "billing",  label: "Billing",       icon: CreditCard },
  { key: "team",     label: "Team",          icon: Users },
  { key: "notif",    label: "Notifications", icon: Bell },
  { key: "security", label: "Security",      icon: Lock },
] as const;

export default function BrandSettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("brand");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your brand profile, billing, team, and preferences."
        breadcrumbs={[{ label: "Settings" }]}
      />

      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <nav className="card-folkie p-2 lg:p-3">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-small transition-colors",
                  active
                    ? "bg-primary-light font-semibold text-primary"
                    : "text-foreground/70 hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <section className="card-folkie p-6">
          {tab === "brand" && <BrandProfileSection />}
          {tab === "billing" && <BillingSection />}
          {tab === "team" && <TeamSection />}
          {tab === "notif" && <NotificationsSection />}
          {tab === "security" && <SecuritySection />}
        </section>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 flex items-baseline justify-between text-small font-medium">
        <span>{label}</span>
        {hint && <span className="text-caption font-normal text-muted-foreground">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    />
  );
}

function BrandProfileSection() {
  const [form, setForm] = useState({
    brandName: "",
    industry: "",
    website: "",
    taxId: "",
    contactName: "",
    contactPhone: "",
    billingAddress: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBrandProfile()
      .then((profile) => {
        if (profile) {
          setForm({
            brandName: profile.brandName ?? "",
            industry: profile.industry ?? "",
            website: profile.website ?? "",
            taxId: profile.taxId ?? "",
            contactName: profile.contactName ?? "",
            contactPhone: profile.contactPhone ?? "",
            billingAddress: profile.billingAddress ?? "",
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await saveBrandProfile({
      brandName: form.brandName,
      industry: form.industry || null,
      website: form.website || null,
      taxId: form.taxId || null,
      logoUrl: null,
      contactName: form.contactName || null,
      contactPhone: form.contactPhone || null,
      billingAddress: form.billingAddress || null,
    });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const fieldMsg = result.fieldErrors?.map((f) => f.errorMessage).join(" · ");
      setError(fieldMsg || result.error || "Bilinmeyen hata");
    }
  }

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-small text-muted-foreground">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h3>Marka Profili</h3>
        <p className="mt-1 text-small text-muted-foreground">
          Bu bilgileri creator&apos;lar başvuru yaparken görür.
        </p>
        <div className="mt-4">
          <AvatarUpload fallbackInitial={form.brandName.charAt(0) || "M"} size={80} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Marka adı">
          <Input value={form.brandName} onChange={(e) => update("brandName", e.target.value)} />
        </Field>
        <Field label="Sektör">
          <Input value={form.industry} onChange={(e) => update("industry", e.target.value)} />
        </Field>
        <Field label="Web sitesi">
          <Input value={form.website} onChange={(e) => update("website", e.target.value)} />
        </Field>
        <Field label="Vergi numarası" hint="11 hane">
          <Input value={form.taxId} onChange={(e) => update("taxId", e.target.value)} />
        </Field>
        <Field label="İletişim adı">
          <Input value={form.contactName} onChange={(e) => update("contactName", e.target.value)} />
        </Field>
        <Field label="İletişim telefonu">
          <Input value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
        </Field>
      </div>

      <Field label="Fatura adresi">
        <textarea
          rows={3}
          value={form.billingAddress}
          onChange={(e) => update("billingAddress", e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-small focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </Field>

      {error && <p className="text-small text-destructive">{error}</p>}
      {saved && <p className="text-small text-success">✓ Kaydedildi</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-small font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
}

function BillingSection() {
  return (
    <div className="space-y-5">
      <h3>Ücretlendirme</h3>

      <div className="rounded-2xl bg-primary-light p-5">
        <div className="text-caption text-primary/70">Abonelik</div>
        <div className="mt-1 text-h2 font-bold text-primary">Yok ✓</div>
        <div className="mt-1 text-caption text-foreground/70">
          Folkie&apos;de aylık abonelik yok. Sadece tamamlanan kampanyalardan{" "}
          <strong>%15 komisyon</strong> alıyoruz.
        </div>
      </div>

      <div>
        <h4 className="text-body font-semibold">Kampanya Ödemelerim</h4>
        <p className="mt-1 text-caption text-muted-foreground">
          Tamamlanan kampanyaların ödeme + komisyon dağılımı burada listelenecek.
        </p>
        <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center">
          <CreditCard className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-small font-semibold">Henüz ödeme yok</p>
          <p className="mt-1 text-caption text-muted-foreground">
            İlk kampanyan tamamlandığında fatura geçmişin burada görünecek.
          </p>
        </div>
      </div>
    </div>
  );
}

function TeamSection() {
  return (
    <div className="space-y-5">
      <h3>Ekip</h3>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Users className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-small font-semibold">Çoklu kullanıcı yakında</p>
        <p className="mx-auto mt-1 max-w-md text-caption text-muted-foreground">
          Birden fazla kişinin aynı marka hesabını yönetmesi geliştirme
          aşamasında. Şu an her marka tek kullanıcı tarafından yönetiliyor.
        </p>
        <p className="mt-3 text-caption text-muted-foreground">
          Erken erişim için:{" "}
          <a
            href="mailto:destek@folkie.com.tr"
            className="text-primary hover:underline"
          >
            destek@folkie.com.tr
          </a>
        </p>
      </div>
    </div>
  );
}

function NotificationsSection() {
  return (
    <div className="space-y-5">
      <h3>Bildirimler</h3>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-small">
        <p className="font-semibold text-primary">
          Tüm önemli bildirimler aktif
        </p>
        <p className="mt-1 text-foreground/70">
          Yeni başvurular, içerik teslimleri, ödeme onayları ve kampanya durum
          değişiklikleri için hem e-posta hem uygulama bildirimi alıyorsun. Sağ
          üst köşedeki zil ikonundan tüm bildirimleri görebilirsin.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-small font-semibold">
          Kişiselleştirilmiş tercihler yakında
        </p>
        <p className="mx-auto mt-1 max-w-md text-caption text-muted-foreground">
          Hangi bildirimleri e-posta, push veya uygulama içinde alacağını
          seçebileceğin tercihler ekranı geliştiriliyor.
        </p>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-5">
      <h3>Security</h3>
      <p className="text-small text-muted-foreground">
        Hesabını Clerk üzerinden yönetiyoruz. Şifre değişikliği, e-posta doğrulama
        ve 2FA için Clerk profil sayfasını kullan.
      </p>

      <div className="space-y-3">
        <a
          href="https://accounts.folkie.com.tr/user"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-light text-primary">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="text-small font-semibold">Hesabımı Yönet</div>
              <div className="text-caption text-muted-foreground">
                Clerk profil sayfasında e-posta, şifre, 2FA yönetimi
              </div>
            </div>
          </div>
          <span className="rounded-full border border-border px-4 py-1.5 text-caption hover:border-primary">
            Aç
          </span>
        </a>
      </div>

      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <h4 className="text-small font-semibold text-destructive">
          Tehlikeli Bölge
        </h4>
        <p className="mt-1 text-caption text-muted-foreground">
          Markayı sil — tüm kampanyalar, başvurular, mesajlar silinecek. Geri
          alınamaz. Hesap silme talebini destek ekibine ileteceksin.
        </p>
        <a
          href="mailto:destek@folkie.com.tr?subject=Marka%20Hesabı%20Silme%20Talebi"
          className="mt-3 inline-flex rounded-full border border-destructive px-4 py-2 text-caption font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Silme Talebi Gönder
        </a>
      </div>
    </div>
  );
}
