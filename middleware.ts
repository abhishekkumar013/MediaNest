import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);
const isPublicApiRoute = createRouteMatcher(["/api/video"]);

export default clerkMiddleware((auth, req) => {
  const { userId } = auth();
  const currentUrl = new URL(req.url);
  const isHomepage = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  //   if loggedin
  if (userId && isPublicRoute(req) && !isHomepage) {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  //not loggedin
  if (!userId) {
    // If user is not logged in and trying to access a protected route
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    // If user is not logged in and trying to access a protected API
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
