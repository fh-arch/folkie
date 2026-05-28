/**
 * Folkie — runtime route & API health test
 *
 * Usage:
 *   CLERK_TOKEN=<your-bearer-token> node scripts/test-routes.mjs
 *
 * Get a token: open DevTools on folkie.com.tr while logged in →
 *   Application → Cookies → __session  (or run in console:
 *   await window.Clerk.session.getToken())
 *
 * Optional env:
 *   BASE_URL=https://folkie.com.tr   (default: https://folkie.com.tr)
 *   API_URL=https://folkie.com.tr    (default: same as BASE_URL)
 */

const BASE_URL = process.env.BASE_URL ?? "https://folkie.com.tr";
const API_URL  = process.env.API_URL  ?? BASE_URL;
const TOKEN    = process.env.CLERK_TOKEN ?? "";

const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const RESET  = "\x1b[0m";
const BOLD   = "\x1b[1m";

let passed = 0, failed = 0, warned = 0;
const failures = [];

async function get(url, opts = {}) {
  try {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "FolkieTestBot/1.0", ...opts.headers },
      signal: AbortSignal.timeout(10_000),
    });
    return { status: res.status, ok: res.ok };
  } catch (e) {
    return { status: 0, ok: false, error: e.message };
  }
}

async function apiGet(path, expectStatus = 200) {
  return await get(`${API_URL}${path}`, {
    headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  });
}

function report(label, status, expected, note = "") {
  const ok = Array.isArray(expected) ? expected.includes(status) : status === expected;
  const icon = ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  const statusColor = ok ? GREEN : RED;
  const statusStr = status === 0 ? `${RED}TIMEOUT/ERROR${RESET}` : `${statusColor}${status}${RESET}`;
  console.log(`  ${icon}  ${label.padEnd(55)} ${statusStr}${note ? `  ${YELLOW}${note}${RESET}` : ""}`);
  if (ok) passed++;
  else {
    failed++;
    failures.push(`${label}: got ${status}, expected ${expected}`);
  }
}

function section(name) {
  console.log(`\n${BOLD}${CYAN}── ${name} ${"─".repeat(Math.max(0, 55 - name.length))}${RESET}`);
}

// ─── PUBLIC PAGES ──────────────────────────────────────────────────────────
section("Public pages (no auth)");
const publicPages = [
  ["/",                      [200, 301, 302], "landing"],
  ["/hakkimizda",            200],
  ["/iletisim",              200],
  ["/kariyer",               200],
  ["/gizlilik",              200],
  ["/kvkk",                  200],
  ["/kullanim-kosullari",    200],
  ["/cerez-politikasi",      200],
  ["/blog",                  200],
  ["/llms.txt",              200],
  ["/sitemap.xml",           200],
  ["/robots.txt",            200],
];
for (const [path, expected, note] of publicPages) {
  const r = await get(`${BASE_URL}${path}`);
  report(`GET ${path}`, r.status, expected, note ?? "");
}

// ─── AUTH PAGES (should not 500 — 200, 302, 307, 404 all acceptable) ────────
section("Auth pages (unauthenticated — must not 500)");
const authPages = [
  "/giris",
  "/kayit",
  "/onboarding",
  "/dashboard",
  "/marka",
  "/marka/kampanyalar",
  "/marka/kampanyalar/yeni",
  "/marka/ayarlar",
  "/marka/kesfet",
  "/marka/favoriler",
  "/marka/mesajlar",
  "/marka/raporlar",
  "/creator",
  "/creator/profil",
  "/creator/kampanyalar",
  "/creator/taslaklar",
  "/creator/kazanc",
  "/creator/mesajlar",
  "/creator/ayarlar",
];
for (const path of authPages) {
  const r = await get(`${BASE_URL}${path}`);
  // 200 (Clerk SSR), 302/307 (redirect to login), 404 (unexpected) — anything but 500
  const ok = r.status !== 500 && r.status !== 0;
  const icon = ok ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  const statusColor = r.status >= 500 ? RED : r.status >= 400 ? YELLOW : GREEN;
  console.log(`  ${icon}  GET ${path.padEnd(50)} ${statusColor}${r.status}${RESET}`);
  if (ok) passed++;
  else {
    failed++;
    failures.push(`GET ${path}: got ${r.status} (server crash)`);
  }
}

// ─── API HEALTH (no auth — expect 401, not 500) ────────────────────────────
section("API endpoints — no auth (expect 401, not 500)");
const unauthEndpoints = [
  "/api/v1/me",
  "/api/v1/brand/profile",
  "/api/v1/brand/campaigns",
  "/api/v1/creator/profile",
  "/api/v1/creator/campaigns",
  "/api/v1/messaging/conversations",
  "/api/v1/notifications",
];
for (const path of unauthEndpoints) {
  const r = await get(`${API_URL}${path}`);
  report(`GET ${path}`, r.status, 401);
}

// ─── API ENDPOINTS — authenticated ────────────────────────────────────────
if (!TOKEN) {
  console.log(`\n${YELLOW}⚠  CLERK_TOKEN not set — skipping authenticated API tests.${RESET}`);
  console.log(`   Set it with: CLERK_TOKEN=$(curl ...) node scripts/test-routes.mjs`);
} else {
  section("API endpoints — authenticated (expect 200 or 404)");

  const authHeaders = { Authorization: `Bearer ${TOKEN}` };
  const authGet = (path) => get(`${API_URL}${path}`, { headers: authHeaders });

  async function check(label, path, expected) {
    const r = await authGet(path);
    report(label, r.status, expected);
  }

  await check("GET /api/v1/me",                       "/api/v1/me",                       200);
  await check("GET /api/v1/brand/profile",            "/api/v1/brand/profile",            [200, 404]);
  await check("GET /api/v1/brand/campaigns",          "/api/v1/brand/campaigns",          [200, 403]);
  await check("GET /api/v1/creator/profile",          "/api/v1/creator/profile",          [200, 403, 404]);
  await check("GET /api/v1/creator/campaigns",        "/api/v1/creator/campaigns",        [200, 403]);
  await check("GET /api/v1/creator/applications",     "/api/v1/creator/applications",     [200, 403]);
  await check("GET /api/v1/creator/submissions",      "/api/v1/creator/submissions",      [200, 403]);
  await check("GET /api/v1/brand/creators",           "/api/v1/brand/creators",           [200, 403]);
  await check("GET /api/v1/brand/favorites",          "/api/v1/brand/favorites",          [200, 403]);
  await check("GET /api/v1/messaging/conversations",  "/api/v1/messaging/conversations",  [200, 403]);
  await check("GET /api/v1/notifications",            "/api/v1/notifications",            [200, 403]);
}

// ─── KNOWN EXTERNAL LINKS audit ────────────────────────────────────────────
section("External links referenced in app");
const externalLinks = [
  ["https://accounts.folkie.com.tr/user",   "Clerk custom domain (may fail until DNS verified)"],
  ["https://folkie.com.tr",                  "Main domain"],
  ["https://www.folkie.com.tr",              "www redirect"],
];
for (const [url, note] of externalLinks) {
  const r = await get(url);
  const ok = r.status > 0 && r.status < 500;
  const icon = ok ? `${GREEN}✓${RESET}` : `${YELLOW}⚠${RESET}`;
  const statusColor = r.status >= 500 || r.status === 0 ? RED : r.status >= 400 ? YELLOW : GREEN;
  console.log(`  ${icon}  ${url.padEnd(50)} ${statusColor}${r.status || "FAIL"}${RESET}  ${YELLOW}${note}${RESET}`);
  if (!ok) warned++;
}

// ─── SUMMARY ───────────────────────────────────────────────────────────────
console.log(`\n${"═".repeat(70)}`);
console.log(`${BOLD}RESULTS:  ${GREEN}${passed} passed${RESET}  ${failed > 0 ? RED : ""}${failed} failed${RESET}  ${warned > 0 ? YELLOW : ""}${warned} warnings${RESET}`);
if (failures.length > 0) {
  console.log(`\n${RED}${BOLD}FAILURES:${RESET}`);
  failures.forEach((f) => console.log(`  ${RED}✗${RESET} ${f}`));
}
console.log(`${"═".repeat(70)}\n`);
process.exit(failed > 0 ? 1 : 0);
