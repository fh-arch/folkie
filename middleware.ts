import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { getSession } from "@/lib/superadmin/auth";

const isSuperAdminRoute = createRouteMatcher(["/superleo(.*)"]);
const isSuperAdminPublic = createRouteMatcher(["/superleo/login"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/admin-login",
  "/api/webhooks/(.*)",
  "/blog(.*)",
  "/about",
  "/contact",
  "/careers",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/kvkk",
  "/superleo(.*)",   // handled separately below
]);

export default clerkMiddleware(async (auth, req) => {
  // ── Super admin routes — custom session, no Clerk ──
  if (isSuperAdminRoute(req)) {
    if (isSuperAdminPublic(req)) return NextResponse.next();
    const session = await getSession();
    if (!session) {
      return NextResponse.redirect(new URL("/superleo/login", req.url));
    }
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Authenticated users hitting the landing page go straight to their dashboard
  if (userId && req.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
