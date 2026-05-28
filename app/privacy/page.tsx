import Link from "next/link";

export const metadata = { title: "Gizlilik Politikası" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container-folkie max-w-3xl">
        <Link href="/" className="text-small text-primary hover:underline">
          ← Ana sayfa
        </Link>
        <h1 className="mt-6">Gizlilik Politikası</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          Son güncelleme: 12 Mayıs 2026
        </p>

        <div className="mt-8 space-y-6 text-body text-foreground/80">
          <section>
            <h2 className="text-h3">1. Hangi Verileri Topluyoruz?</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>
                <strong>Hesap bilgileri:</strong> e-posta, ad soyad, şifre
                (Clerk üzerinden, biz şifreyi görmeyiz)
              </li>
              <li>
                <strong>Profil bilgileri:</strong> creator/brand profil
                detayları, kategoriler, şehir, bio
              </li>
              <li>
                <strong>TikTok bilgileri:</strong> handle, takipçi sayısı,
                etkileşim oranı (TikTok OAuth ile siz onaylarsanız)
              </li>
              <li>
                <strong>Ödeme bilgileri:</strong> IBAN — şifreli olarak
                saklanır (ASP.NET Data Protection API)
              </li>
              <li>
                <strong>Kullanım verileri:</strong> sayfa ziyaretleri,
                kampanya başvuruları, mesajlar
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">2. Verileri Nasıl Kullanırız?</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>Hesap işlemleri ve oturum yönetimi (Clerk)</li>
              <li>Marka-creator eşleştirmesi (AI algoritması)</li>
              <li>Kampanya başvuru, içerik teslimi, ödeme akışı</li>
              <li>İki taraf arasında doğrudan mesajlaşma</li>
              <li>
                Sahte takipçi tespiti — yalnızca eşleştirme için, profilinde
                gizli
              </li>
              <li>İstatistik ve raporlama (anonimleştirilmiş)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">3. Verileri Kimlerle Paylaşırız?</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>
                <strong>Markalar ↔ creator'lar:</strong> kampanya bağlamında
                profil bilgileri (handle, takipçi, kategoriler) görünür
              </li>
              <li>
                <strong>Clerk:</strong> kimlik doğrulama servisimiz (ABD'de host
                edilir, GDPR uyumlu)
              </li>
              <li>
                <strong>Cloudflare R2:</strong> video ve görsel depolama
              </li>
              <li>
                <strong>Resend:</strong> transactional e-posta gönderimi
              </li>
              <li>
                <strong>Google Gemini API:</strong> sadece anonimleştirilmiş
                bio + kampanya brief metni (kişi adı yok)
              </li>
              <li>
                <strong>Vergi dairesi / yasal merciler:</strong> ödeme
                kayıtları, talep gelirse
              </li>
            </ul>
            <p className="mt-3 text-small">
              Verilerinizi <strong>hiçbir şekilde reklam veya 3. parti
              pazarlama amacıyla satmayız</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-h3">4. Saklama Süresi</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>Aktif hesap: süresiz</li>
              <li>Hesap silindikten sonra: 30 gün (geri yükleme süresi)</li>
              <li>
                Ödeme kayıtları: 10 yıl (Türkiye Vergi Usul Kanunu gereği)
              </li>
              <li>Mesajlaşma: hesap silinene kadar</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">5. Haklarınız (KVKK Md. 11)</h2>
            <p className="mt-3 text-small">
              KVKK kapsamında şu haklara sahipsin:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 text-small">
              <li>Verilerinin işlenip işlenmediğini öğrenme</li>
              <li>Verilerine erişim talep etme (export)</li>
              <li>Yanlış verilerini düzelttirme</li>
              <li>Verilerini sildirme (unutulma hakkı)</li>
              <li>Verilerinin işlenmesine itiraz etme</li>
              <li>Otomatik karar verme süreçlerine itiraz (AI eşleştirmesi)</li>
            </ul>
            <p className="mt-3 text-small">
              Talep için:{" "}
              <a
                href="mailto:kvkk@folkie.com"
                className="font-semibold text-primary hover:underline"
              >
                kvkk@folkie.com
              </a>
              . 30 gün içinde geri döneriz.
            </p>
          </section>

          <section>
            <h2 className="text-h3">6. Çerezler (Cookies)</h2>
            <p className="mt-3 text-small">
              Sadece <strong>zorunlu çerezler</strong> kullanıyoruz: oturum
              cookie (Clerk), tercih cookie (dil). Reklam veya analitik
              çerezi yok.
            </p>
          </section>

          <section>
            <h2 className="text-h3">7. Çocukların Gizliliği</h2>
            <p className="mt-3 text-small">
              Folkie 18 yaş altı kullanıcılara hizmet vermez. Eğer 18 yaşının
              altında olduğunu fark edersek hesabı sileriz.
            </p>
          </section>

          <section>
            <h2 className="text-h3">8. İletişim</h2>
            <p className="mt-3 text-small">
              Folkie Teknoloji A.Ş.
              <br />
              [Vergi numarası gelecek]
              <br />
              <a
                href="mailto:destek@folkie.com"
                className="text-primary hover:underline"
              >
                destek@folkie.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
