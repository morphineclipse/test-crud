import { NextResponse } from "next/server";
export async function POST(req) {
  const fd = await req.formData();
  const f = fd.get("file");
  if (!f || typeof f === "string") return NextResponse.json({ error: "file required" }, { status: 400 });
  return NextResponse.json({ ok: true, name: f.name, size: f.size, type: f.type });
}
export async function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
