import Link from "next/link";
import { apiFetch, ApiError } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";

interface MeResponse {
  id: string;
  clerkUserId: string;
  email: string;
  role: string;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
}

/**
 * /test-api — frontend ↔ backend JWT akışını test eder.
 * Server Component: Clerk JWT'sini "folkie-api" template'i ile alır,
 * backend /api/v1/me'ye Authorization: Bearer <jwt> ile çağırır,
 * dönen JSON'u ekrana basar.
 *
 * Sprint 2'de bu sayfa silinecek; profil sayfası gerçek API çağrılarını yapacak.
 */
export default async function TestApiPage() {
  let me: MeResponse | null = null;
  let error: string | null = null;
  let errorDetails: unknown = null;

  try {
    me = await apiFetch<MeResponse>(ENDPOINTS.me());
  } catch (e) {
    if (e instanceof ApiError) {
      error = `${e.message}`;
      errorDetails = e.details;
    } else {
      error = e instanceof Error ? e.message : "Bilinmeyen hata";
    }
  }

  return (
    <main className="container-folkie min-h-screen py-12">
      <Link href="/" className="text-small text-muted-foreground hover:text-primary">
        ← Ana sayfa
      </Link>
      <h1 className="mt-4">API Bağlantı Testi</h1>
      <p className="mt-2 text-small text-muted-foreground">
        Frontend → Clerk JWT → cloudflared tunnel → .NET backend → PostgreSQL
        akışını doğrular.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="card-folkie">
          <h3 className="text-body font-semibold">Ortam</h3>
          <ul className="mt-3 space-y-2 text-small text-muted-foreground">
            <li>
              <span className="font-mono text-xs">NEXT_PUBLIC_API_URL:</span>{" "}
              <code className="text-foreground">
                {process.env.NEXT_PUBLIC_API_URL}
              </code>
            </li>
            <li>
              <span className="font-mono text-xs">JWT template:</span>{" "}
              <code className="text-foreground">
                {process.env.NEXT_PUBLIC_CLERK_JWT_TEMPLATE}
              </code>
            </li>
          </ul>
        </section>

        {me && (
          <section className="card-folkie border-success/40">
            <h3 className="text-body font-semibold text-success">
              ✅ /api/v1/me başarılı
            </h3>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-caption">
              {JSON.stringify(me, null, 2)}
            </pre>
            <p className="mt-3 text-caption text-muted-foreground">
              Bu kayıt PG&apos;den geldi. Clerk webhook&apos;u kullanıcıyı{" "}
              <code>users</code> tablosuna senkronladı, JWT ile doğrulandı.
            </p>
          </section>
        )}

        {error && (
          <section className="card-folkie border-destructive/40">
            <h3 className="text-body font-semibold text-destructive">
              ❌ Hata: {error}
            </h3>
            {errorDetails ? (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-muted p-3 text-caption">
                {JSON.stringify(errorDetails, null, 2)}
              </pre>
            ) : null}
            <details className="mt-3 text-caption text-muted-foreground">
              <summary className="cursor-pointer">Olası nedenler</summary>
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>
                  Backend ayakta değil — terminal: <code>dotnet run</code>
                </li>
                <li>
                  cloudflared tunnel kapalı veya URL değişti — env güncel mi?
                </li>
                <li>
                  JWT template Clerk&apos;te oluşturulmadı — adı tam{" "}
                  <code>folkie-api</code> mı?
                </li>
                <li>
                  401: oturum yok / JWT geçersiz —{" "}
                  <Link href="/login" className="text-primary underline">
                    tekrar giriş yap
                  </Link>
                </li>
                <li>
                  404: backend webhook user.created almamış — yeniden kayıt
                  ol veya webhook&apos;u Clerk dashboard&apos;dan tetikle
                </li>
              </ul>
            </details>
          </section>
        )}
      </div>
    </main>
  );
}
