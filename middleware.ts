import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/users(.*)",
  "/admin(.*)",
  "/events(.*)/discussions,",
  "/api/transactions",
]);

const isUserDashboardRoute = createRouteMatcher(["/users(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const { userId, redirectToSignIn } = await auth();

  const isAuthRoute =
    url.pathname === "/sign-in" || url.pathname === "/sign-up";

  if (!userId && isProtectedRoute(req) && !isAuthRoute) {
    return redirectToSignIn();
  }

  if (
    userId === process.env.NEXT_PUBLIC_CLERK_ADMIN_USER_ID &&
    isUserDashboardRoute(req)
  ) {
    return NextResponse.redirect(new URL("/admin", url));
  }

  if (isAuthRoute && userId) {
    const previousUrl = req.headers.get("referer") ?? "/";
    return NextResponse.redirect(new URL(previousUrl, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
