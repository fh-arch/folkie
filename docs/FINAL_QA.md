# Folkie — Bu Oturum Sonrası QA Notu

**Tarih:** 2026-05-12

## ✅ Bu oturumda eklenenler

| Alan | Durum |
|---|---|
| **Backend 401 fix** | List/read handlers `GetUserAsync` ile (Folkie user yoksa boş döner) |
| **AvatarUpload** (Clerk) | Profile photo değişiyor (5MB limit, PNG/JPG/WebP) |
| **AI plan Gemini** | Docs güncellendi, embedding free, scorer $0.16/100 |
| **Favorites** | Entity + 3 endpoint + frontend bind + remove butonu |
| **Creator search** | Endpoint `/brand/creators` + frontend live filter |
| **Notifications** | Service interface + 4 trigger (apply/approve/reject/submission) + bell icon + auto-poll |
| **Folkie Stars** | Badge calc service + sidebar real progress |
| **Real Messaging** | Conversation+Message entities + REST + SignalR hub + MessagingClient + polling |
| **Hangfire 4 jobs** | TikTok sync (stub), close expired, mark completed, supabase keepalive |
| **AI Gemini service** | Embedding + scorer interface implementation (key gelince devreye) |
| **KVKK + Gizlilik + Kullanım Koşulları** | Gerçek metin sayfaları |

## 📊 Backend Endpoint Sayısı
- Önceden: 28
- **Şimdi: 34** (+favorites:3, +creator search:1, +badge:1, +messaging:3, -1 yeniden düzenleme: notifications +3 root path)
- + SignalR Hub: `/hubs/messaging`

## 🗄️ DB Tabloları
1. users, 2. influencer_profiles, 3. brand_profiles, 4. brand_favorites,
5. campaigns, 6. campaign_applications, 7. content_submissions,
8. payments, 9. brand_payments, 10. reviews, 11. notifications,
12. conversations, 13. messages
**Toplam: 13 tablo**

## 🟢 Doğrulanan Sayfalar / Akışlar
*Browser'da kullanıcı tarafından test edilmeli — checklist:*

| Sayfa | Endpoint | Beklenen |
|---|---|---|
| `/brand/favorites` | GET /brand/favorites | Boş ise empty state, dolu ise grid |
| `/brand/discover` | GET /brand/creators | Live filtre ile listeleme, kalp ile favori toggle |
| `/brand/messages`, `/creator/messages` | GET /messaging/conversations + messages | Gerçek konuşma, 5sn polling |
| Bell icon (her topbar) | GET /notifications | Unread badge + mark as read |
| `/creator/profile` | Avatar upload | Clerk setProfileImage çalışıyor |
| `/brand/settings` | Avatar upload + PUT /brand/profile | İkisi de gerçekten kaydediyor |
| `/privacy`, `/terms` | — | KVKK + terms metni |

## ⏳ Hâlâ Eksik (sonraki batch'ler için)

1. **Sprint 5 deferred:**
   - Contabo Object Storage video upload (presigned PUT — service hazır, key gelince aktif)
   - TikTok OAuth + Business API stats sync (background job hazır)
   - GEMINI_API_KEY quota'sı aktive edilince AI scorer otomatik devreye
   - ✅ Resend e-posta entegrasyonu (yapıldı, EmailDispatcher Hangfire jobu)

2. **AI Faz 2 wiring** (Gemini service hazır, çağıran kod yok):
   - Campaign create sonrası embedding'i kaydet
   - Profile update sonrası embedding'i kaydet
   - DiscoverCampaigns'te semantic similarity ile re-rank
   - Reasoning'i UI'da göster

3. **i18n (next-intl)** — sadece KVKK + Terms pages şu an. Site genelinde EN dili için next-intl kurulumu gerekiyor.

4. **PDF Export raporlar** (QuestPDF backend veya jsPDF client)

5. **Multi-user team** (team_members + invitations)

6. **Performance bonus admin logic** (kampanya tamamlanınca admin manual bonus)

7. **White-label scaffold** (custom domain + theme override)

8. **Public API + API key auth + rate limit**

9. **Bot/fake follower analyzer** — TikTok API'sinden geçmiş stats çekildikten sonra hesaplanabilir

10. **TikTok content analysis** — TikTok video URL'lerini Gemini multimodal'a yollayan job

## 🐛 Bilinen Açık Bug'lar

| # | Bug | Çözüm Yolu |
|---|---|---|
| 1 | `/brand/reports` mock data (PDF export "yakında") | TikTok Business API + jsPDF (Sprint 5+) |
| 2 | Settings → Üye Davet "yakında" | team_members tablosu (Sprint 6+) |
| 3 | Onboarding'de TikTok yoksa creator için profile bilgileri eksik | TikTok OAuth (Sprint 5) |

## 🧪 Smoke Test Komutları

```bash
# Backend
curl http://localhost:5069/healthz
curl http://localhost:5069/swagger/v1/swagger.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['paths']), 'endpoint')"

# Frontend
curl -I http://localhost:3000

# DB
docker exec folkie-postgres psql -U folkie -d folkie -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;"
```

## 🔧 Sıradaki Oturum İçin

1. Contabo Object Storage keys (sen Contabo Object Storage'ı aç + access key oluştur)
2. TikTok OAuth (sen TikTok Developer onayı aldıktan sonra)
3. Gemini API key ekle → AI Faz 2 otomatik devreye
4. Final tarayıcı testi (TESTING.md ile)
5. Contabo deploy
