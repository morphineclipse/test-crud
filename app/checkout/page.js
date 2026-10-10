"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, Form, Input, Space, Typography } from "antd";

const { Title } = Typography;

function FormBody() {
  const sp = useSearchParams();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  async function submit() {
    const cart = JSON.parse(localStorage.getItem("crud_cart") || "[]");
    const r = await fetch("/api/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, promo: sp.get("promo") || "", items: cart }),
    });
    const j = await r.json();
    if (!r.ok) setMsg("Ошибка: " + (j.error || r.status));
    else { setMsg(`Заказ #${j.id} на ${j.total} ₽ создан`); localStorage.setItem("crud_cart", "[]"); }
  }
  return (
    <Card style={{ maxWidth: 480 }}>
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input data-testid="checkout-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </Form.Item>
        <Space>
          <Button data-testid="checkout-submit" type="primary" onClick={submit}>Создать заказ</Button>
        </Space>
      </Form>
      <div data-testid="checkout-msg" style={{ marginTop: 12 }}>{msg}</div>
    </Card>
  );
}

export default function Checkout() {
  return (
    <div data-testid="checkout-page">
      <Title level={1} data-testid="checkout-title">Оформление</Title>
      <Suspense><FormBody /></Suspense>
    </div>
  );
}
