"use client";

import { useState } from "react";
import { User, Bell, ShieldCheck, Languages, Lock } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "account",  label: "Account",       icon: User },
  { key: "notif",    label: "Notifications", icon: Bell },
  { key: "privacy",  label: "Privacy",       icon: ShieldCheck },
  { key: "language", label: "Language",      icon: Languages },
  { key: "security", label: "Security",      icon: Lock },
] as const;

export default function CreatorSettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("account");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Hesap, bildirim, gizlilik tercihlerin."
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
          {tab === "account" && <AccountSection />}
          {tab === "notif" && <NotifSection />}
          {tab === "privacy" && <PrivacySection />}
          {tab === "language" && <LanguageSection />}
          {tab === "security" && <SecuritySection />}
        </section>
      </div>
    </div>
  );
}

function AccountSection() {
  const { user, isLoaded } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "—";

  return (
    <div className="space-y-5">
      <h3>Hesap</h3>
      <p className="text-small text-muted-foreground">
        Profil bilgileri için{" "}
        <a href="/creator/profile" className="text-primary underline">
          Profilim
        </a>{" "}
        sayfasını kullan.
      </p>

      <div className="rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-small font-semibold">E-posta adresi</div>
            <div className="truncate text-caption text-muted-foreground">
              {isLoaded ? email : "Yükleniyor..."}
            </div>
          </div>
          <a
            href="https://accounts.folkie.com.tr/user"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-border px-3 py-1.5 text-caption hover:border-primary"
          >
            Clerk'te Değiştir
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
        <h4 className="text-small font-semibold text-destructive">
          Hesabı Sil
        </h4>
        <p className="mt-1 text-caption text-muted-foreground">
          Tüm verilerin, kampanya geçmişin, kazançların kaybolur. Bekleyen
          ödemen yoksa silinir. Silme talebini destek ekibine iletmelisin.
        </p>
        <a
          href="mailto:destek@folkie.com.tr?subject=Creator%20Hesabı%20Silme%20Talebi"
          className="mt-3 inline-flex rounded-full border border-destructive px-4 py-2 text-caption font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          Silme Talebi Gönder
        </a>
      </div>
    </div>
  );
}

function NotifSection() {
  return (
    <div className="space-y-5">
      <h3>Bildirimler</h3>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-small">
        <p className="font-semibold text-primary">
          Tüm önemli bildirimler aktif
        </p>
        <p className="mt-1 text-foreground/70">
          Başvuru sonuçları, içerik revizyonu, ödeme bildirimi ve mesajlar için
          hem e-posta hem uygulama bildirimi alıyorsun. Sağ üst köşedeki zil
          ikonundan tüm bildirimleri görebilirsin.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-small font-semibold">
          Kişiselleştirilmiş tercihler yakında
        </p>
        <p className="mx-auto mt-1 max-w-md text-caption text-muted-foreground">
          Bildirim türü bazında e-posta / push tercihi yapılabilecek ayarlar
          ekranı geliştiriliyor.
        </p>
      </div>
    </div>
  );
}

function PrivacySection() {
  return (
    <div className="space-y-5">
      <h3>Gizlilik</h3>

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-small">
        <p className="font-semibold text-primary">Profilin keşfedilebilir</p>
        <p className="mt-1 text-foreground/70">
          Profil bilgilerin ve istatistiklerin (takipçi sayısı, etkileşim oranı)
          markaların Creator Keşfet sayfasında görünür. Kampanyalara
          başvurabilmen için bu gerekli.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-3 text-small font-semibold">
          Gizlilik tercihleri yakında
        </p>
        <p className="mx-auto mt-1 max-w-md text-caption text-muted-foreground">
          Profil görünürlüğü, istatistik gizleme, aktivite gizliliği gibi
          detaylı tercihler geliştiriliyor.
        </p>
      </div>
    </div>
  );
}

function LanguageSection() {
  return (
    <div className="space-y-5">
      <h3>Language</h3>
      <p className="text-small text-muted-foreground">
        Uygulama dilini seç. Marka brifleri ve mesajlar orijinal dilinde kalır.
      </p>

      <div className="space-y-2">
        {[
          { code: "tr", label: "Türkçe", active: true },
          { code: "en", label: "English", active: false },
        ].map((l) => (
          <label
            key={l.code}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-2xl border-2 bg-background p-4 transition-colors",
              l.active ? "border-primary bg-primary-light" : "border-border hover:border-primary/40",
            )}
          >
            <div className="flex items-center gap-3">
              <input type="radio" name="lang" defaultChecked={l.active} className="h-4 w-4 accent-primary" />
              <span className="text-small font-semibold">{l.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-5">
      <h3>Güvenlik</h3>
      <p className="text-small text-muted-foreground">
        Şifre, 2FA, oturum yönetimi Clerk üzerinden yapılır.
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
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <div className="text-small font-semibold">Clerk Profil</div>
              <div className="text-caption text-muted-foreground">
                Şifre, 2FA, oturum yönetimi
              </div>
            </div>
          </div>
          <span className="rounded-full border border-border px-4 py-1.5 text-caption">
            Aç
          </span>
        </a>
      </div>
    </div>
  );
}
