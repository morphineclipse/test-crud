import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

const PRODUCTS = [
  ["Keyboard K1", 2999, 10, "tech", "Mechanical keyboard"],
  ["Mouse M1", 1499, 25, "tech", "Optical mouse"],
  ["Notebook", 499, 100, "books", "Paper notebook"],
  ["QA Handbook", 1299, 5, "books", "Manual+auto guide"],
  ["T-shirt", 999, 50, "clothes", "Cotton t-shirt"],
  ["Jeans", 3499, 0, "clothes", "Out of stock fixture"],
  ["Coffee Mug", 599, 30, "home", "Ceramic mug"],
  ["Lamp", 1999, 7, "home", "Desk lamp"],
  ["USB Cable", 299, 200, "tech", "USB-C 1m"],
  ["Backpack", 2799, 12, "clothes", "Backpack 20l"],
  ["Pen", 99, 500, "books", "Ballpoint pen"],
  ["Monitor 27", 18999, 3, "tech", "Boundary totals"],
];

export async function POST() {
  await query("TRUNCATE order_items, orders, products, users RESTART IDENTITY CASCADE");
  const ah = await bcrypt.hash("admin123", 10);
  const uh = await bcrypt.hash("user123", 10);
  await query("INSERT INTO users (email,password_hash,role) VALUES ($1,$2,'admin'),($3,$4,'user')", ["admin@test.com", ah, "user@test.com", uh]);
  for (const p of PRODUCTS) {
    await query("INSERT INTO products (title,price,stock,category,description) VALUES ($1,$2,$3,$4,$5)", p);
  }
  return NextResponse.json({ ok: true, users: ["admin@test.com", "user@test.com"] });
}

export async function GET() {
  return POST();
}
