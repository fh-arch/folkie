import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield, LogIn, LogOut, AlertCircle } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { SignOutButton, SignInButton } from "@clerk/nextjs";
import { getCurrentUserRole } from "@/lib/clerk/role";

export default async function AdminLoginPage() {
  const { userId } = await auth();
  const role = userId ? await getCurrentUserRole() : null;

  // Already admin → straight to dashboard
  if (role === "admin") redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="card-folkie p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
            <Shield className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mt-4 text-h2">Folkie Admin</h1>
          <p className="mt-2 text-small text-muted-foreground">
            Super admin paneli — sadece Folkie ekibi içindir.
          </p>

          {!userId ? (
            <>
              <p className="mt-6 text-small">
                Giriş yapmak için admin hesabını kullan.
              </p>
              <SignInButton
                mode="redirect"
                forceRedirectUrl="/admin"
                signUpForceRedirectUrl="/admin"
              >
                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-body font-semibold text-primary-foreground hover:bg-primary/90">
                  <LogIn className="h-4 w-4" />
                  Admin Olarak Giriş Yap
                </button>
              </SignInButton>
            </>
          ) : (
            <>
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-small font-semibold text-destructive">
                    Bu hesap admin değil
                  </p>
                  <p className="mt-1 text-caption text-foreground/70">
                    Şu an{" "}
                    <span className="font-mono">{role ?? "rol yok"}</span>{" "}
                    rolüyle giriş yaptın. Admin paneline erişmek için{" "}
                    <strong>çıkış yapıp admin hesabınla tekrar gir</strong>{" "}
                    veya bu hesabı admin olarak yetkilendirmen gerekir.
                  </p>
                </div>
              </div>

              <SignOutButton redirectUrl="/admin-login">
                <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-body font-semibold text-primary-foreground hover:bg-primary/90">
                  <LogOut className="h-4 w-4" />
                  Çıkış Yap ve Admin Olarak Gir
                </button>
              </SignOutButton>

              <Link
                href={role === "brand" ? "/brand" : role === "influencer" ? "/creator" : "/"}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-small hover:border-primary"
              >
                Normal Panele Dön
              </Link>
            </>
          )}

          <div className="mt-6 border-t border-border pt-4 text-caption text-muted-foreground">
            Yardım için{" "}
            <a
              href="mailto:destek@folkie.com.tr"
              className="text-primary hover:underline"
            >
              destek@folkie.com.tr
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
