# Folkie — Contabo VPS Deployment Guide

Single-server, all-Docker production deployment.

## Topology

```
                    folkie.com.tr  (Cloudflare DNS A → Contabo IP)
                            │
                  ┌─────────▼─────────┐
                  │      Caddy 2      │  ports 80/443 (auto TLS via Let's Encrypt)
                  └─────────┬─────────┘
            ┌───────────────┼────────────────┐
            ▼               ▼                ▼
      /api → 5069     /hubs → 5069       /  → 3000
     folkie-api       folkie-api        folkie-web
      (.NET 8)         (SignalR)         (Next.js)
            │
            ▼
       postgres:5432       seq:80 (logs)
```

All five containers share the `folkie` Docker network. Only Caddy exposes ports 80/443 publicly.

## 1. Provision the Contabo VPS

Recommended: Cloud VPS L (8 vCPU, 30 GB RAM, Ubuntu 22.04 LTS).

```bash
# As root on first boot
adduser folkie
usermod -aG sudo folkie
rsync --archive --chown=folkie:folkie ~/.ssh /home/folkie

apt update && apt -y upgrade
apt -y install ca-certificates curl gnupg ufw fail2ban

# Docker
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" \
  > /etc/apt/sources.list.d/docker.list
apt update && apt -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
usermod -aG docker folkie

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
```

## 2. DNS

Cloudflare (or your registrar) — for `folkie.com.tr`:

| Type | Name | Value          | Proxy        |
|------|------|----------------|--------------|
| A    | @    | <VPS_IPv4>     | DNS only (gri) |
| A    | www  | <VPS_IPv4>     | DNS only (gri) |
| A    | seq  | <VPS_IPv4>     | DNS only (gri) |

Keep "DNS only" for the first deploy so Caddy can complete the HTTP-01 challenge. Once SSL is live you can switch to proxied (orange) if desired.

## 3. Code

```bash
sudo -iu folkie
mkdir -p /opt/folkie && cd /opt/folkie

git clone git@github.com:<you>/folkie_api.git
git clone git@github.com:<you>/folkie_web.git

cd folkie_api
cp .env.production.example .env
nano .env   # fill in everything
```

Required secrets in `.env`:
- `POSTGRES_PASSWORD`, `SEQ_ADMIN_PASSWORD` — generate strong ones
- `CLERK_*` — LIVE keys from Clerk dashboard
- `GEMINI_API_KEY` — once quota enabled
- `RESEND_API_KEY` + `RESEND_FROM` — verified domain
- `CONTABO_*` — bucket + access key from Contabo Object Storage panel
- `HANGFIRE_BASIC_AUTH_HASH` — generate with:
  ```bash
  docker run --rm caddy:2-alpine caddy hash-password --plaintext 'yourpassword'
  ```

## 4. Update Clerk Dashboard

In Clerk dashboard → Webhooks:
- Endpoint URL: `https://folkie.com.tr/webhooks/clerk`
- Events: `user.created`, `user.updated`, `user.deleted`
- Copy signing secret → put in `.env` as `CLERK_WEBHOOK_SECRET`

Allowed origins:
- `https://folkie.com.tr`
- `https://www.folkie.com.tr`

## 5. First deploy

```bash
cd /opt/folkie/folkie_api
./scripts/deploy.sh
```

The script:
1. `git pull` both repos
2. Builds `folkie-api` and `folkie-web` images
3. Brings up the stack with `docker compose -f docker-compose.prod.yml up -d`
4. Migrations auto-apply on API boot via `DbInitializer`

Wait ~60s, then check:

```bash
docker compose -f docker-compose.prod.yml ps
curl -I https://folkie.com.tr
curl https://folkie.com.tr/api/healthz
```

## 6. Smoke test

| Check | Expected |
|---|---|
| `https://folkie.com.tr` | Landing loads, HTTPS green |
| `https://folkie.com.tr/api/healthz` | `200 OK` |
| `https://folkie.com.tr/sign-up` | Clerk widget renders |
| Sign up → onboarding → /brand veya /creator | Flow works |
| Bell icon on dashboard | Returns notifications |
| `https://seq.folkie.com.tr` | Logs flowing |

## 7. Updates

```bash
cd /opt/folkie/folkie_api
./scripts/deploy.sh
```

Zero-downtime is **not** guaranteed on a single host — there is a brief restart window. For real zero-downtime, add a second backend instance and have Caddy load-balance.

## 8. Backups

Daily Postgres dump to a Contabo Object Storage bucket — add to crontab:

```bash
0 3 * * * docker exec folkie-postgres pg_dump -U folkie folkie | gzip > /opt/folkie/backups/folkie-$(date +\%F).sql.gz
0 4 * * * find /opt/folkie/backups -name "*.sql.gz" -mtime +14 -delete
```

Optional: rclone push to Contabo bucket after the dump.

## 9. Common ops

```bash
# Tail all logs
docker compose -f docker-compose.prod.yml logs -f

# Tail API only
docker compose -f docker-compose.prod.yml logs -f folkie-api

# Restart one service
docker compose -f docker-compose.prod.yml restart folkie-api

# Rebuild only frontend
docker compose -f docker-compose.prod.yml build folkie-web && \
  docker compose -f docker-compose.prod.yml up -d folkie-web

# Psql into prod DB (read carefully before anything destructive)
docker exec -it folkie-postgres psql -U folkie -d folkie
```

## 10. Rollback

Images aren't versioned by tag yet (latest only). To roll back:

```bash
cd /opt/folkie/folkie_api && git checkout <last-good-sha>
cd /opt/folkie/folkie_web && git checkout <last-good-sha>
cd /opt/folkie/folkie_api && ./scripts/deploy.sh
```

Future improvement: tag images per release and add a `FOLKIE_RELEASE` var to compose.
