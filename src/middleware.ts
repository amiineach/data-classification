import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Define protected and public routes
const PROTECTED_ROUTES = ["/account", "/policies", "/projects", "/"];
const PUBLIC_ROUTES = ["/login", "/sign-up"];
const LOGIN_URL = "/login";

// Function to check if a route is protected
function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

// Function to check if a route is public
function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware for non-page routes (API, assets, etc.)
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") ||
    path.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Get the authentication token from the cookies
  const token = request.cookies.get("auth-token")?.value;
  const isAuthenticated = await verifyToken(token);

  // If accessing a protected route without authentication
  if (isProtectedRoute(path) && !isAuthenticated) {
    const url = new URL(LOGIN_URL, request.url);
    url.searchParams.set("from", path);
    return NextResponse.redirect(url);
  }

  // If accessing public auth routes (login/signup) while authenticated
  if (isPublicRoute(path) && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Helper function to verify JWT token
async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    // Get JWT secret from environment variables
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback_secret"
    );

    // Verify token
    await jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

// Configure which routes this middleware should run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
