# Folkie — Launch Punch List

**Date:** 2026-05-12
**Domain:** folkie.com.tr
**VPS:** Contabo 173.249.14.112

The full picture of what's left, organized so you can knock items off one at a time.
Sections marked **🔴 BLOCKER** must be done before you tell anyone the site exists.
Sections marked **🟡 PRE-LAUNCH** should be done before public marketing.
Sections marked **🟢 POST-LAUNCH** can ship after first users.

---

## PART 1 — 🔴 GO-LIVE (tomorrow)

The site is technically running but not reachable from the internet yet.

### 1.1 DNS — wait + verify
- [ ] Run `dig folkie.com.tr @8.8.8.8 +short` until it returns `173.249.14.112`
- [ ] Also verify `dig www.folkie.com.tr @8.8.8.8 +short` returns the same IP
- [ ] Check at https://dnschecker.org/#A/folkie.com.tr — most green

### 1.2 SSL — issue cert via certbot
```bash
certbot --nginx -d folkie.com.tr -d www.folkie.com.tr \
  --non-interactive --agree-tos \
  --email fatma.mustafa.hacioglu@gmail.com --redirect
```
- [ ] Cert issued successfully
- [ ] Open https://folkie.com.tr in browser → loads with green padlock
- [ ] HTTP → HTTPS redirect works

### 1.3 Hangfire dashboard password
- [ ] Set proper password: `htpasswd -bc /etc/nginx/.htpasswd-folkie admin 'STRONG_PASSWORD'`
- [ ] Verify by visiting https://folkie.com.tr/hangfire — browser prompts login
- [ ] Save password in password manager

### 1.4 Reboot VPS for kernel update
- [ ] `reboot` (then wait ~60s)
- [ ] `ssh root@173.249.14.112` — reconnect
- [ ] `docker compose -f /opt/folkie/folkie_api/docker-compose.prod.yml ps` — all 4 containers should auto-start

### 1.5 Clerk production webhook
- [ ] Clerk Dashboard → Webhooks → Add Endpoint
- [ ] URL: `https://folkie.com.tr/webhooks/clerk`
- [ ] Events: `user.created`, `user.updated`, `user.deleted`
- [ ] Copy Signing Secret
- [ ] On VPS: edit `/opt/folkie/folkie_api/.env` — replace `CLERK_WEBHOOK_SECRET=whsec_placeholder_...` with real value
- [ ] `docker compose -f docker-compose.prod.yml up -d --force-recreate folkie-api`
- [ ] Test: sign up a new user → check Clerk dashboard "Logs" tab → webhook should show 200 OK

### 1.6 Clerk allowed origins
- [ ] Clerk Dashboard → Domains → Add `folkie.com.tr` and `www.folkie.com.tr`
- [ ] In Clerk → API Keys → Production setup: download/copy `pk_live_…` and `sk_live_…`
- [ ] Update `.env` on VPS with live keys (still using test keys currently)
- [ ] Recreate folkie-api + folkie-web (the web build needs new publishable key)

### 1.7 Resend domain verification
- [ ] resend.com → Domains → Add `folkie.com.tr`
- [ ] Copy the 4 DNS records (SPF, DKIM, DMARC, MX)
- [ ] Add to Cloudflare DNS
- [ ] Wait for "Verified" status (5–60 min)
- [ ] Update `.env`: `RESEND_FROM=Folkie <no-reply@folkie.com.tr>`
- [ ] Recreate folkie-api

### 1.8 Production smoke test
See PART 4 — run the full smoke checklist once SSL is live.

---

## PART 2 — 🟡 PAGE-BY-PAGE AUDIT (this week)

Walk every page in a real browser. For each, verify: page loads, no console errors, all buttons do something real (not "yakında"), all links go to real pages.

### 2.1 Public pages

| Page | URL | Test |
|------|-----|------|
| Landing | `/` | All CTAs go to /register or /login. Feature cards have copy. Footer links work. |
| Sign in | `/login` | Clerk widget renders. Sign in works. Forgot password works. |
| Sign up | `/register` | Clerk widget renders. Sign up works. Phone number disabled. |
| Onboarding | `/onboarding` | Role select → routes to /brand or /creator. No redirect loop. |
| Privacy (KVKK) | `/privacy` | Full Turkish KVKK text. No lorem ipsum. |
| Terms | `/terms` | Full ToS text. Last-updated date visible. |
| 404 | `/this-does-not-exist` | Custom 404 page (not Next.js default) |

### 2.2 Marka (Brand) panel

| Page | URL | Test |
|------|-----|------|
| Dashboard | `/brand` | Stats cards have real data (active campaigns, total spent, etc). Recent activity feed works. |
| Campaigns list | `/brand/campaigns` | Lists user's campaigns. Empty state if none. Status filter works. |
| New campaign | `/brand/campaigns/new` | Multi-step form. Validates. Saves to DB. Returns ID. |
| Campaign detail | `/brand/campaigns/[id]` | Shows applications. Approve/reject buttons work. Submissions tab works. |
| Discover | `/brand/discover` | Live filter (city/category/follower range). Cards have data. Heart toggles favorite. |
| Favorites | `/brand/favorites` | Lists favorited creators. Remove works. Empty state. |
| Applications | `/brand/collaborations` | Lists incoming applications. Filters. |
| Reports | `/brand/reports` | ⚠️ Currently mock data — "yakında" badge OK or implement real |
| Messages | `/brand/messages` | Real conversations from DB. Send works. 5s polling shows new messages. |
| Settings | `/brand/settings` | Profile photo upload (Clerk). Brand info save. IBAN encrypted. Team invite "yakında" OK. |

### 2.3 Creator panel

| Page | URL | Test |
|------|-----|------|
| Dashboard | `/creator` | Stats: applications, completed, earnings. Folkie Stars badge displayed correctly. |
| Campaigns list | `/creator/campaigns` | Available campaigns. Filter by category. Apply button works. |
| Applications | `/creator/collaborations` | My pending/approved/rejected. Status badges. |
| Drafts | `/creator/drafts` | Submissions in progress. Edit/delete works. |
| Earnings | `/creator/earnings` | Payment history. Pending/paid breakdown. |
| Profile | `/creator/profile` | Avatar upload. TikTok handle. Categories. Bot detection explainer. |
| Messages | `/creator/messages` | Same as brand side. |
| Settings | `/creator/settings` | IBAN (encrypted). Notification prefs. Delete account. |

### 2.4 Shared

| Component | Test |
|-----------|------|
| Topbar bell icon | Polls /notifications every 30s. Unread count badge. Click → dropdown. Mark as read. |
| Sidebar | All items have real routes (not `#`). Folkie Stars progress real (not hardcoded 50%). |
| Avatar upload | Works on creator profile AND brand settings. Clerk setProfileImage. 5MB limit. |
| Mobile sidebar | Hamburger menu opens. Closes on link click. |
| Footer | Links to /privacy, /terms work. Social icons either work or removed. |

### 2.5 Empty placeholders to remove/implement

These come up as "yakında" or empty in current build:
- [ ] `/brand/reports` mock charts → real TikTok Business API data OR keep as preview with banner
- [ ] `/brand/settings` → "Üye Davet" → either remove or implement (team_members table)
- [ ] Sidebar items that 404 — find any link that goes to a missing page
- [ ] Any "Coming soon" badges that have no roadmap

### 2.6 Cross-cutting checks

- [ ] No `console.log` left in production code (visible in browser devtools)
- [ ] No "TODO" comments visible in rendered UI text
- [ ] No `lorem ipsum` text anywhere
- [ ] All images load (no broken image icons)
- [ ] All forms have validation messages in Turkish
- [ ] Loading states (skeletons or spinners) on every async fetch
- [ ] Error states (not blank screen) when API fails
- [ ] All dates formatted Turkish locale (12 Mayıs 2026, not May 12 2026)
- [ ] Currency formatted as `₺1.234,56` not `$1,234.56`

---

## PART 3 — 🟡 BROKEN LINK SWEEP (run scripts)

Don't trust manual clicking. Use automated tools.

### 3.1 Static link checker

On your Mac, install once:
```bash
npm install -g linkinator
```

Run against staging URL (after SSL is live):
```bash
linkinator https://folkie.com.tr --recurse --verbosity error
linkinator https://folkie.com.tr --recurse --skip "clerk.accounts.dev|sign-in|sign-up"
```

Outputs every URL that returns 4xx/5xx. Fix each, re-run until clean.

### 3.2 Lighthouse audit (per page)

In Chrome DevTools → Lighthouse → Run on each major page. Targets:
- Performance ≥ 80 (mobile), ≥ 90 (desktop)
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 90

Pages to audit individually:
- [ ] `/` (landing)
- [ ] `/brand` (logged-in brand dashboard)
- [ ] `/creator` (logged-in creator dashboard)
- [ ] `/brand/campaigns/[id]` (campaign detail with data)

### 3.3 Console error sweep

In Chrome DevTools → Console → load each major page → screenshot any red errors. Zero red errors before launch.

### 3.4 Network tab sweep

DevTools → Network → load each page → look for:
- [ ] No requests returning 4xx (except expected — e.g. /sign-in for signed-out)
- [ ] No requests returning 5xx
- [ ] No requests to localhost or 127.0.0.1 (would be a dev-mode leak)
- [ ] No requests to deprecated Supabase URLs (we moved off Supabase)

---

## PART 4 — 🟡 PRODUCTION SMOKE TEST

Run after SSL is live. Pretend you are a real user. Use **incognito window** for each scenario so you're not logged in.

### Scenario A — Brand signup → first campaign

1. [ ] Open `https://folkie.com.tr` in incognito
2. [ ] Click "Marka olarak başla" → routed to `/register`
3. [ ] Sign up with a real test email (e.g. fatma+brand@gmail.com)
4. [ ] Receive verification email (check inbox + spam)
5. [ ] Verify email → land on `/onboarding`
6. [ ] Select "Marka" role → routed to `/brand`
7. [ ] Dashboard loads, stats are zeros
8. [ ] Click "Yeni Kampanya" → routed to `/brand/campaigns/new`
9. [ ] Fill all required fields → submit
10. [ ] Campaign appears in `/brand/campaigns` with status "Active"
11. [ ] Go to `/brand/discover` → see at least 1 creator (or empty state if no creators)
12. [ ] Heart a creator → goes to `/brand/favorites`
13. [ ] `/brand/messages` → empty conversations list

### Scenario B — Creator signup → apply → submit

1. [ ] New incognito → `https://folkie.com.tr/register`
2. [ ] Sign up as creator (e.g. fatma+creator@gmail.com)
3. [ ] Select "Creator" role
4. [ ] Land on `/creator` dashboard
5. [ ] Go to `/creator/profile` → fill profile (city, categories)
6. [ ] Upload avatar → image saves
7. [ ] Browse campaigns → apply to brand's campaign from Scenario A
8. [ ] Brand sees application in `/brand/campaigns/[id]` → approves
9. [ ] Creator gets notification (bell icon shows unread)
10. [ ] Creator sees campaign in `/creator/collaborations` as "Approved"
11. [ ] Creator submits content URL → brand sees in submissions tab
12. [ ] Brand approves submission → creator's earnings update

### Scenario C — Messaging round-trip

1. [ ] Brand opens `/brand/messages` → sees creator from scenario A/B
2. [ ] Send "Test mesajı 1"
3. [ ] In second browser (creator account): `/creator/messages` → see brand
4. [ ] Open conversation → see "Test mesajı 1" within 5 seconds
5. [ ] Reply "Test mesajı 2"
6. [ ] Brand sees reply within 5 seconds

### Scenario D — Reset password

1. [ ] On `/login` → click "Şifremi unuttum"
2. [ ] Enter test email → receive reset email from Resend
3. [ ] Click link → set new password → login works

### Scenario E — Mobile (iOS Safari + Android Chrome)

1. [ ] Open `https://folkie.com.tr` on iPhone → landing renders well
2. [ ] Sign in → dashboard responsive
3. [ ] Hamburger menu opens/closes
4. [ ] Forms usable (no zoom-on-focus, keyboard not blocking inputs)
5. [ ] Same on Android Chrome

---

## PART 5 — 🟢 POST-LAUNCH FEATURES (after first users)

These were deferred. Pick up in priority order.

### 5.1 Contabo Object Storage wiring
- [ ] Storage service provisioned (you ordered, waiting to settle)
- [ ] Bucket created: `folkie-prod`
- [ ] S3 API user → access key + secret key
- [ ] Update `.env` with real `CONTABO_ACCESS_KEY` + `CONTABO_SECRET_KEY`
- [ ] Recreate folkie-api
- [ ] Test video upload from /creator/drafts → file lands in bucket
- [ ] Public read access for delivered videos

### 5.2 Gemini AI activation
- [ ] Google AI Studio → enable Gemini 2.0 Flash quota (waiting on Google)
- [ ] Once active, code automatically uses it (no deploy needed; key already in .env)
- [ ] Verify: create a campaign → check Hangfire → embedding job ran
- [ ] Discover page should show "AI uyumluluk: %X" badge after embeddings exist

### 5.3 TikTok OAuth (final feature)
- [ ] TikTok Developer App approval (waiting on TikTok)
- [ ] Once approved, add credentials to `.env`:
  - `Tiktok__ClientKey`
  - `Tiktok__ClientSecret`
  - `Tiktok__RedirectUri=https://folkie.com.tr/api/auth/tiktok/callback`
- [ ] Creator profile shows "TikTok bağla" button → OAuth flow
- [ ] Auto-imports: handle, avatar, follower count
- [ ] Hangfire job syncs stats daily

### 5.4 Bot/fake follower detector (needs TikTok data)
- [ ] Calculates fake follower score from TikTok engagement stats
- [ ] Displays badge on creator card
- [ ] Brands can filter creators by max fake %

### 5.5 i18n (Turkish + English)
- [ ] Install `next-intl`
- [ ] Extract all hardcoded Turkish strings to `messages/tr.json`
- [ ] Create `messages/en.json` with translations
- [ ] Add language switcher to topbar
- [ ] Locale-aware routes (e.g. `/en/brand`)

### 5.6 PDF reports
- [ ] `/brand/reports` → "PDF olarak indir"
- [ ] Either: backend QuestPDF or client jsPDF
- [ ] Includes campaign performance, ROI, creator breakdown

### 5.7 Multi-user team
- [ ] `team_members` table
- [ ] `team_invitations` table + email flow
- [ ] `/brand/settings` → "Üye Davet" works
- [ ] Roles: owner / admin / viewer

### 5.8 White-label / agency mode
- [ ] Custom domain support (CNAME → folkie.com.tr)
- [ ] Theme override (logo, primary color)
- [ ] Admin-set per-workspace

### 5.9 Public API
- [ ] API key auth (separate from Clerk)
- [ ] Rate limiting (per key)
- [ ] Docs page with examples
- [ ] First endpoints: list creators, create campaign

### 5.10 Performance bonus admin
- [ ] After campaign complete, admin can set bonus %
- [ ] Bonus paid out alongside base earnings

---

## PART 6 — 🟢 OPERATIONAL HARDENING

### 6.1 Backups
- [ ] Daily Postgres dump cron (added to /etc/crontab)
- [ ] Push dumps to Contabo Object Storage
- [ ] Test restore in a sandbox container monthly

### 6.2 Monitoring
- [ ] Seq dashboard reachable at https://seq.folkie.com.tr (basic-auth protected)
- [ ] Set up an error alert (e.g. Seq alert → Slack/email when ERROR rate spikes)
- [ ] Uptime monitor: https://uptimerobot.com (free) → ping /api/healthz every 5 min

### 6.3 CI/CD activation
- [ ] Push both repos to GitHub
- [ ] Add secrets to repo: `VPS_HOST`, `VPS_USER=root`, `VPS_SSH_KEY` (your private key for the VPS), `VPS_PORT=22`, plus Clerk publishable key
- [ ] Push to main → GitHub Actions auto-deploys via SSH
- [ ] Workflow files already exist at `.github/workflows/deploy.yml` in both repos

### 6.4 SSH hardening
- [ ] Disable root password login: edit `/etc/ssh/sshd_config` → `PasswordAuthentication no` (after SSH key is set)
- [ ] Create non-root user `folkie` for daily ops
- [ ] Restart sshd: `systemctl restart ssh`

### 6.5 fail2ban for nginx
- [ ] Already installed. Add nginx jail to ban abuse:
  ```
  # /etc/fail2ban/jail.d/nginx.conf
  [nginx-limit-req]
  enabled = true
  filter = nginx-limit-req
  action = iptables-multiport[name=ReqLimit, port="http,https"]
  logpath = /var/log/nginx/*error.log
  maxretry = 10
  ```
- [ ] `systemctl restart fail2ban`

### 6.6 Rate limiting
- [ ] Add nginx rate limit to API endpoints in `/etc/nginx/sites-available/folkie.com.tr`:
  ```nginx
  limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
  location /api/ {
      limit_req zone=api burst=20 nodelay;
      ...
  }
  ```

### 6.7 Cookie consent banner
- [ ] KVKK requires consent for analytics cookies
- [ ] Add banner component with accept/decline
- [ ] Don't load any third-party scripts until accepted

---

## Daily ops cheatsheet

```bash
# SSH to VPS
ssh root@173.249.14.112

# Status
docker compose -f /opt/folkie/folkie_api/docker-compose.prod.yml ps

# Logs
docker compose -f /opt/folkie/folkie_api/docker-compose.prod.yml logs -f folkie-api

# Restart one service
docker compose -f /opt/folkie/folkie_api/docker-compose.prod.yml restart folkie-api

# Rebuild & deploy after code change
cd /opt/folkie/folkie_api
./scripts/deploy.sh

# Postgres console (read carefully!)
docker exec -it folkie-postgres psql -U folkie -d folkie

# Tail nginx access log
tail -f /var/log/nginx/access.log

# Tail nginx error log
tail -f /var/log/nginx/error.log
```

---

## Priority for tomorrow (in order)

1. DNS check (2 min)
2. Certbot SSL (1 command)
3. Reboot VPS for kernel update (1 min)
4. Open https://folkie.com.tr in browser → confirm site loads with SSL
5. Run PART 4 smoke test
6. Start PART 2 page-by-page audit
7. Run PART 3 linkinator
8. Fix whatever those uncover
9. Resend domain verification
10. Clerk live keys + production webhook

Don't try to do everything tomorrow. Get to "site is live and core flow works", then iterate from real user feedback. Anything in PART 5 can wait until you have users actually asking for it.

Good night 🌙
