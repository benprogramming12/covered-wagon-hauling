import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  // Redirect non-www to www
  if (host === "coveredwagonhauling.com") {
    const url = req.nextUrl.clone();
    url.host = "www.coveredwagonhauling.com";
    return NextResponse.redirect(url, 301);
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAdminPath = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPath = req.nextUrl.pathname === "/admin/login";

  if (isAdminPath && !isLoginPath && !token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
