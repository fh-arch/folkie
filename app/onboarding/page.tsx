import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/clerk/role";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const role = await getCurrentUserRole();
  if (role === "influencer") redirect("/creator");
  if (role === "brand") redirect("/brand");
  if (role === "admin") redirect("/admin");
  return <OnboardingClient />;
}
