import Link from "next/link";

export const metadata = { title: "Kullanım Koşulları" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container-folkie max-w-3xl">
        <Link href="/" className="text-small text-primary hover:underline">
          ← Ana sayfa
        </Link>
        <h1 className="mt-6">Kullanım Koşulları</h1>
        <p className="mt-2 text-caption text-muted-foreground">
          Son güncelleme: 12 Mayıs 2026
        </p>

        <div className="mt-8 space-y-6 text-body text-foreground/80">
          <section>
            <h2 className="text-h3">1. Folkie Nedir?</h2>
            <p className="mt-3 text-small">
              Folkie, markaları nano TikTok creator'larıyla buluşturan B2B
              pazar yeridir. Folkie, taraflar arasında aracılık eder ve
              kampanya ödemelerini yönetir.
            </p>
          </section>

          <section>
            <h2 className="text-h3">2. Hesap Açma</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>18 yaş ve üzeri olmalısın</li>
              <li>Doğru ve güncel bilgi sağlamalısın</li>
              <li>Tek hesap açabilirsin (creator veya marka)</li>
              <li>Bot, sahte hesap, ödeme kaçakçılığı yasak</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">3. Komisyon</h2>
            <p className="mt-3 text-small">
              Folkie, <strong>tamamlanan kampanyalardan %15 komisyon</strong>{" "}
              alır. Abonelik veya başka ücret yoktur. Komisyon kampanya
              başlangıcında brand tarafından Folkie'ye ödenir.
            </p>
          </section>

          <section>
            <h2 className="text-h3">4. Ödeme Akışı</h2>
            <ol className="mt-3 list-inside list-decimal space-y-1 text-small">
              <li>Marka kampanya bütçesini Folkie banka hesabına yatırır</li>
              <li>Admin dekont onayı verir → kampanya aktif olur</li>
              <li>Creator'lar başvurur, marka onaylar</li>
              <li>İçerikler yayınlanır</li>
              <li>
                Kampanya tamamlanınca admin creator'lara IBAN üzerinden manuel
                transfer yapar (5 iş günü içinde)
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-h3">5. İçerik ve Telif Hakları</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>
                Creator'lar yarattığı içeriklerin sahibidir, marka 1 yıl
                kullanım hakkı alır
              </li>
              <li>
                Marka, brief'in dışına çıkan veya KVKK ihlali içeren içeriği
                onaylamayabilir
              </li>
              <li>
                Folkie, kampanya geçmişi için içerikleri tutar (analitik amaçlı)
              </li>
              <li>3. parti telif hakkı ihlali yasak</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">6. Yasak Davranışlar</h2>
            <ul className="mt-3 list-inside list-disc space-y-1 text-small">
              <li>Sahte takipçi (algılayıp hesabı askıya alırız)</li>
              <li>Yanıltıcı reklam, açıkça hakaret içeren içerik</li>
              <li>Folkie dışı doğrudan iletişim ile komisyondan kaçmak</li>
              <li>Çoklu hesap açmak</li>
              <li>Diğer kullanıcılara taciz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-h3">7. Hesap Askıya Alma ve Silme</h2>
            <p className="mt-3 text-small">
              Folkie, kuralları ihlal eden hesapları askıya alabilir veya
              silebilir. Sahte takipçi tespit edilirse otomatik askıya alma
              olur. İtiraz için destek@folkie.com.
            </p>
          </section>

          <section>
            <h2 className="text-h3">8. Sorumluluk Sınırı</h2>
            <p className="mt-3 text-small">
              Folkie, marka ve creator arasındaki içerik kalitesinden, marka
              memnuniyetinden veya TikTok platform değişikliklerinden sorumlu
              değildir. Folkie yalnızca aracılık ve ödeme akışı garantisi
              sağlar.
            </p>
          </section>

          <section>
            <h2 className="text-h3">9. Uyuşmazlık</h2>
            <p className="mt-3 text-small">
              İstanbul Mahkemeleri ve İcra Daireleri yetkilidir. Türk Hukuku
              uygulanır.
            </p>
          </section>

          <section>
            <h2 className="text-h3">10. Değişiklikler</h2>
            <p className="mt-3 text-small">
              Folkie bu koşulları zaman zaman güncelleyebilir. Önemli
              değişiklikler için e-posta bildirimi yaparız. Devam ederek yeni
              koşulları kabul etmiş sayılırsın.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
