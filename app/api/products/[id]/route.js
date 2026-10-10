import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(_, { params }) {
  const r = await query("SELECT * FROM products WHERE id=$1", [params.id]);
  if (!r.rows[0]) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(r.rows[0]);
}

export async function PUT(req, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "401" }, { status: 401 });
  if (s.role !== "admin") return NextResponse.json({ error: "403 admin only" }, { status: 403 });
  const { title, price, stock, category, description } = await req.json();
  const r = await query(
    "UPDATE products SET title=COALESCE($1,title), price=COALESCE($2,price), stock=COALESCE($3,stock), category=COALESCE($4,category), description=COALESCE($5,description) WHERE id=$6 RETURNING *",
    [title, price, stock, category, description, params.id]
  );
  if (!r.rows[0]) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json(r.rows[0]);
}

export async function DELETE(_, { params }) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "401" }, { status: 401 });
  if (s.role !== "admin") return NextResponse.json({ error: "403 admin only" }, { status: 403 });
  await query("DELETE FROM products WHERE id=$1", [params.id]);
  return NextResponse.json({ ok: true });
}
