# Folkie — Manuel Test Süreci

Her sayfayı sırayla geçmek için checklist. Her test sonucunu işaretle (✅ / ❌).
Bug bulunca: ekran görüntüsü + URL + ne yaptın → `bugs.md`'ye yaz.

---

## 0. Setup Test

| # | Test | Sonuç | Not |
|---|---|---|---|
| 0.1 | Backend ayakta? `curl localhost:5069/healthz` → `{status: "healthy"}` | | |
| 0.2 | Frontend ayakta? `localhost:3000` 200 dönüyor | | |
| 0.3 | Postgres bağlı? Backend logları "db: ok" | | |
| 0.4 | Cloudflared tunnel ayakta? `curl https://your-tunnel.trycloudflare.com/healthz` | | |
| 0.5 | Clerk Webhook çalışıyor? Yeni signup → DB'de `users` satırı | | |

---

## 1. Public Sayfa Testleri (signed-out)

### 1.1 Landing (`/`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1.1.1 | Sayfa yükleniyor, hero görünüyor | | |
| 1.1.2 | Phone mockup mobile'da gizli mi? (sadece floating notification cards desktop'ta) | | |
| 1.1.3 | "Marka olarak başla" → `/register?role=brand` | | |
| 1.1.4 | "Creator olmak istiyorum" → `/register?role=influencer` | | |
| 1.1.5 | Sticky header scroll'da kalıyor | | |
| 1.1.6 | Tüm anchor link'ler scroll yapıyor (#nasil-calisir, #ozellikler, #creator-olmak, #fiyat, #sss) | | |
| 1.1.7 | Social proof bar'daki brand logoları görünüyor | | |
| 1.1.8 | Showcase kartlarındaki Unsplash fotoğrafları yükleniyor | | |
| 1.1.9 | Testimonial bölümünde 2 marka quote'u + avatar görünüyor | | |
| 1.1.10 | Pricing/komisyon bölümü "Abonelik yok" diyor, eski 3-tier yok | | |
| 1.1.11 | FAQ accordion açılıyor / kapanıyor | | |
| 1.1.12 | Final CTA "Ücretsiz Dene" → `/register?role=brand` | | |
| 1.1.13 | Footer link'leri çalışıyor (4 sütun) | | |
| 1.1.14 | Mobile responsive (320px–768px–1024px) | | |

### 1.2 Auth Sayfaları

| # | Test | Sonuç | Not |
|---|---|---|---|
| 1.2.1 | `/login` → Clerk SignIn formu Türkçe açılıyor | | |
| 1.2.2 | `/register` → Clerk SignUp formu Türkçe açılıyor | | |
| 1.2.3 | Sign-up form'unda telefon alanı YOK | | |
| 1.2.4 | E-posta + şifre ile yeni kullanıcı kaydı çalışıyor | | |
| 1.2.5 | E-posta doğrulama kodu geliyor | | |

---

## 2. Onboarding (`/onboarding`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 2.1 | Yeni kullanıcı kayıt sonrası `/onboarding`'e yönleniyor | | |
| 2.2 | "Ben creator'ım" tıkla → role atanıyor → `/creator/profile`'e yönleniyor | | |
| 2.3 | "Markayım" tıkla → marka adı sorulan ekran açılıyor | | |
| 2.4 | Marka adı 2 karakterden az iken "Devam" disabled | | |
| 2.5 | Marka adı yazınca "Devam" tıklanır → `/brand`'ya yönleniyor | | |
| 2.6 | "Geri" butonu role seçim ekranına döner | | |
| 2.7 | DB'de `brand_profiles` veya `influencer_profiles` row'u oluşuyor | | |

---

## 3. Brand Panel Testleri

### 3.1 Brand Dashboard (`/brand`)

**İlk-kullanım (no campaigns):**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.1.1 | "Folkie'ye hoş geldin" hero görünüyor | | |
| 3.1.2 | "İlk Kampanyanı Oluştur" → `/brand/campaigns/new` | | |
| 3.1.3 | "Creator Havuzunu Gör" → `/brand/discover` | | |
| 3.1.4 | 3 step kart (Brief / AI eşleştirir / İçerik onayla) görünüyor | | |
| 3.1.5 | "İpucu" kart link'i `/brand/settings`'a gidiyor | | |

**Normal (with campaigns):**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.1.6 | Hero card + 5'li stats satırı + "Kampanyalarım" listesi görünüyor | | |
| 3.1.7 | "Tümünü gör" → `/brand/campaigns` | | |
| 3.1.8 | Sidebar widget'lar görünüyor (Featured, Performance, Activity, Match callout) | | |
| 3.1.9 | Mobile: sidebar hamburger ile açılıyor | | |

### 3.2 Kampanyalar Listesi (`/brand/campaigns`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.2.1 | Empty state çıkıyor (campaign yoksa) | | |
| 3.2.2 | "İlk Kampanyanı Oluştur" CTA çalışıyor | | |
| 3.2.3 | Tab'lar: Tümü, Aktif, Onay Bekliyor, Taslak, Tamamlanan | | |
| 3.2.4 | Tab tıklandığında URL `?status=...` değişiyor | | |
| 3.2.5 | Sayfa o status'e göre filtreliyor | | |
| 3.2.6 | Tablo (desktop) ve kart (mobile) görünümü doğru | | |
| 3.2.7 | Bir kampanya tıkla → detay sayfası açılıyor | | |
| 3.2.8 | "Yeni Kampanya" CTA çalışıyor | | |

### 3.3 Kampanya Oluşturma Wizard (`/brand/campaigns/new`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.3.1 | 5 adım var: Bilgiler, Brief, Hedef Kitle, Bütçe, Önizleme | | |
| 3.3.2 | İleri / Geri butonları çalışıyor | | |
| 3.3.3 | Adım 1: Başlık, Ürün, Kategori, Teslim seçenekleri görünüyor | | |
| 3.3.4 | Adım 2: Brief textarea, Hashtag input, İçerik türü chips, Ton dropdown | | |
| 3.3.5 | Adım 3: Kategori chips, Şehir chips, Min/Max takipçi | | |
| 3.3.6 | Adım 4: Creator sayısı, Ücret, Tarihler, Flash kampanya toggle | | |
| 3.3.7 | Adım 5: Tüm bilgilerin önizlemesi + Toplam hesabı | | |
| 3.3.8 | Sidebar canlı özet doğru hesaplıyor (ücret + komisyon) | | |
| 3.3.9 | "Taslak olarak kaydet" → POST atılıyor → `/brand/campaigns/{id}`'ye yönlendiriyor | | |
| 3.3.10 | "Onaya Gönder" → POST + submit → status `pending_payment`, brand_payment oluşuyor | | |
| 3.3.11 | Validation hataları kullanıcıya gösteriliyor (eksik alan, vs.) | | |
| 3.3.12 | Mobile: step indicator dots-only, "Adım X/5: ..." başlık görünüyor | | |

### 3.4 Kampanya Detay (`/brand/campaigns/{id}`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.4.1 | 5 metrik kart: Bütçe, Doluluk, Bekleyen başvuru, İçerik teslimi, Yayınlanan | | |
| 3.4.2 | Brief, Tarihler, Bilgiler sidebar widget'ları | | |
| 3.4.3 | Başvurular tablosu — başvuru yoksa empty state çıkıyor | | |
| 3.4.4 | Pending başvuru için Onayla / Reddet butonları görünüyor | | |
| 3.4.5 | "Onayla" tıkla → status approved oluyor, sayfa refresh oluyor | | |
| 3.4.6 | "Reddet" tıkla → reason input açılıyor, gönderilince rejected | | |
| 3.4.7 | Mobile: tablo yerine kart görünümü | | |
| 3.4.8 | 404 ID ile gidersen empty/error sayfa | | |

### 3.5 Creator Keşfet (`/brand/discover`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.5.1 | Sayfa açılıyor, mock creator listesi görünüyor | | |
| 3.5.2 | Tab'lar (Tümü, Sizin İçin, Kaydedilenler, Davetler) görünüyor | | |
| 3.5.3 | Filtre chip'leri (Kategori, Niş, Lokasyon) tıklanabilir | | |
| 3.5.4 | Creator kartında "Profili İncele" butonu var (henüz çalışmıyor — Faz 2) | | |

### 3.6 İş Birlikleri (`/brand/collaborations`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.6.1 | Mock data ile collab listesi görünüyor | | |
| 3.6.2 | Urgent banner görünüyor (acil eylem varsa) | | |
| 3.6.3 | Tab'lar (Tümü, Needs Review, Active, Completed) | | |
| 3.6.4 | Card link'leri kampanya detayına gidiyor | | |

### 3.7 Mesajlar (`/brand/messages`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.7.1 | "Mesajlaşma sahte data" uyarı banner'ı görünüyor | | |
| 3.7.2 | Konuşma listesi (sol) + thread (sağ) | | |
| 3.7.3 | Mobile: konuşma seçince thread açılıyor, geri butonu liste'ye dönüyor | | |
| 3.7.4 | Composer çalışıyor ama kayıt YOK (Sprint 6) | | |

### 3.8 Raporlar (`/brand/reports`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.8.1 | "Raporlar mock data" uyarı banner'ı görünüyor | | |
| 3.8.2 | 4 metrik kart + Reach&Engagement chart | | |
| 3.8.3 | Top creators listesi + campaign performance tablosu | | |
| 3.8.4 | "PDF Export (yakında)" butonu disabled | | |
| 3.8.5 | Empty state — kampanya yoksa "no reports" | | |

### 3.9 Favoriler (`/brand/favorites`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.9.1 | "Favoriler mock data" uyarı banner'ı görünüyor | | |
| 3.9.2 | Creator kartları görünüyor (4 adet) | | |
| 3.9.3 | "Toplu Davet (yakında)" butonu disabled | | |
| 3.9.4 | "Kampanyaya Davet Et (yakında)" disabled | | |

### 3.10 Ayarlar (`/brand/settings`)

**Brand Profile tab:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.10.1 | Profil bilgileri yükleniyor (loading → form) | | |
| 3.10.2 | Tüm input'lar düzenlenebilir | | |
| 3.10.3 | "Kaydet" tıkla → "✓ Kaydedildi" mesajı | | |
| 3.10.4 | Sayfa refresh → değişiklikler kalıyor | | |
| 3.10.5 | Boş marka adı ile "Kaydet" → validation hatası | | |

**Billing:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.10.6 | "Abonelik: Yok ✓" mesajı | | |
| 3.10.7 | Eski "Pro Plan" gösterimi YOK | | |

**Team:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.10.8 | "Üye Davet Et (yakında)" disabled | | |
| 3.10.9 | "Ekip yönetimi mock" uyarı | | |

**Notifications + Privacy + Security:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 3.10.10 | Toggle'lar tıklanabilir (kayıt henüz yok) | | |

---

## 4. Creator Panel Testleri

### 4.1 Creator Dashboard (`/creator`)

**İlk-kullanım:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.1.1 | "Hoş geldin! Profilini tamamla" hero | | |
| 4.1.2 | 3 checklist card: Profil, TikTok, IBAN | | |
| 4.1.3 | "Profilimi Tamamla" → `/creator/profile` | | |
| 4.1.4 | Aktif kampanya varsa "Aktif kampanyalar" listesi görünüyor | | |

**Normal:**

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.1.5 | Hero card + stats + "Aktif İş Birliklerim" + sidebar widget'lar | | |

### 4.2 Kampanya Keşfet (`/creator/campaigns`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.2.1 | Kampanyalar fetch oluyor (404 değil!) | | |
| 4.2.2 | Empty state "Henüz aktif kampanya yok" doğru çalışıyor | | |
| 4.2.3 | Card'larda match score görünüyor | | |
| 4.2.4 | "Eşleşme skorun nasıl hesaplanıyor?" accordion açılıyor | | |
| 4.2.5 | Kampanya tıkla → detay açılıyor | | |

### 4.3 Kampanya Detay (`/creator/campaigns/{id}`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.3.1 | Marka card + brief + detay grid görünüyor | | |
| 4.3.2 | Sticky başvur kartı sağda görünüyor (mobile'da bottom) | | |
| 4.3.3 | "Başvur" butonu çalışıyor | | |
| 4.3.4 | Başvuru sonrası buton "✓ Başvurdun" oluyor | | |
| 4.3.5 | İkinci kez başvuru = hata mesajı | | |
| 4.3.6 | Takipçi sayım kampanya range dışında ise "uygun değil" hatası | | |

### 4.4 İş Birliklerim (`/creator/collaborations`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.4.1 | Empty state çıkıyor (başvuru yoksa) | | |
| 4.4.2 | Başvurular listeleniyor — status badge doğru | | |
| 4.4.3 | "Sıradaki: ..." text doğru | | |
| 4.4.4 | "Detay" butonu kampanya detayına gidiyor | | |

### 4.5 Taslaklarım (`/creator/drafts`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.5.1 | Empty state çıkıyor (submission yoksa) | | |
| 4.5.2 | Submission'lar grid'de görünüyor | | |
| 4.5.3 | Status badge'ler doğru | | |
| 4.5.4 | Approved submission'da "Yayın Linki Gir" butonu çalışıyor | | |
| 4.5.5 | Geçersiz TikTok URL → validation hatası | | |
| 4.5.6 | Geçerli URL → submission published oluyor | | |
| 4.5.7 | Revision request edilen submission'da revision note görünüyor | | |

### 4.6 Kazançlarım (`/creator/earnings`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.6.1 | 4 özet kart görünüyor | | |
| 4.6.2 | Manuel ödeme info notu görünüyor | | |
| 4.6.3 | Ödeme tablosu (mock data) | | |
| 4.6.4 | Mobile: tablo → kart dönüşümü doğru | | |

### 4.7 Profil (`/creator/profile`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.7.1 | Profil bilgileri yükleniyor | | |
| 4.7.2 | Profile completion bar görünüyor | | |
| 4.7.3 | Bio yazılabiliyor, 200 char limit çalışıyor | | |
| 4.7.4 | Şehir dropdown çalışıyor | | |
| 4.7.5 | Kategori chip'leri tıklanabiliyor (max 5) | | |
| 4.7.6 | Dil chip'leri tıklanabiliyor | | |
| 4.7.7 | TikTok bağlı değil → "TikTok'u Bağla (Sprint 5)" + bot detection açıklama | | |
| 4.7.8 | IBAN şifrelenmiş şekilde maskeli görünüyor | | |
| 4.7.9 | Yeni IBAN gir → "Kaydet" → kayıt oluyor (PG'de iban_encrypted güncel) | | |
| 4.7.10 | Eksik kategori ile "Kaydet" disabled | | |

### 4.8 Mesajlar (`/creator/messages`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.8.1 | "Mesajlaşma sahte data" uyarı | | |
| 4.8.2 | UI brand'inkiyle simetrik | | |

### 4.9 Ayarlar (`/creator/settings`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 4.9.1 | 5 tab açılıyor | | |
| 4.9.2 | Account tab'ı e-posta gösteriyor | | |
| 4.9.3 | Notifications toggle'ları tıklanıyor | | |
| 4.9.4 | "Hesabı Sil" tehlikeli kutusu kırmızı görünüyor | | |

---

## 5. Admin Panel Testleri

> Test için Clerk dashboard → Users → publicMetadata `"role": "admin"` yap.

### 5.1 Admin Dashboard (`/admin`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 5.1.1 | 4 stat card: Creator, Marka, Bekleyen Ödeme, Toplam | | |
| 5.1.2 | Quick action kartları çalışıyor | | |
| 5.1.3 | Bekleyen ödeme varsa "urgent" warning rengi | | |

### 5.2 Kullanıcılar (`/admin/users`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 5.2.1 | Tüm user'lar listeleniyor | | |
| 5.2.2 | Role badge'ler doğru renk (creator=lime, brand=violet, admin=red) | | |
| 5.2.3 | "Profil tam" işareti doğru | | |
| 5.2.4 | Mobile: tablo → kart dönüşümü doğru | | |

### 5.3 Ödemeler (`/admin/payments`)

| # | Test | Sonuç | Not |
|---|---|---|---|
| 5.3.1 | Empty state çıkıyor (ödeme yoksa) | | |
| 5.3.2 | IBAN maskeli görünüyor (TR12•••••56) | | |
| 5.3.3 | Pending ödemede "Onayla" butonu çalışıyor | | |
| 5.3.4 | Approved ödemede "Transfer Yap" formu açılıyor | | |
| 5.3.5 | Transfer ref + onayla → status "transferred" oluyor | | |
| 5.3.6 | Mobile responsive | | |

---

## 6. End-to-End Senaryolar

### 6.1 Marka onboarding → kampanya → onay
1. ✅ Yeni email ile kayıt ol
2. ✅ Onboarding'de "Markayım" seç + marka adı yaz
3. ✅ `/brand` aç → boş state görünmeli
4. ✅ Ayarlardan brand profili tamamla
5. ✅ "Yeni Kampanya" → 5 adım doldur → "Onaya Gönder"
6. ✅ Admin olarak `/admin/payments`'e git → marka ödemesini onayla (henüz brand_payment endpoint yok, manuel SQL veya backend logic eksik)
7. ✅ Kampanya status → active

### 6.2 Creator onboarding → başvuru → içerik
1. ✅ Yeni email ile kayıt ol
2. ✅ "Ben creator'ım" seç → otomatik `/creator/profile`
3. ✅ Profili doldur (kategori, şehir, dil)
4. ✅ `/creator/campaigns`'a git → aktif kampanyaları gör
5. ✅ Bir kampanyaya başvur → "✓ Başvurdun"
6. ✅ Marka olarak başvuruyu onayla
7. ✅ Creator: `/creator/collaborations`'de "approved" görünmeli
8. ✅ İçerik yükle (henüz mock — POST /creator/submissions çalışmalı)
9. ✅ Marka onayla → `/creator/drafts`'da "Yayın Linki Gir" çıkar
10. ✅ TikTok URL gir → status "published"

### 6.3 Admin manuel ödeme
1. ✅ Kampanya tamamlandığında admin `/admin/payments`'de bekleyen ödeme görür
2. ✅ "Onayla" tıkla → status "approved"
3. ✅ "Transfer Yap" → ref gir → status "transferred"
4. ✅ Creator'ın `/creator/earnings`'ında ödeme transferred olarak görünmeli (henüz endpoint yok — Sprint 5)

---

## 7. Bilinen Eksikler (Faz 2-3'te gelecek)

| Özellik | Sprint |
|---|---|
| ✅ Mesajlaşma backend (canlı) | Bitti |
| TikTok OAuth + analytics | Sprint 5 |
| TikTok bot/fake follower analysis | Sprint 5 |
| ~~Apple OAuth~~ | Kaldırıldı |
| ✅ Favorites endpoint + add/remove | Bitti (bulk invite hâlâ Sprint 6) |
| Team/multi-user | Sprint 6 |
| PDF Export raporlar | Sprint 6 |
| ✅ Notification email (Resend) | Bitti |
| Real-time SignalR push (notification) | Sprint 6 |
| AI semantic matching (Gemini, key quota'sı bekleniyor) | Aktif olduğunda devreye |
| Contabo Object Storage video upload | Sprint 5 (key bekleniyor) |
| ✅ Hangfire 4 background jobs | Bitti |
| ✅ Creator search endpoint (brand discover) | Bitti |

---

## 8. Bug Raporu Şablonu

```markdown
### Bug #N: [Kısa başlık]

**URL**: /brand/campaigns
**Browser**: Chrome 120
**Adım**:
1. Login as brand
2. Click "Yeni Kampanya"
3. Fill step 1
4. Click "Devam"

**Beklenen**: Step 2 açılmalı
**Gerçekleşen**: Hata 500
**Console log**: [paste]
**Screenshot**: [link]
```
