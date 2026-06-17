import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/verify-otp", "/emergency"];
const ROLE_ROUTES: Record<string, string[]> = {
  doctor:          ["/doctor"],
  hospital_admin:  ["/admin"],
  insurance_reviewer: ["/insurance"],
  system_admin:    ["/admin"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
  const token = request.cookies.get("accessToken")?.value
    || request.headers.get("authorization")?.replace("Bearer ", "");

  // Allow public routes always
  if (isPublic) return NextResponse.next();

  // Redirect unauthenticated users
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)",
  ],
};
