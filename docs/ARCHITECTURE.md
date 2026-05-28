# Folkie — Mimari Plan (v2: .NET Backend)

> Bu doküman Folkie'nin **Next.js frontend + ASP.NET Core 8 backend + Clerk auth + PostgreSQL** mimarisini tanımlar.
> CLAUDE.md ürün kararlarını içerir; bu doküman teknik mimariyi.

---

## 1. Yüksek Seviye Mimari

```
┌─────────────────────────────────────────────────────────────────┐
│                        KULLANICILAR                              │
│   Influencer (mobil ağırlıklı)    Marka (web)    Admin (web)    │
└────────────────────┬────────────────────────────────────────────┘
                     │ HTTPS
                     ▼
         ┌────────────────────────┐
         │   Next.js 14 (Vercel)  │
         │   App Router + SSR     │
         │   Tailwind + shadcn/ui │
         └─────┬──────────┬───────┘
               │          │
       Clerk JS│          │ REST + SignalR (JWT)
               ▼          ▼
       ┌──────────┐   ┌──────────────────────────────────────┐
       │  Clerk   │   │   ASP.NET Core 8 Web API (Azure)     │
       │  (Auth)  │   │   ┌──────────────────────────────┐   │
       │          │   │   │  Folkie.Api  (presentation)   │   │
       │  TikTok  │   │   ├──────────────────────────────┤   │
       │  OAuth   │◄──┼──►│  Folkie.Application  (CQRS)  │   │
       │          │   │   ├──────────────────────────────┤   │
       │  Email   │   │   │  Folkie.Domain  (entities)   │   │
       │  /Pass   │   │   ├──────────────────────────────┤   │
       └────┬─────┘   │   │  Folkie.Infrastructure       │   │
            │webhook  │   │  (EF Core, Clerk SDK, R2,    │   │
            │         │   │   SignalR, Hangfire, Resend) │   │
            └────────►│   └──────────────────────────────┘   │
                     └────┬──────────────┬─────────────┬─────┘
                          │              │             │
                          ▼              ▼             ▼
                  ┌───────────┐   ┌──────────┐  ┌──────────┐
                  │PostgreSQL │   │Cloudflare│  │  Resend  │
                  │  (Neon /  │   │    R2    │  │ (e-posta)│
                  │ Azure PG) │   │ (videolar│  │          │
                  │           │   │  + logos)│  │          │
                  └───────────┘   └──────────┘  └──────────┘
                          ▲
                          │
                  ┌───────┴───────┐
                  │   Hangfire    │
                  │ (background)  │
                  │ - TikTok sync │
                  │ - reminders   │
                  └───────────────┘
```

---

## 2. Repo Yapısı

İki yan-yana proje (monorepo değil — basit tutuyoruz):

```
~/Desktop/
├── folkie_web/          # Next.js frontend (mevcut)
│   ├── app/
│   ├── components/
│   ├── lib/
│   │   ├── api/         # Typed REST client (NSwag ile üretilir)
│   │   ├── clerk/       # Clerk yardımcıları
│   │   └── utils.ts
│   ├── types/
│   └── docs/
│       └── ARCHITECTURE.md (bu dosya)
│
└── folkie_api/          # ASP.NET Core 8 backend (yeni)
    ├── src/
    │   ├── Folkie.Api/                # Web API entry point
    │   ├── Folkie.Application/        # Use case'ler (CQRS, MediatR)
    │   ├── Folkie.Domain/             # Entities, value objects, enums
    │   └── Folkie.Infrastructure/     # EF Core, dış servisler
    ├── tests/
    │   ├── Folkie.Application.Tests/
    │   └── Folkie.Api.IntegrationTests/
    ├── Folkie.sln
    └── README.md
```

> Karar gerekiyor: bu yapıyı kabul ediyor musun, yoksa `folkie/` üst klasörü altında `web/` + `api/` mı tercih edersin?

---

## 3. Backend — Clean Architecture Detayı

### 3.1 Projeler ve Bağımlılık Yönü

```
Folkie.Api                     ← presentation
  └── Folkie.Application       ← business logic
        └── Folkie.Domain      ← entities, hiçbir şeye bağımlı değil
              ↑
Folkie.Infrastructure ─────────┘ (EF Core, dış servisler)
  ├── Folkie.Application'ın interface'lerini implement eder
  └── Folkie.Domain'i bilir
```

**Kural:** Domain hiçbir framework'e bağımlı olmaz (saf C#). Application sadece interface'leri tanımlar; gerçek implementasyon Infrastructure'da.

### 3.2 Önemli Paketler

| Paket | Amaç |
|---|---|
| `Microsoft.AspNetCore.OpenApi` + `Swashbuckle.AspNetCore` | Swagger / OpenAPI |
| `Microsoft.EntityFrameworkCore` + `Npgsql.EntityFrameworkCore.PostgreSQL` | ORM + PG |
| `MediatR` | CQRS / use case'ler |
| `FluentValidation` + `FluentValidation.AspNetCore` | Input doğrulama |
| `Mapster` veya `AutoMapper` | DTO ↔ Entity mapping |
| `Hangfire.AspNetCore` + `Hangfire.PostgreSql` | Background jobs |
| `Microsoft.AspNetCore.SignalR` | Realtime |
| `AWSSDK.S3` | Contabo Object Storage (S3 uyumlu) |
| `Serilog.AspNetCore` + `Serilog.Sinks.Seq` | Logging |
| `Clerk.Net.SDK` (veya HTTP client) + `Microsoft.AspNetCore.Authentication.JwtBearer` | Clerk JWT doğrulama |
| `Resend` (resmi .NET SDK yok → HttpClient) | E-posta |

---

## 4. Auth Stratejisi — Clerk

### Neden Clerk (Auth0 değil)?

| Kriter | Clerk | Auth0 |
|---|---|---|
| Next.js entegrasyonu | ⭐⭐⭐⭐⭐ Drop-in components, App Router native | ⭐⭐⭐ SDK var ama daha az polish |
| Free tier | 10K MAU + 100 organizations | 25K MAU ama sosyal login sınırlı |
| Custom OAuth (TikTok) | ✅ Custom OAuth provider eklenebilir | ✅ Custom social connection |
| UI components (Türkçe) | Hazır, customize edilebilir, Türkçe yerel | Hazır ama daha az flexible |
| Webhook + backend sync | Çok temiz (svix tabanlı) | Var ama daha karmaşık |
| Maliyet (10K-50K MAU) | $25 + $0.02/MAU = ~$50-200/ay | $240+/ay (B2C plan) |
| Vendor lock-in çıkışı | Kullanıcılar export edilebilir | Aynı |

**Sonuç:** Folkie için Clerk daha uygun. Türk girişimi + ölçek küçük başlayacak + Next.js tarafı ergonomi önemli.

### Auth Akışı

```
1. Kullanıcı Next.js'te <SignIn> komponentini görür (Clerk hosted UI)
2. Marka: e-posta + şifre ile kayıt → Clerk user oluşur
   Influencer: "TikTok ile devam et" → Clerk → TikTok OAuth → Clerk user
3. Clerk webhook → ASP.NET API'ye `user.created` event gönderir
4. API webhook handler → folkie.users tablosuna kayıt ekler (clerk_user_id, email, role)
5. Frontend her API çağrısında Clerk'ten kısa-ömürlü JWT alır:
      const token = await session.getToken({ template: "folkie-api" });
      fetch("/api/...", { headers: { Authorization: `Bearer ${token}` } });
6. ASP.NET API JWT'yi doğrular (Clerk JWKS endpoint'i)
   → ClaimsPrincipal'dan clerk_user_id'yi alır
   → folkie.users'tan internal user_id ve role'ü çeker
   → İstek devam eder
```

### Önemli Detaylar

- **Role yönetimi:** Clerk'in `publicMetadata.role` alanına `"influencer" | "brand" | "admin"` yazılır. Hem frontend hem backend bu alanı okur.
- **TikTok OAuth özel mi?** Clerk standart provider listesinde TikTok yok → "Custom OAuth Connection" eklenmesi gerekiyor (Clerk dashboard'tan).
- **Webhook güvenliği:** Clerk webhook'ları svix imzası ile gelir → backend `Svix-Signature` header'ı doğrular.
- **JWT template:** Clerk dashboard'da `folkie-api` adlı bir JWT template tanımlanır → `userId`, `role`, `email` claim'lerini içerir.

---

## 5. EF Core Entity Haritası

CLAUDE.md'deki 10 PostgreSQL tablosu → C# entity'leri:

```csharp
// Folkie.Domain/Users/User.cs
public class User
{
    public Guid Id { get; set; }
    public string ClerkUserId { get; set; }      // Clerk ile bağ
    public string Email { get; set; }
    public UserRole Role { get; set; }            // enum
    public string? FullName { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }

    public InfluencerProfile? InfluencerProfile { get; set; }
    public BrandProfile? BrandProfile { get; set; }
}

public enum UserRole { Influencer, Brand, Admin }
public enum InfluencerTier { Nano, Micro, MidTier }
public enum CampaignStatus { Draft, PendingPayment, Active, ApplicationsClosed,
                              InProgress, Completed, Cancelled }
// ... vb.
```

### Tier hesaplama (computed column yerine)

Supabase'te `tier` GENERATED column'du. EF Core'da iki seçenek:
1. **Computed column** (DbContext.OnModelCreating'de PG raw expression)
2. **Domain property** (`User.Tier => follower_count'a göre`) — daha pratik, test edilebilir

Tavsiye: **2** — domain'de hesapla, DB'de sadece `follower_count` tut.

### IBAN Şifreleme

Supabase'te `pgcrypto` planlanmıştı. .NET tarafında:
- Application katmanında `IIbanProtector` interface'i
- Infrastructure'da implementasyon: ASP.NET Core Data Protection API (key rotation built-in)
- `BankAccount` value object: `string EncryptedIban` field'ı + `Decrypt(IIbanProtector)` metodu

```csharp
public sealed record BankAccount(string EncryptedIban, string IbanName)
{
    public string Decrypt(IIbanProtector protector) => protector.Unprotect(EncryptedIban);
}
```

### Migration

```bash
cd src/Folkie.Infrastructure
dotnet ef migrations add InitialSchema -s ../Folkie.Api
dotnet ef database update -s ../Folkie.Api
```

---

## 6. REST API Endpoint Kataloğu (MVP)

> Versiyon: `/api/v1/...`. Tüm endpoint'ler JWT zorunlu (anonim olanlar hariç).

### Auth & User
- `POST /api/v1/webhooks/clerk` — Clerk webhook (user.created/updated/deleted)
- `GET  /api/v1/me` — Mevcut kullanıcı + profil

### Influencer
- `POST /api/v1/influencer/profile` — Profil oluştur (kategori, şehir, IBAN)
- `PATCH /api/v1/influencer/profile` — Profil güncelle
- `POST /api/v1/influencer/tiktok/connect` — TikTok hesabını bağla, follower çek
- `GET  /api/v1/influencer/campaigns` — Aktif kampanyaları listele (filtreli)
- `GET  /api/v1/influencer/campaigns/{id}` — Kampanya detay
- `POST /api/v1/influencer/campaigns/{id}/apply` — Başvuru yap
- `GET  /api/v1/influencer/applications` — Kendi başvurularını listele
- `DELETE /api/v1/influencer/applications/{id}` — Başvuruyu geri çek
- `POST /api/v1/influencer/submissions` — İçerik taslağı yükle (multipart)
- `PATCH /api/v1/influencer/submissions/{id}/publish` — Yayınla, TikTok URL gir
- `GET  /api/v1/influencer/earnings` — Kazanç/ödeme geçmişi (salt okunur)
- `GET  /api/v1/influencer/notifications` — Bildirimler

### Brand
- `POST /api/v1/brand/profile` — Marka profili oluştur
- `PATCH /api/v1/brand/profile`
- `POST /api/v1/brand/campaigns` — Kampanya oluştur (draft)
- `GET  /api/v1/brand/campaigns` — Kampanyalar liste
- `GET  /api/v1/brand/campaigns/{id}` — Detay + başvurular + içerikler
- `PATCH /api/v1/brand/campaigns/{id}` — Düzenle (draft iken)
- `POST /api/v1/brand/campaigns/{id}/submit` — Onaya gönder
- `GET  /api/v1/brand/campaigns/{id}/applications` — Başvuran influencer'lar
- `POST /api/v1/brand/applications/{id}/approve`
- `POST /api/v1/brand/applications/{id}/reject` (rejection_reason body)
- `POST /api/v1/brand/submissions/{id}/approve`
- `POST /api/v1/brand/submissions/{id}/request-revision` (note body)

### Admin
- `GET  /api/v1/admin/users` — Tüm kullanıcılar (filtreli)
- `PATCH /api/v1/admin/users/{id}/verify`
- `GET  /api/v1/admin/campaigns` — Tüm kampanyalar
- `PATCH /api/v1/admin/campaigns/{id}/status` — Durum değiştir
- `POST /api/v1/admin/brand-payments/{id}/confirm` — Dekont onayı
- `POST /api/v1/admin/brand-payments/{id}/upload-receipt`
- `GET  /api/v1/admin/payments/pending` — Bekleyen influencer ödemeleri
- `POST /api/v1/admin/payments/{id}/approve`
- `POST /api/v1/admin/payments/{id}/transfer` — Transfer ref. gir
- `GET  /api/v1/admin/payments/export` — CSV/Excel export

### Files (Contabo Object Storage)
- `POST /api/v1/files/upload-url` — Pre-signed PUT URL üret (client direkt R2'ye yükler)
- `DELETE /api/v1/files/{key}` — Dosya sil

### Realtime (SignalR)
- `/hubs/notifications` — In-app bildirim push
- `/hubs/flash-campaign` — Flash kampanya sayacı (Faz 2)

---

## 7. Dosya Depolama — Contabo Object Storage

**Neden R2:** S3 uyumlu, çıkış trafiği bedava (videolar büyük → bandwidth kritik), Türkiye'ye yakın CDN.

**Akış:**
```
1. Influencer "video yükle" → frontend POST /files/upload-url
   { type: "video/mp4", size: 12345678 }
2. API:
   - Boyut/MIME doğrula (max 100MB, video/* veya image/*)
   - Contabo S3 SDK ile presigned PUT URL üret (15dk TTL)
   - Yanıt: { url, key }
3. Frontend → presigned URL'e direkt PUT (büyük dosya, API'den geçmez)
4. Frontend → POST /influencer/submissions { videoKey: key, script: "..." }
5. API content_submissions'a kayıt eklerken video_url = "https://media.folkie.com/{key}"
```

**Bucket organizasyonu:**
```
folkie-media/
├── submissions/{userId}/{submissionId}/{filename}
├── brand-logos/{brandId}/{filename}
├── brand-receipts/{brandPaymentId}/{filename}     (admin yükler)
└── avatars/{userId}/{filename}
```

---

## 8. Background Jobs — Hangfire

**Neden Hangfire:** Built-in dashboard (admin için), PostgreSQL storage, retry/scheduling.

**MVP'de kullanılacak job'lar:**

| Job | Tetik | Açıklama |
|---|---|---|
| `SendEmailNotification` | Domain event sonrası | Resend'e e-posta gönder, retry 3x |
| `SyncInfluencerTikTokStats` | Daily 03:00 cron | Tüm aktif influencer'ların follower/engagement güncelle |
| `RemindBrandPayment` | 2 gün sonra delayed | Marka ödemesi yapmadıysa hatırlatma |
| `RemindContentSubmission` | publish_start_date - 2gün | Influencer içerik yüklemediyse hatırlatma |
| `CloseExpiredCampaigns` | Daily 00:00 cron | application_deadline geçtiyse status="applications_closed" |
| `MarkCampaignCompleted` | Daily 00:00 cron | publish_end_date + 7gün geçti ve tüm içerikler yayınlandıysa "completed" |

**Faz 2 jobs:**
- `FetchTikTokVideoMetrics` — yayınlanan içeriklerin izlenme/like/comment sayıları (Business API)
- `CalculateMatchScore` — kampanya oluşturulunca AI eşleştirme skorları

**Hangfire dashboard:** `/hangfire` → sadece Admin role erişebilir.

---

## 9. Realtime — SignalR

### Kullanım Alanları

**MVP:**
- **Bildirim hub'ı** (`/hubs/notifications`): Yeni başvuru/onay/red anında frontend'e push edilir → bell ikonu güncellenir.

**Faz 2:**
- **Flash kampanya hub'ı** (`/hubs/flash-campaign`): Yayın saatine geri sayım, "X influencer hazır" göstergesi.

### Sample Hub

```csharp
[Authorize]
public class NotificationsHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        if (userId is not null)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
        await base.OnConnectedAsync();
    }
}

// Application'dan tetikleme:
await _hubContext.Clients.Group($"user:{userId}")
    .SendAsync("notification", new { type, title, body, data });
```

---

## 10. Frontend ↔ Backend İletişim

### Typed REST Client

Backend OpenAPI/Swagger üretir → Frontend `nswag` veya `openapi-typescript` ile typed client üretir:

```bash
# folkie_web/ içinde
npm run api:generate
# → lib/api/client.ts oluşur (typed)
```

Kullanım:
```ts
import { folkieApi } from "@/lib/api/client";
import { auth } from "@clerk/nextjs/server";

export async function getCampaigns() {
  const { getToken } = await auth();
  const token = await getToken({ template: "folkie-api" });
  const { data, error } = await folkieApi.influencer.campaigns.list({ headers: { Authorization: `Bearer ${token}` } });
  if (error) throw new Error(error.message);
  return data;
}
```

### CORS

API:
```csharp
builder.Services.AddCors(o => o.AddPolicy("Web",
    p => p.WithOrigins("https://folkie.com", "http://localhost:3000")
          .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));
```

---

## 11. Deployment Topolojisi (KESİN — Bedava/Minimum Stack)

### MVP

| Bileşen | Hosting | Aylık Maliyet |
|---|---|---|
| Next.js frontend | **Vercel Hobby** | **$0** |
| ASP.NET API | **Contabo VPS** (Docker + Nginx + Let's Encrypt) | **~€5** (~$5) |
| PostgreSQL | **Supabase Free** (sadece DB, auth/storage kullanmıyoruz) | **$0** |
| Contabo Object Storage | Free tier 10 GB + çıkış BEDAVA | **$0** |
| Clerk | Free tier 10K MAU | **$0** |
| Resend | Free 3K e-posta/ay | **$0** |
| Logging (app) | Serilog + **Seq Community** (Docker, aynı VPS) | **$0** |
| Error tracking | **Sentry Free** (5K event/ay, frontend + backend) | **$0** |
| CI/CD | **GitHub Actions Free** (2K dk/ay) | **$0** |
| Hangfire | API ile aynı host (Docker container) | **$0** |
| Domain | folkie.com vb. | ~$1 (yıllık $12) |
| **TOPLAM** | | **~$6/ay** |

### ⚠️ Supabase Free Tier Riski

- **7 gün hareketsizlik = otomatik pause** (DB durur, restart manuel)
- **Mitigation:** Hangfire'da daily 1 query çalıştır → aktif kalır
  ```csharp
  RecurringJob.AddOrUpdate("supabase-keepalive",
      () => _db.Database.ExecuteSqlRaw("SELECT 1"),
      Cron.Daily);
  ```
- **500 MB DB limiti:** Folkie 1.000 user'a kadar rahat. Aşılınca: Neon'a migrate (1 saat iş) veya Supabase Pro ($25).

### Contabo VPS Setup (özet)

```
1. Contabo VPS S (€4-5/ay): 4 vCPU, 8 GB RAM, 200 GB SSD, Ubuntu 22.04
2. SSH key ile login, root devre dışı, ufw firewall (22, 80, 443)
3. Docker + Docker Compose kurulumu
4. docker-compose.yml:
   ┌─ folkie-api       (ASP.NET, port 5000 internal)
   ├─ seq              (Serilog hedefi, port 5341 internal)
   └─ caddy            (reverse proxy + otomatik SSL)
5. DNS: api.folkie.com → Contabo IP
6. Caddy config: api.folkie.com → folkie-api:5000 (TLS otomatik)
7. GitHub Actions: build → push image → SSH → docker compose pull && up -d
```

**Backup stratejisi:**
- DB Supabase'in kendi 7-günlük backup'ı + haftalık `pg_dump` → R2'ye sync
- Code: GitHub'da
- Volume backup: Contabo snapshot (€1/ay opsiyonel)

### Production (Skala büyüyünce)

- Vercel Pro (~$20/ay)
- 2x Contabo VPS load balancer arkasında veya tek büyük VPS
- DB: Supabase Pro ($25) veya Neon Scale ($19)
- Contabo Object Storage kullanım bazlı
- Clerk Pro

---

## 12. Environment Değişkenleri

### Frontend (`folkie_web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:5050
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

### Backend (`folkie_api/src/Folkie.Api/.env` veya appsettings.Development.json)

```json
{
  "ConnectionStrings": {
    "Postgres": "Host=localhost;Port=5432;Database=folkie;Username=...;Password=...",
    "Hangfire": "Host=localhost;Port=5432;Database=folkie_hangfire;..."
  },
  "Clerk": {
    "Issuer": "https://xxx.clerk.accounts.dev",
    "JwksUri": "https://xxx.clerk.accounts.dev/.well-known/jwks.json",
    "WebhookSecret": "whsec_..."
  },
  "CloudflareR2": {
    "AccountId": "...",
    "AccessKeyId": "...",
    "SecretAccessKey": "...",
    "BucketName": "folkie-media",
    "PublicUrl": "https://media.folkie.com"
  },
  "Resend": { "ApiKey": "re_...", "FromEmail": "Folkie <noreply@folkie.com>" },
  "TikTok": {
    "ClientKey": "...",
    "ClientSecret": "...",
    "RedirectUri": "http://localhost:3000/tiktok-callback"
  },
  "DataProtection": { "KeyRingPath": "./keys" },
  "Cors": { "AllowedOrigins": ["http://localhost:3000"] }
}
```

> Production'da: Azure Key Vault veya environment variables (asla repo'da değil).

---

## 13. Kritik Akışlar — Sequence Diyagramları

### A. Marka kampanya oluşturma + ödeme

```
Marka          Frontend       API                    DB        Admin
  │              │              │                     │           │
  │ form doldur  │              │                     │           │
  ├─────────────►│              │                     │           │
  │              │ POST /campaigns                    │           │
  │              ├─────────────►│ INSERT campaign     │           │
  │              │              ├────────────────────►│           │
  │              │              │ status=draft        │           │
  │              │              │ INSERT brand_payment│           │
  │              │              │ status=pending      │           │
  │              │◄─────────────┤ 201 + IBAN bilgisi  │           │
  │ "havale yap" │              │                     │           │
  │ ekranı       │              │                     │           │
  │   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │           │
  │ (Marka banka transferi yapar — platform dışı)    │           │
  │   ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │           │
  │              │                                    │ dekont    │
  │              │                                    │ kontrol   │
  │              │              POST /admin/brand-payments/{id}/confirm
  │              │              │◄────────────────────┼───────────┤
  │              │              │ UPDATE brand_payment│           │
  │              │              │ status=received     │           │
  │              │              │ UPDATE campaign     │           │
  │              │              │ status=active       │           │
  │              │              │ Hangfire: notify    │           │
  │              │              ├──► Resend: marka e-posta        │
  │              │              ├──► SignalR: marka push          │
```

### B. Influencer içerik yükleme

```
Influencer    Frontend          API            R2        DB
  │             │                │              │         │
  │ video seç   │                │              │         │
  ├────────────►│ POST /files/upload-url        │         │
  │             ├───────────────►│              │         │
  │             │                │ presign      │         │
  │             │                ├─────────────►│         │
  │             │◄───────────────┤ {url, key}   │         │
  │             │ PUT direct     │              │         │
  │             ├────────────────────────────► R2 (multi-MB upload)
  │             │ POST /influencer/submissions  │         │
  │             │ { videoKey, script }          │         │
  │             ├───────────────►│              │         │
  │             │                │ INSERT submission       │
  │             │                ├────────────────────────►│
  │             │                │ status=submitted        │
  │             │                │ Notify brand            │
```

---

## 14. MVP Uygulama Sırası (Sprint Planı)

> CLAUDE.md'deki 10-maddelik öncelik listesi .NET'e adapte edildi:

### Sprint 0 — Ortam Kurulumu (1 hafta)
- `folkie_api` solution iskeleti (4 proje)
- PostgreSQL (Docker Compose)
- Clerk hesabı + JWT template
- EF Core ilk migration (tüm entity'ler)
- Basit health check endpoint
- CI: dotnet build + test

### Sprint 1 — Auth & User (1 hafta)
- Clerk webhook handler → users tablosuna sync
- JWT validation middleware
- `GET /me` endpoint
- Frontend: Clerk SignIn/SignUp + role-based redirect
- Role guards (frontend route protection + backend `[Authorize(Roles="Admin")]`)

### Sprint 2 — Onboarding (1.5 hafta)
- Influencer profile CRUD + IBAN encryption
- Brand profile CRUD
- TikTok OAuth callback handler (custom — Clerk'ten geçmeden direkt sunucuda)
- Frontend: 3-adım influencer onboarding, marka profil formu

### Sprint 3 — Marka Kampanya Akışı (2 hafta)
- Campaign CRUD (draft state)
- Campaign submit + brand_payment oluşumu
- Application listing & approve/reject
- Submission review & approve/request-revision
- Frontend: kampanya wizard formu (multi-step)

### Sprint 4 — Influencer Kampanya Akışı (1.5 hafta)
- Active campaigns listing (filtreli)
- Apply / withdraw
- Submission upload (R2 presign + form)
- Earnings page (read-only)
- Frontend: keşif sayfası, başvuru kartları

### Sprint 5 — Admin Paneli (2 hafta)
- Users management
- Campaigns oversight
- Brand payment confirmation (dekont upload)
- Influencer payment workflow (approve → transfer ref entry)
- CSV export
- Hangfire dashboard mount
- Frontend: admin layout + tablolar

### Sprint 6 — Bildirim Sistemi (1 hafta)
- Resend integration
- Notification entity + endpoint
- SignalR notifications hub
- Background job: SendEmailNotification
- Frontend: bell icon + notification list

**Toplam MVP:** ~10 hafta (2.5 ay)

---

## 15. Kararlar (Locked) ve Açık Konular

### ✅ Kesinleşmiş Kararlar

| # | Konu | Karar |
|---|---|---|
| 1 | Repo yapısı | İki yan-yana klasör: `folkie_web/` + `folkie_api/` |
| 2 | DB hosting | **Supabase Free** (sadece DB) |
| 3 | API hosting | **Contabo VPS** + Docker + Caddy |
| 4 | Auth | **Clerk Free** |
| 5 | Logging | **Serilog + Seq Community (Docker)** + **Sentry Free** error tracking |
| 6 | CI/CD | **GitHub Actions** (build + SSH deploy) |
| 7 | Frontend hosting | **Vercel Hobby** |
| 8 | Dosya depolama | **Contabo Object Storage** |
| 9 | E-posta | **Resend Free** |

### ⚠️ Hâlâ Karar Gerektiren

1. **TikTok OAuth nereden?**
   - **A) Clerk üzerinden:** Clerk dashboard'da "Custom OAuth Provider" olarak TikTok ekle. Tek kullanıcı tablosu. Setup kolay.
   - **B) Direkt sunucudan:** Folkie API'sinde `/api/v1/auth/tiktok/callback` yaz. Tam kontrol; ama Clerk session ile bağlama dansı yapman gerek.
   - 💡 Tavsiye: **A** — Clerk hem TikTok hem brand email/şifre'yi tek noktadan yönetir.

2. **Clerk dilini Türkçe yapalım mı?**
   - Clerk dashboard'tan locale = `tr-TR` seçilir → bütün UI Türkçe gelir.
   - 💡 Tavsiye: **Evet**, Türkçe locale + opsiyonel custom branding.

3. **Domain:** `folkie.com` veya benzeri sahip misin? Yoksa hangi alan adı?

4. **Contabo plan tercihi:** Cloud VPS S (€4.50, 8GB RAM, en küçük) yeterli — onaylıyor musun?

---

*Versiyon: 2.1 | Tarih: 2026-05-10 | Değişiklik: Bedava/minimum stack — Contabo + Supabase DB-only + Clerk Free*
