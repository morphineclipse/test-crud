import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const cat = searchParams.get("cat") || "";
  const sort = searchParams.get("sort") || "id";
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = 6;
  const offset = (page - 1) * limit;
  const order = sort === "price_asc" ? "price ASC" : sort === "price_desc" ? "price DESC" : "id ASC";
  const r = await query(
    `SELECT * FROM products WHERE title ILIKE $1 AND ($2='' OR category=$2) ORDER BY ${order} LIMIT $3 OFFSET $4`,
    [`%${q}%`, cat, limit, offset]
  );
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "401 login required" }, { status: 401 });
  if (s.role !== "admin") return NextResponse.json({ error: "403 admin only" }, { status: 403 });
  const { title, price, stock = 0, category = "misc", description = "" } = await req.json();
  if (!title || title.length < 2) return NextResponse.json({ error: "title min 2 (400 кейс)" }, { status: 400 });
  if (price == null || price < 0 || price > 1000000) return NextResponse.json({ error: "price 0..1000000" }, { status: 400 });
  if (stock < 0 || stock > 10000) return NextResponse.json({ error: "stock 0..10000" }, { status: 400 });
  const r = await query(
    "INSERT INTO products (title,price,stock,category,description) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [title, price, stock, category, description]
  );
  return NextResponse.json(r.rows[0], { status: 201 });
}
