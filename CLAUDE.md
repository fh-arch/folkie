# FOLKIE — Claude Code Geliştirme Rehberi

> Bu dosya, Claude Code'un Folkie projesini anlaması ve doğru kararlar alması için kapsamlı bağlam sağlar.
> Her oturumda bu dosyayı oku. Mimari ve ürün kararları burada belgelidir.

---

## 📌 Proje Özeti

**Folkie**, markaları nano ve mikro **creator**'larla TikTok üzerinden buluşturan iki taraflı bir B2B SaaS pazar yeri platformudur.
Marka mesajı: **"Doğru creator'larla gerçek etki."**

### Temel Değer Önerisi
- **Markalar** → kampanya oluşturur, creator havuzundan AI eşleşme alır, hepsini tek panelden yönetir
- **Creator'lar** → kategorilerine uygun kampanyalara başvurur (iş birliği), güvenli ödeme alır, büyür
- **Flash Kampanya** → binlerce creator aynı anda yayın yapar; viral etki katlanır

### Nano Creator Önceliği ⭐
Folkie'nin en önemli farklılaştırıcısı nano creator'lara odaklanmaktır:
- **Nano:** 1.000 – 10.000 takipçi (platform'un öncelikli odağı)
- **Mikro:** 10.000 – 100.000 takipçi
- **Mid-tier:** 100.000 – 500.000 takipçi (opsiyonel)

Nano creator'lar daha yüksek güven, daha düşük maliyet ve daha gerçek etkileşim sunar. Markalar bu kitleye Folkie olmadan hiç ulaşamıyor — bu boşluk Folkie'nin core değeridir.

---

## 🛠️ Teknoloji Stack'i (v2 — .NET Backend)

| Katman | Teknoloji | Notlar |
|--------|-----------|--------|
| Frontend | **Next.js 14** (App Router) | TypeScript zorunlu, Vercel Hobby (bedava) |
| Styling | **Tailwind CSS** + shadcn/ui | Özel tema: mor (#6C3FC5), Inter font |
| Backend | **ASP.NET Core 8** | Clean Architecture (Api/App/Domain/Infra) |
| Backend hosting | **Contabo VPS M** (€8.50/ay) | 6 vCPU, 16 GB RAM, Docker + Caddy |
| Database | **Supabase Free** (sadece DB) | PostgreSQL connection string ile, EF Core 8 |
| ORM | **Entity Framework Core 8** + Npgsql | Migration'lar EF tarafında |
| Auth | **Clerk Free** (10K MAU bedava) | TikTok Custom OAuth Provider üzerinden |
| TikTok | **TikTok Login API** (Clerk üzerinden) | Login Clerk'ten, metrikler Faz 2'de Business API |
| E-posta | **Resend Free** (3K e-posta/ay) | Bildirimler ve onay e-postaları |
| Dosya Depolama | **Contabo Object Storage** (S3 uyumlu, Contabo VPS ile aynı sağlayıcı) | AWS S3 SDK ile, presigned PUT, force path-style |
| Realtime | **SignalR** | .NET native — flash kampanya + bildirim push |
| Background jobs | **Hangfire** + PostgreSQL storage | Admin dashboard mount, manuel ödeme akışı |
| Logging | **Serilog + Seq Community** (Docker) | Self-hosted, bedava 1 user |
| Error tracking | **Sentry Free** (5K event/ay) | Frontend + backend |
| CI/CD | **GitHub Actions Free** (2K dk/ay) | Build → Docker push → SSH deploy |
| Validation | **FluentValidation** (.NET) + **Zod** (Next.js) | Backend + frontend ayrı |
| API docs | **Swagger / OpenAPI** | NSwag ile typed TS client üretilir |
| Analytics | **Mixpanel** veya **PostHog** | Ürün analitiği (Faz 2) |
| AI | **OpenAI API** (gpt-4o-mini) | Brief oluşturucu, eşleştirme skoru (Faz 2) |

**Toplam aylık maliyet:** ~€8.50 (~$9) — sadece Contabo VPS + opsiyonel domain.

### Ödeme Sistemi — MANUEL ✋
Türkiye'de escrow sistemi uygulanabilir değildir. Folkie'nin ödeme akışı manuel banka transferi üzerine kuruludur:

1. Marka kampanya başlangıcında bütçeyi Folkie banka hesabına havale eder
2. Admin panelinde ödeme "onaylandı" olarak işaretlenir
3. Kampanya tamamlandıktan sonra admin, influencer'lara IBAN üzerinden manuel transfer yapar
4. Admin panelinde transfer "tamamlandı" olarak işaretlenir; influencer bildirim alır
5. Fatura/makbuz: influencer platform üzerinden indirir

> ⚠️ Otomatik ödeme tetikleme yok. Tüm ödeme adımları admin tarafından manuel onaylanır.

---

## 📁 Proje Yapısı (v2 — iki sibling klasör)

```
~/Desktop/
├── folkie_web/                   # Next.js 14 frontend
│   ├── app/                      # App Router
│   │   ├── giris/                # Clerk SignIn (catch-all)
│   │   ├── kayit/                # Clerk SignUp (catch-all)
│   │   ├── onboarding/           # Role seçimi + profil oluşturma
│   │   ├── dashboard/            # Role'e göre router (redirect)
│   │   ├── influencer/           # Influencer paneli (rol guard'lı)
│   │   │   ├── kampanyalar/
│   │   │   ├── basvurular/
│   │   │   └── kazanc/
│   │   ├── marka/                # Marka paneli (rol guard'lı)
│   │   │   ├── kampanyalar/
│   │   │   ├── influencerlar/
│   │   │   └── raporlar/
│   │   ├── admin/                # Admin paneli (rol guard'lı)
│   │   │   ├── kullanicilar/
│   │   │   ├── kampanyalar/
│   │   │   └── odemeler/
│   │   └── api/                  # Sadece webhook proxy'leri (gerekirse)
│   ├── components/
│   │   ├── ui/                   # shadcn/ui bileşenleri
│   │   ├── influencer/
│   │   ├── brand/
│   │   ├── admin/
│   │   └── shared/
│   ├── lib/
│   │   ├── api/                  # Folkie API typed client
│   │   │   ├── client.ts         # apiFetch / apiFetchBrowser
│   │   │   ├── endpoints.ts      # Endpoint sabitleri
│   │   │   └── schema.ts         # NSwag ile üretilir
│   │   ├── clerk/                # Clerk yardımcıları (locale, role, tema)
│   │   ├── constants.ts          # Kategoriler, şehirler, label'lar
│   │   └── utils.ts              # cn(), formatTRY, vb.
│   ├── types/
│   │   ├── api.ts                # Backend DTO tipleri
│   │   └── index.ts
│   ├── docs/
│   │   └── ARCHITECTURE.md       # Mimari plan
│   ├── middleware.ts             # Clerk route protection
│   └── package.json
│
└── folkie_api/                   # ASP.NET Core 8 backend
    ├── src/
    │   ├── Folkie.Api/           # Web API host
    │   │   ├── Endpoints/        # Minimal API veya Controllers
    │   │   ├── Webhooks/         # ClerkWebhookHandler
    │   │   ├── Hubs/             # SignalR (NotificationsHub)
    │   │   ├── Middleware/       # ExceptionHandling, JwtValidation
    │   │   ├── appsettings.json
    │   │   └── Program.cs
    │   ├── Folkie.Application/   # CQRS (MediatR), validation
    │   │   ├── Influencer/
    │   │   ├── Brand/
    │   │   ├── Admin/
    │   │   ├── Common/Interfaces/  # IClock, IIbanProtector, IFileStorage
    │   │   └── Behaviors/          # ValidationBehavior, LoggingBehavior
    │   ├── Folkie.Domain/        # Entities, value objects, enums
    │   │   ├── Users/
    │   │   ├── Campaigns/
    │   │   ├── Payments/
    │   │   └── Common/
    │   └── Folkie.Infrastructure/  # EF Core, dış servisler
    │       ├── Persistence/        # FolkieDbContext, Migrations/, Configurations/
    │       ├── Clerk/              # ClerkClient, JwtValidator, WebhookVerifier
    │       ├── Storage/            # ContaboStorage (AWS SDK S3, force path-style)
    │       ├── Email/              # ResendEmailSender
    │       ├── BackgroundJobs/     # Hangfire job'ları
    │       ├── Security/           # IbanProtector (Data Protection)
    │       └── DependencyInjection.cs
    ├── tests/
    │   ├── Folkie.Application.Tests/
    │   └── Folkie.Api.IntegrationTests/
    ├── docker-compose.yml          # Local: postgres + seq + api
    ├── Dockerfile                  # Production multi-stage build
    ├── .github/workflows/deploy.yml  # CI/CD
    └── Folkie.sln
```

> Detaylı mimari: `folkie_web/docs/ARCHITECTURE.md`

---

## 🗄️ Veritabanı Şeması

### Temel Tablolar

```sql
-- Kullanıcılar (Supabase Auth ile senkron)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('influencer', 'brand', 'admin')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Influencer Profilleri
CREATE TABLE influencer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  tiktok_handle TEXT UNIQUE,
  tiktok_user_id TEXT UNIQUE,
  follower_count INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,  -- yüzde olarak
  tier TEXT GENERATED ALWAYS AS (
    CASE
      WHEN follower_count < 10000 THEN 'nano'
      WHEN follower_count < 100000 THEN 'micro'
      ELSE 'mid_tier'
    END
  ) STORED,
  city TEXT,
  country TEXT DEFAULT 'TR',
  content_language TEXT[] DEFAULT ARRAY['tr'],
  categories TEXT[],                        -- Ana kategoriler
  subcategories TEXT[],
  bio TEXT,
  iban TEXT,                                -- Şifreli saklama
  iban_name TEXT,                           -- IBAN sahibi ad-soyad
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  fake_follower_score DECIMAL(5,2),         -- Düşük = iyi
  last_tiktok_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marka Profilleri
CREATE TABLE brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  tax_id TEXT,
  industry TEXT,
  website TEXT,
  logo_url TEXT,
  contact_name TEXT,
  contact_phone TEXT,
  billing_address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kampanyalar
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES brand_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  brief TEXT NOT NULL,                      -- Rich text / Markdown
  required_hashtags TEXT[],
  content_type TEXT[] DEFAULT ARRAY['video'], -- video, live, stitch, duet
  tone TEXT,                                -- eğlenceli, samimi, profesyonel, komik, duygusal
  target_categories TEXT[],
  target_cities TEXT[],                     -- Boşsa tüm Türkiye
  content_language TEXT[] DEFAULT ARRAY['tr'],
  min_followers INTEGER DEFAULT 1000,
  max_followers INTEGER DEFAULT 10000,
  influencer_count INTEGER NOT NULL,
  budget_per_influencer DECIMAL(10,2) NOT NULL,  -- TL
  platform_fee_rate DECIMAL(5,2) DEFAULT 15.00,  -- %15
  total_budget DECIMAL(10,2) GENERATED ALWAYS AS (
    influencer_count * budget_per_influencer
  ) STORED,
  product_delivery TEXT CHECK (product_delivery IN ('physical', 'digital', 'none')),
  approval_mode TEXT DEFAULT 'manual' CHECK (approval_mode IN ('auto', 'manual')),
  application_deadline DATE NOT NULL,
  publish_start_date DATE NOT NULL,
  publish_end_date DATE NOT NULL,
  is_flash_campaign BOOLEAN DEFAULT FALSE,  -- Eş zamanlı yayın
  flash_publish_time TIME,                  -- Flash kampanya saati
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'pending_payment', 'active', 'applications_closed',
    'in_progress', 'completed', 'cancelled'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kampanya Başvuruları
CREATE TABLE campaign_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  influencer_id UUID REFERENCES influencer_profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'rejected', 'withdrawn'
  )),
  rejection_reason TEXT,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  UNIQUE(campaign_id, influencer_id)
);

-- İçerik Taslakları
CREATE TABLE content_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES campaign_applications(id) ON DELETE CASCADE,
  video_url TEXT,                           -- Supabase Storage URL
  external_video_url TEXT,                  -- TikTok linki (yayın sonrası)
  script TEXT,
  hashtags TEXT[],
  status TEXT DEFAULT 'submitted' CHECK (status IN (
    'submitted', 'revision_requested', 'approved', 'published'
  )),
  revision_note TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);

-- Ödemeler (Manuel Sistem)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  influencer_id UUID REFERENCES influencer_profiles(id),
  amount DECIMAL(10,2) NOT NULL,            -- TL
  payment_type TEXT DEFAULT 'base' CHECK (payment_type IN (
    'base', 'performance_bonus', 'viral_bonus', 'refund'
  )),
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'approved', 'transferred', 'failed'
  )),
  iban TEXT NOT NULL,
  iban_name TEXT NOT NULL,
  admin_note TEXT,
  transfer_reference TEXT,                  -- Banka transfer referansı
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMPTZ,
  transferred_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marka Ödemeleri (Markadan Folkie'ye)
CREATE TABLE brand_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  brand_id UUID REFERENCES brand_profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'received', 'partial', 'failed'
  )),
  payment_method TEXT DEFAULT 'bank_transfer',
  transfer_reference TEXT,
  receipt_url TEXT,                         -- Dekont görseli
  admin_note TEXT,
  confirmed_by UUID REFERENCES users(id),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Değerlendirmeler
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  reviewer_id UUID REFERENCES users(id),
  reviewee_id UUID REFERENCES users(id),
  reviewer_role TEXT CHECK (reviewer_role IN ('influencer', 'brand')),
  score INTEGER CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, reviewer_id)
);

-- Bildirimler
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,                       -- application_approved, payment_sent, revision_requested, vb.
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,                               -- İlgili kayıt ID'leri
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Yetki & Güvenlik (RLS YOK — API Katmanında)

> Stack .NET'e geçtiğinden Supabase RLS kullanılmıyor. Yetki ASP.NET Core'da
> middleware + use case başında zorunlu kontrollerle uygulanır.

**Kurallar (örnek):**

```csharp
// Folkie.Application/Brand/Campaigns/UpdateCampaign/UpdateCampaignHandler.cs
public async Task<Result> Handle(UpdateCampaignCommand cmd, CancellationToken ct)
{
    var campaign = await _db.Campaigns.FindAsync(cmd.Id);
    if (campaign is null) return Result.NotFound();

    // Marka sadece kendi kampanyasını düzenleyebilir
    if (campaign.BrandProfileId != _currentUser.BrandProfileId)
        return Result.Forbidden();

    // ... update
}

// Folkie.Api/Endpoints/Admin/PaymentsEndpoints.cs
group.MapPost("/payments/{id}/transfer", TransferPayment)
     .RequireAuthorization(p => p.RequireRole("Admin"));
```

**Genel kurallar:**
- Influencer: sadece kendi profili, başvuruları, içerikleri, kazançları
- Marka: sadece kendi kampanyaları, başvuran influencer'ları, içerikleri
- Influencer'lar `status='active'` kampanyaları görebilir (read-only filter)
- Tüm ödeme işlemleri `[Authorize(Roles="Admin")]`
- `_currentUser` servisi JWT'den userId/role'ü okur ve DI ile injectionlanır

---

## 🚀 Özellik Listesi — Tüm Fazlar

### FAZ 1 — MVP (0-3. Ay)

> ℹ️ "Creator" = UI'daki terim. DB tablo adı `influencer_profiles` olarak kalır.

#### Creator Tarafı
- [ ] Clerk üzerinden TikTok OAuth ile kayıt ve giriş
- [ ] Profil oluşturma (kategori, şehir, dil, IBAN)
- [ ] TikTok hesap bağlama (follower sayısı otomatik çekme)
- [ ] Kampanya listesi ve detay sayfası
- [ ] Kampanyaya başvurma (iş birliği talebi)
- [ ] Başvuru durumu takibi
- [ ] İçerik taslağı yükleme (video → Contabo Storage + script)
- [ ] Kazanç / ödeme geçmişi ekranı (salt okunur)
- [ ] Bildirimler (uygulama durumu, ödeme)

#### Marka Tarafı
- [ ] E-posta ile kayıt ve giriş
- [ ] Marka profili oluşturma
- [ ] Kampanya oluşturma formu (tüm alanlar)
- [ ] Kampanya listesi ve durum takibi
- [ ] Başvuran influencer listesi
- [ ] Tekil başvuru onay / red işlemi
- [ ] İçerik taslağı görüntüleme ve onay / revizyon
- [ ] Temel kampanya raporu (katılım sayısı, içerik durumu)

#### Admin Paneli
- [ ] Kullanıcı listesi ve detay sayfaları
- [ ] Kampanya listesi ve durum güncelleme
- [ ] Marka ödemesi dekont onaylama
- [ ] Influencer IBAN transfer onaylama
- [ ] Manuel ödeme oluşturma ve durum güncelleme
- [ ] Basit dashboard (toplam kullanıcı, kampanya, ödeme)

---

### FAZ 2 — Büyüme (4-6. Ay)

#### Eşleştirme & Keşif
- [ ] AI eşleştirme skoru hesaplama (kategori + takipçi + engagement + konum)
- [ ] Influencer keşif sayfası (marka tarafı): filtreli arama, profil kartları
- [ ] Markadan influencer'a doğrudan davet
- [ ] Kampanya başvurusunda "önerilen influencer'lar" listesi

#### Flash Kampanya Sistemi
- [ ] Kampanya oluşturmada "Flash Kampanya" seçeneği
- [ ] Eş zamanlı yayın saati belirleme
- [ ] Otomatik push bildirimleri: -1 saat, -15 dk, -5 dk uyarıları
- [ ] Flash kampanya sayaç widget'ı (influencer dashboard)

#### Gelişmiş İçerik Yönetimi
- [ ] Toplu içerik onay / red
- [ ] Revizyon geçmişi görüntüleme
- [ ] Yayın onayı sonrası TikTok linki zorunlu girişi
- [ ] AI brief oluşturucu (ürün adı + kategori → brief taslağı)

#### Analytics
- [ ] Kampanya bazlı performans dashboard'u
- [ ] İnfluencer bazlı metrik tablosu
- [ ] TikTok video metrikleri çekme (Business API)
- [ ] PDF rapor export

#### Bildirim Sistemi
- [ ] E-posta bildirimleri (Resend)
- [ ] In-app bildirim merkezi
- [ ] SMS bildirimi (opsiyonel — Netgsm veya İleti Merkezi)

---

### FAZ 3 — Ölçeklendirme (7-12. Ay)

#### Platform Zekası
- [ ] Influencer cluster algoritması (benzer davranış grupları)
- [ ] Sahte takipçi otomatik tespit (HypeAuditor API veya manuel audit)
- [ ] Kampanya başarı tahmin skoru (geçmiş verilere dayalı)
- [ ] Marka için "Bu kategoride en iyi performans gösteren influencer tipleri" önerisi

#### Influencer Büyüme Programı
- [ ] Folkie Stars rozet sistemi (Yükselen / Parlayan / Süper Star)
- [ ] Rozet kriterleri: tamamlanan kampanya sayısı + ortalama puan + yayın zamanında yapılma
- [ ] Rozet = öncelikli eşleştirme + daha yüksek kampanya teklifi
- [ ] Influencer büyüme analitiği: "Bu ay X yeni takipçi kazandın"

#### Performans Bazlı Bonus Sistemi (Manuel Onaylı)
- [ ] Kampanya brief'inde opsiyonel bonus kriterleri tanımlama
- [ ] Admin panelinde performans metriği girişi ve bonus onaylama
- [ ] Tier yapısı:
  - Temel Ücret: İçerik yayınlanınca (garanti)
  - Etkileşim Bonusu: 48 saatte X izlenme → +%20 (admin onaylar)
  - Viral Bonus: Trend'e giriş → +%50 (admin onaylar)

#### Nano Influencer Özel Özellikleri
- [ ] "Nano Fırsatlar" özel akışı (1K-10K kitleye özel kampanyalar)
- [ ] Nano influencer için sadeleştirilmiş onboarding (3 adım)
- [ ] Marka için "Nano Paket": 50-200 nano influencer + düşük toplam bütçe seçeneği
- [ ] Nano influencer güven skoru: gerçek etkileşim vurgusu

#### Kurumsal Özellikler
- [ ] Beyaz etiket (white-label) çözüm: büyük markalar kendi influencer ağını yönetir
- [ ] API erişimi (kurumsal markalar için)
- [ ] Çoklu kampanya yönetimi (aynı anda N kampanya)
- [ ] Ekip hesabı: markalara birden fazla kullanıcı

#### Uluslararası Hazırlık
- [ ] İngilizce dil desteği
- [ ] Çoklu para birimi görüntüleme (ödeme hâlâ TL manuel)
- [ ] GDPR / KVKK uyumluluk modülü

---

## 🏗️ Mimari Kararlar ve Kurallar

### Genel
- Her şey **TypeScript** ile yazılacak; `any` kullanımı yasak
- **Server Components** tercih edilecek; sadece gerektiğinde `'use client'`
- **Supabase SSR** paketi kullanılacak (`@supabase/ssr`)
- Form doğrulama: **Zod** ile schema bazlı
- Tarih/saat: **date-fns** (dayjs değil)
- State yönetimi: önce React state, büyüdükçe Zustand

### Güvenlik
- IBAN bilgisi veritabanında şifreli saklanır (pgcrypto veya uygulama katmanında)
- Admin işlemleri her zaman RLS + sunucu taraflı rol kontrolüyle korunur
- TikTok token'ları client'ta asla loglanmaz
- `.env.local` örnek şablonu: `.env.example` olarak repoda tutulur

### Kod Standartları
- Bileşenler: `PascalCase`
- Fonksiyonlar / değişkenler: `camelCase`
- Veritabanı sütunları: `snake_case`
- Her route grubunun kendi `layout.tsx`'i olur
- Supabase sorguları: her zaman `select` ile kolonları belirt, `select('*')` kullanma
- Hata yönetimi: `try/catch` değil; Supabase `{ data, error }` destructuring

### Performans
- Görsel optimizasyonu: `next/image` zorunlu
- Dinamik import: ağır bileşenler lazy load edilir
- Supabase Realtime: sadece admin dashboard ve flash kampanya sayacında kullanılır

---

## 🔑 Ortam Değişkenleri

```bash
# .env.example
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=          # Sadece sunucu tarafı / admin

TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
NEXT_PUBLIC_TIKTOK_REDIRECT_URI=

OPENAI_API_KEY=

RESEND_API_KEY=

NEXT_PUBLIC_APP_URL=                # https://folkie.com
NEXT_PUBLIC_APP_NAME=Folkie
```

---

## 💳 Manuel Ödeme Akışı — Detaylar

### Marka → Folkie (Kampanya Aktivasyonu)
```
1. Marka kampanya oluşturur (status: 'draft')
2. Admin kampanyayı onaylar → marka ödeme bilgileri sayfasına yönlendirilir
3. Marka, toplam bütçeyi Folkie banka hesabına EFT/havale yapar
4. Admin dekont kontrolü yapar → brand_payments.status = 'received'
5. Kampanya status: 'active' olur → influencer başvuruları açılır
```

### Folkie → Influencer (Kampanya Sonu)
```
1. İnfluencer içeriği yayınlar (TikTok linki sisteme girer)
2. Admin 'Ödeme Hazır' işaretler → payments.status = 'approved'
3. Admin IBAN'a manuel banka transferi yapar
4. Admin transfer referansını sisteme girer → payments.status = 'transferred'
5. İnfluencer bildirim alır: "Ödemeniz gönderildi"
```

### Admin Ödeme Dashboard'u İçermeli
- Bekleyen ödemeler listesi (influencer adı, IBAN, tutar)
- Toplu transfer listesi indir (Excel/CSV) — muhasebe kolaylığı
- Transfer referansı giriş formu
- Dönem bazlı ödeme özeti

---

## 🎨 Tasarım Sistemi (v2 — Marka Kiti)

> Resmi tasarım kaynak dosyaları `folkie_web/docs/brand-kit/` içinde
> tutulmalı (logo, ekran tasarımları, ikon seti).

### Renk Paleti
```css
/* Birincil */
--color-violet:        #6B3DFF;   /* Folkie ana mor — primary */
--color-lavender:      #A78BFA;   /* primary-mid */
--color-violet-light:  #EDE9FE;   /* primary-light arka plan */

/* Vurgu */
--color-neon-lime:     #C6FF00;   /* accent — CTA, badge, etiket */

/* Nötr */
--color-navy:          #0D1226;   /* navy — koyu kart, dark CTA */
--color-off-white:     #F7F7FB;   /* background */
--color-text:          #0D1226;   /* foreground (navy üzerinden) */
--color-muted:         #6B7280;

/* Sistem */
--color-success:       #2ECC71;
--color-warning:       #F39C12;
--color-error:         #E74C3C;
```

### Tip Hiyerarşisi
- **Font: Satoshi** (Fontshare CDN — `https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900`)
- H1: 36px / Bold (700)
- H2: 28px / SemiBold (500/700)
- H3: 22px / SemiBold (700)
- Body: 16px / Regular (400)
- Small: 14px / Regular
- Caption: 12px / Regular

### Bileşen Stilleri
- **Köşe yarıçapı:** 0.875rem (14px) için kart, full (rounded-full) için buton (pill)
- **Buton:** `btn-primary` (violet pill), `btn-accent` (lime pill), `btn-outline` (violet kenarlı)
- **Kart:** `card-folkie` (beyaz, yuvarlak), `card-navy` (koyu kart, beyaz yazı)
- **Tab aktif çizgisi:** lime (alt çizgi)

### Terminoloji
- **UI'da her zaman "creator"** kullanılır. ("Influencer" terim olarak kullanılmaz.)
- Backend tablo adı `influencer_profiles` olarak kalır (DB değişmez), ama API DTO ve frontend'de `Creator` adı tercih edilir.
- URL'ler: `/creator/...` (kullanıcı tarafı), `/marka/...` (marka tarafı), `/admin/...` (admin)
- Role değeri DB'de `"influencer"` olarak saklanır; frontend metni "Creator" olarak gösterir.

### Nano Creator UI Kuralları
- Nano creator kartlarında **"Gerçek Etki"** rozeti (lime arkaplan, navy yazı)
- Kampanya listesinde nano için özel **"Nano Fırsatlar"** sekmesi önce gelir
- Onboarding'de nano için "Takipçin az mı? Sorun değil — markaların asıl aradığı sensin." mesajı
- Marka panelinde "Sizin İçin" badge'i AI eşleşme önerilerinde violet arka planla gösterilir

---

## 📋 Geliştirme Öncelikleri (Sırasıyla)

1. **Supabase kurulum ve migration'lar** — tüm tabloları oluştur, RLS'leri yaz
2. **Auth akışı** — influencer (TikTok) ve marka (e-posta) girişi
3. **Influencer onboarding** — profil oluşturma, kategori seçimi
4. **Marka onboarding** — profil + kampanya oluşturma formu
5. **Kampanya listesi** (influencer tarafı) — başvuru akışı
6. **Kampanya yönetimi** (marka tarafı) — başvuru onay, içerik onay
7. **Admin paneli** — kullanıcılar, kampanyalar, manuel ödeme
8. **Bildirim sistemi** — e-posta (Resend)
9. **Analytics dashboard**
10. **Flash kampanya koordinasyonu**

---

## ⚠️ Bilinen Kısıtlamalar ve Kararlar

| Konu | Karar | Neden |
|------|-------|-------|
| Escrow | **Yok** | Türkiye'de uygulanabilir değil; manuel banka transferi kullanılıyor |
| Otomatik ödeme | **Yok** | MVP ve büyüme fazında admin manuel onay + transfer yapıyor |
| TikTok metrikleri | **Kısıtlı** | TikTok API kısıtlı; follower sayısı login'de çekilir, video metrikleri Business API ile |
| Sahte takipçi tespiti | **Manuel** | MVP'de admin inceler; Faz 3'te HypeAuditor API entegrasyonu |
| Mobil uygulama | **Faz 3** | Önce web; React Native Faz 3'te planlanıyor |
| Çok dilli | **Faz 3** | MVP sadece Türkçe |

---

## 🔗 Faydalı Linkler

- Supabase Docs: https://supabase.com/docs
- Next.js 14 App Router: https://nextjs.org/docs
- TikTok Login API: https://developers.tiktok.com/doc/login-kit-web
- TikTok Business API: https://business-api.tiktok.com/portal/docs
- shadcn/ui: https://ui.shadcn.com
- Resend: https://resend.com/docs

---

*Son güncelleme: Mayıs 2026 | Versiyon: 1.0 | Sahibi: Fatoş Hacıoğlu*
