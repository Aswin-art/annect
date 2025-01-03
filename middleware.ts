import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/users(.*)",
  "/admin(.*)",
  "/events(.*)/discussions,",
  "/api(.*)",
]);

const isUserDashboardRoute = createRouteMatcher(["/users(.*)"]);

// Modify the middleware to allow access to /sign-in and /sign-up without protection
export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;

  const isAuthRoute =
    url.pathname === "/sign-in" || url.pathname === "/sign-up";

  if (!auth().userId && isProtectedRoute(req) && !isAuthRoute) {
    return auth().redirectToSignIn();
  }

  if (
    auth().userId === "user_2kyikQquTfg2j4BH2OFzS8cyf2D" &&
    isUserDashboardRoute(req)
  ) {
    return NextResponse.redirect(new URL("/admin", url));
  }

  if (isAuthRoute && auth().userId) {
    const previousUrl = req.headers.get("referer") ?? "/";
    return NextResponse.redirect(new URL(previousUrl, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
