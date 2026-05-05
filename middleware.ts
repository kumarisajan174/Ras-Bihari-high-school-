import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Debug: log cookies
  console.log("Middleware cookies:", request.cookies.getAll());
  console.log("Path:", path);

  const isAdminRoute = path.startsWith("/admin");
  const isTeacherRoute = path.startsWith("/teacher");

  const isAdminLogin = path === "/admin/login";
  const isTeacherLogin = path === "/teacher/login";

  const adminToken = request.cookies.get("admin_token");
  const teacherToken = request.cookies.get("teacher_token");

  console.log("Admin token:", adminToken);
  console.log("Teacher token:", teacherToken);

  // Protect admin routes
  if (isAdminRoute && !adminToken && !isAdminLogin) {
    console.log("Redirecting to admin login");
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Protect teacher routes
  if (isTeacherRoute && !teacherToken && !isTeacherLogin) {
    console.log("Redirecting to teacher login");
    return NextResponse.redirect(new URL("/teacher/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*"],
};
