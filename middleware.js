import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE = "crud_session";

function loginRedirect(req) {
  const url = new URL("/login", req.url);
  url.searchParams.set("next", "/admin");
  return NextResponse.redirect(url);
}

export async function middleware(req) {
  const token = req.cookies.get(COOKIE)?.value;
  if (!token) return loginRedirect(req);
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret-change-me")
    );
    if (payload.role !== "admin") return loginRedirect(req);
    return NextResponse.next();
  } catch {
    return loginRedirect(req);
  }
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
