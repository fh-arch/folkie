import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
]);

export default clerkMiddleware(async (auth, req) => {
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
