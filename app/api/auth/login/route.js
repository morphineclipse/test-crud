import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  const r = await query("SELECT * FROM users WHERE email=$1", [email]);
  const u = r.rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash)))
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 });
  await setSessionCookie({ id: u.id, email: u.email, role: u.role });
  return NextResponse.json({ id: u.id, email: u.email, role: u.role });
}
