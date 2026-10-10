import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  if (!email?.includes("@") || !password || password.length < 4)
    return NextResponse.json({ error: "email должен содержать @  минимальное кол-во символов в пароле - 4" }, { status: 400 });
  const hash = await bcrypt.hash(password, 10);
  try {
    const r = await query("INSERT INTO users (email, password_hash, role) VALUES ($1,$2,'user') RETURNING id,email,role", [email, hash]);
    await setSessionCookie(r.rows[0]);
    return NextResponse.json(r.rows[0], { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "email уже занят" }, { status: 409 });
  }
}
