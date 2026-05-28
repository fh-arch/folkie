import { redirect } from "next/navigation";
import { getCurrentUserRole, isOnboardingCompleted } from "@/lib/clerk/role";

/**
 * /dashboard — kullanıcının role'üne göre doğru panele yönlendirir.
 * Onboarding tamamlanmamışsa /onboarding'e gönderir.
 */
export default async function DashboardRouter() {
  const role = await getCurrentUserRole();
  if (!role) redirect("/onboarding");

  const completed = await isOnboardingCompleted();
  if (!completed) redirect("/onboarding");

  switch (role) {
    case "influencer":
      redirect("/creator");
    case "brand":
      redirect("/brand");
    case "admin":
      redirect("/admin");
  }
}
