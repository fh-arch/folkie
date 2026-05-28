import Link from "next/link";
import type { Metadata } from "next";
import { Cookie } from "lucide-react";

export const metadata: Metadata = {
  title: "Çerez Politikası — Folkie",
  description:
    "Folkie web sitesinde hangi çerezler (cookie) kullanılır, ne için kullanılır, nasıl yönetebilirsiniz.",
  alternates: { canonical: "https://folkie.com.tr/cookie-policy" },
  robots: { index: true, follow: true },
};

export default function CookiePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <article className="mx-auto max-w-3xl">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Ana sayfa
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-h1">Çerez Politikası</h1>
          </div>

          <p className="mt-2 text-caption text-muted-foreground">
            Son güncelleme: 14 Mayıs 2026
          </p>

          <div className="mt-8 space-y-6 text-small leading-relaxed text-foreground/80">
            <section>
              <h2 className="text-h3 text-foreground">Çerez nedir?</h2>
              <p className="mt-2">
                Çerezler, web sitesini ziyaret ettiğinizde tarayıcınız tarafından
                bilgisayarınıza veya cihazınıza kaydedilen küçük metin dosyalarıdır.
                Folkie, kullanıcı deneyimini geliştirmek ve hizmetlerini sunabilmek
                için çerezleri kullanır.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">Kullandığımız çerezler</h2>

              <div className="mt-4 rounded-2xl border border-border bg-background p-5">
                <h3 className="text-body font-semibold">Zorunlu çerezler</h3>
                <p className="mt-1 text-caption text-muted-foreground">
                  Site fonksiyonelliği için gerekli. Devre dışı bırakılamaz.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>
                    <strong>__session</strong> (Clerk): Oturum yönetimi
                  </li>
                  <li>
                    <strong>__client_uat</strong> (Clerk): Kimlik doğrulama
                  </li>
                  <li>
                    <strong>folkie-prefs</strong>: Kullanıcı tercih ayarları
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-background p-5">
                <h3 className="text-body font-semibold">İşlevsel çerezler</h3>
                <p className="mt-1 text-caption text-muted-foreground">
                  Tercihlerinizi hatırlamak için.
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  <li>
                    <strong>theme</strong>: Tema tercihi (light/dark)
                  </li>
                  <li>
                    <strong>locale</strong>: Dil tercihi
                  </li>
                </ul>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-background p-5">
                <h3 className="text-body font-semibold">Analitik çerezler (opsiyonel)</h3>
                <p className="mt-1 text-caption text-muted-foreground">
                  Site kullanımını anlamak için (şu an aktif değil; eklendiğinde
                  rıza istenecek).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">Çerezleri yönetme</h2>
              <p className="mt-2">
                Çerezleri tarayıcınız üzerinden yönetebilirsiniz:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler
                </li>
                <li>
                  <strong>Safari:</strong> Tercihler → Gizlilik → Çerezler
                </li>
                <li>
                  <strong>Firefox:</strong> Ayarlar → Gizlilik ve güvenlik
                </li>
              </ul>
              <p className="mt-3">
                Zorunlu çerezleri devre dışı bırakırsanız sitenin bazı özellikleri
                çalışmaz (örn. giriş yapamazsınız).
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">Üçüncü taraf çerezler</h2>
              <p className="mt-2">
                Folkie&apos;de yalnızca Clerk (kimlik doğrulama) üçüncü taraf çerezleri
                kullanılır. Google Analytics, Facebook Pixel veya reklam takip
                çerezleri kullanmıyoruz.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">İletişim</h2>
              <p className="mt-2">
                Çerez politikamız hakkında sorularınız için:{" "}
                <a
                  href="mailto:kvkk@folkie.com.tr"
                  className="text-primary hover:underline"
                >
                  kvkk@folkie.com.tr
                </a>
              </p>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
