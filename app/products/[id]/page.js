"use client";
import { useEffect, useState } from "react";
import { Button, Card, InputNumber, Space, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function ProductCard({ params }) {
  const [p, setP] = useState(null);
  const [qty, setQty] = useState(1);
  useEffect(() => {
    fetch(`/api/products/${params.id}`).then((r) => r.json()).then(setP);
  }, [params.id]);
  if (!p?.id) return <div data-testid="product-notfound">Товар не найден (404 кейс)</div>;
  return (
    <div data-testid="product-page">
      <Card>
        <Title level={1} data-testid="product-title">{p.title}</Title>
        <div data-testid="product-price"><Text strong>{p.price} ₽</Text></div>
        <div data-testid="product-stock">Остаток: {p.stock}</div>
        <Paragraph data-testid="product-desc">{p.description}</Paragraph>
        <Space>
          <InputNumber data-testid="product-qty" min={1} max={99} value={qty} onChange={(v) => setQty(v)} />
          <Button data-testid="product-add" type="primary" onClick={() => {
            if (qty < 1 || qty > 99) { alert("qty 1..99"); return; }
            if (qty > p.stock) { alert("Недостаточно stock"); return; }
            const cart = JSON.parse(localStorage.getItem("crud_cart") || "[]");
            const f = cart.find((i) => i.id === p.id);
            if (f) f.qty += qty; else cart.push({ id: p.id, title: p.title, price: p.price, qty });
            localStorage.setItem("crud_cart", JSON.stringify(cart));
            alert("Добавлено");
          }}>В корзину</Button>
        </Space>
      </Card>
    </div>
  );
}
