import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

const PROMOS = { QA10: 10, QA20: 20 };

async function ensureUserColumn() {
  await query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL");
}

export async function GET() {
  const s = await getSession();
  if (!s) return NextResponse.json({ error: "401 login required" }, { status: 401 });
  await ensureUserColumn();
  if (s.role === "admin") {
    const r = await query("SELECT * FROM orders ORDER BY id DESC LIMIT 20");
    return NextResponse.json(r.rows);
  }
  const r = await query(
    "SELECT * FROM orders WHERE user_id = $1 OR (user_id IS NULL AND lower(email) = lower($2)) ORDER BY id DESC LIMIT 20",
    [s.id, s.email]
  );
  return NextResponse.json(r.rows);
}

export async function POST(req) {
  const { email, promo = "", items = [] } = await req.json();
  if (!email?.includes("@")) return NextResponse.json({ error: "email должен содержать @" }, { status: 400 });
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "корзина пустая (400 кейс)" }, { status: 400 });
  for (const i of items) {
    if (!i.qty || i.qty < 1 || i.qty > 99) return NextResponse.json({ error: `qty 1..99 для ${i.title}` }, { status: 400 });
  }
  let total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const pct = PROMOS[String(promo).toUpperCase()] || 0;
  if (promo && !pct) return NextResponse.json({ error: "неверный промокод" }, { status: 400 });
  total = Math.round(total * (1 - pct / 100));
  // проверка stock
  for (const i of items) {
    const r = await query("SELECT stock FROM products WHERE id=$1", [i.id]);
    if (!r.rows[0]) return NextResponse.json({ error: `товар ${i.id} не найден` }, { status: 404 });
    if (r.rows[0].stock < i.qty) return NextResponse.json({ error: `Недостаточно stock для ${i.title}` }, { status: 409 });
  }
  await ensureUserColumn();
  const s = await getSession();
  const o = await query("INSERT INTO orders (email,user_id,total,promo,status) VALUES ($1,$2,$3,$4,'new') RETURNING *", [email, s?.id ?? null, total, promo]);
  for (const i of items) {
    await query("INSERT INTO order_items (order_id,product_id,qty,price) VALUES ($1,$2,$3,$4)", [o.rows[0].id, i.id, i.qty, i.price]);
    await query("UPDATE products SET stock = stock - $1 WHERE id=$2", [i.qty, i.id]);
  }
  return NextResponse.json(o.rows[0], { status: 201 });
}
