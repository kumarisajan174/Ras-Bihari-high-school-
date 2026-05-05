import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isTeacherRoute = path.startsWith("/teacher");

  const adminToken = request.cookies.get("admin_token");
  const teacherToken = request.cookies.get("teacher_token");

  // Protect admin routes
  if (isAdminRoute && !adminToken && !path.includes("/admin/login")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Protect teacher routes
  if (isTeacherRoute && !teacherToken && !path.includes("/teacher/login")) {
    return NextResponse.redirect(new URL("/teacher/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
