import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";
import { cookies } from "next/headers";
export async function POST() {
  const COOKIE = "crud_session";
  if (!cookies().get(COOKIE)) {
    return NextResponse.json({ error: "Вы не вошли в аккаунты" }, { status: 401 });
  }
  clearSessionCookie();
  return NextResponse.json({ ok: true });
}
