import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni — Folkie",
  description:
    "6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında Folkie kullanıcılarına yönelik aydınlatma metni: hangi veriler işlenir, neden, ne kadar süre saklanır.",
  alternates: { canonical: "https://folkie.com.tr/kvkk" },
  robots: { index: true, follow: true },
};

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="container-folkie py-16 lg:py-24">
        <article className="mx-auto max-w-3xl prose-folkie">
          <Link href="/" className="text-small text-muted-foreground hover:text-primary">
            ← Ana sayfa
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-light">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-h1">KVKK Aydınlatma Metni</h1>
          </div>

          <p className="mt-2 text-caption text-muted-foreground">
            Son güncelleme: 14 Mayıs 2026
          </p>

          <div className="mt-8 space-y-6 text-small leading-relaxed text-foreground/80">
            <section>
              <h2 className="text-h3 text-foreground">1. Veri Sorumlusu</h2>
              <p className="mt-2">
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;)
                kapsamında veri sorumlusu sıfatıyla Folkie (&quot;Folkie&quot; veya
                &quot;şirket&quot;), kullanıcılarımızın kişisel verilerinin işlenmesi
                konusunda aşağıdaki şekilde aydınlatma yapmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">2. İşlenen Kişisel Veriler</h2>
              <p className="mt-2">
                Aşağıdaki kişisel veriler, hizmetlerimizi sağlamak amacıyla
                işlenmektedir:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>
                  <strong>Kimlik bilgileri:</strong> ad, soyad, e-posta adresi
                </li>
                <li>
                  <strong>Marka bilgileri (markalar için):</strong> şirket adı,
                  vergi kimlik numarası, iletişim bilgileri, fatura adresi
                </li>
                <li>
                  <strong>Creator profil bilgileri (creator&apos;lar için):</strong>{" "}
                  TikTok kullanıcı adı, takipçi sayısı, etkileşim oranı, içerik
                  kategorileri, şehir, biyografi
                </li>
                <li>
                  <strong>Ödeme bilgileri (creator&apos;lar için):</strong> IBAN ve
                  IBAN sahibinin adı (şifrelenmiş olarak saklanır)
                </li>
                <li>
                  <strong>Kullanım verileri:</strong> giriş zamanları, kampanya
                  başvuruları, içerik teslimleri, mesajlar
                </li>
                <li>
                  <strong>Teknik veriler:</strong> IP adresi, tarayıcı bilgisi, log
                  kayıtları
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">3. İşleme Amaçları</h2>
              <p className="mt-2">Kişisel verileriniz aşağıdaki amaçlarla işlenir:</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Folkie pazaryeri hizmetlerinin sunulması</li>
                <li>Marka–creator eşleşmelerinin yapılması</li>
                <li>Sözleşmesel yükümlülüklerin yerine getirilmesi</li>
                <li>Ödeme transferlerinin gerçekleştirilmesi</li>
                <li>
                  Kullanıcılara bilgilendirme ve bildirim (e-posta, uygulama içi
                  bildirim) gönderilmesi
                </li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Platform güvenliğinin sağlanması, fraud önlenmesi</li>
                <li>Hizmet kalitesinin artırılması ve istatistiksel analiz</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">
                4. Hukuki Sebep ve Yöntem
              </h2>
              <p className="mt-2">
                Kişisel verileriniz; sözleşmenin kurulması ve ifası, hukuki
                yükümlülüklerin yerine getirilmesi ve meşru menfaat hukuki sebeplerine
                dayanılarak, elektronik ortamda otomatik yollarla işlenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">5. Veri Aktarımı</h2>
              <p className="mt-2">
                Kişisel verileriniz, hizmetin sunulması için zorunlu olan üçüncü
                taraf hizmet sağlayıcılarla (Clerk — kimlik doğrulama, Resend —
                e-posta gönderimi, Contabo — sunucu barındırma) paylaşılır. Bu
                aktarımlar veri koruma sözleşmeleri ile güvence altına alınmıştır.
                Yurt dışına veri aktarımı, KVKK Madde 9 kapsamında açık rızanız veya
                yeterli koruma sağlayan ülkelere yapılır.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">6. Saklama Süresi</h2>
              <p className="mt-2">
                Kişisel verileriniz, ilgili yasal saklama süreleri boyunca (en az 5
                yıl, vergi ve ticaret kanunları gereği 10 yıla kadar) saklanır.
                Hesabınızı sildiğinizde, yasal saklama yükümlülüğü dışındaki veriler
                30 gün içinde anonim hale getirilir veya silinir.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">
                7. Veri Sahibinin Hakları (KVKK Madde 11)
              </h2>
              <p className="mt-2">
                Veri sahibi olarak şu haklara sahipsiniz:
              </p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenen veriler hakkında bilgi talep etme</li>
                <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içi/yurt dışı aktarım hakkında bilgi alma</li>
                <li>Eksik veya yanlış işlenen verilerin düzeltilmesini isteme</li>
                <li>Verilerinizin silinmesini veya yok edilmesini talep etme</li>
                <li>Otomatik analize itiraz etme</li>
                <li>Hukuka aykırı işleme sonucu zarara uğramanız halinde tazminat</li>
              </ul>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">8. Başvuru Yöntemi</h2>
              <p className="mt-2">
                Yukarıdaki haklarınızı kullanmak için{" "}
                <a
                  href="mailto:kvkk@folkie.com.tr"
                  className="text-primary hover:underline"
                >
                  kvkk@folkie.com.tr
                </a>{" "}
                adresine kimlik bilgilerinizle birlikte talebinizi içeren bir e-posta
                gönderebilirsiniz. Başvurunuza en geç 30 gün içinde yanıt verilir.
              </p>
            </section>

            <section>
              <h2 className="text-h3 text-foreground">9. Değişiklikler</h2>
              <p className="mt-2">
                Bu aydınlatma metni gerektiğinde güncellenebilir. Güncellenmiş metin
                bu sayfada yayımlanır. Yapılan değişiklikler bu sayfada yayımlandığı
                tarihte yürürlüğe girer.
              </p>
            </section>
          </div>
        </article>
      </section>
    </main>
  );
}
