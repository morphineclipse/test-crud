"use client";
import { useEffect, useState } from "react";
import { Button, Card, Empty, Input, InputNumber, List, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [promo, setPromo] = useState("");
  useEffect(() => { setCart(JSON.parse(localStorage.getItem("crud_cart") || "[]")); }, []);
  function save(c) { setCart(c); localStorage.setItem("crud_cart", JSON.stringify(c)); }
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div data-testid="cart-page">
      <Title level={1} data-testid="cart-title">Корзина</Title>

      {cart.length === 0 ? (
        <Empty data-testid="cart-empty" description="Пусто" />
      ) : (
        <List
          dataSource={cart}
          renderItem={(i) => (
            <List.Item key={i.id} data-testid={`cart-item-${i.id}`}>
              <Card style={{ width: "100%" }}>
                <Space wrap>
                  <Text>{i.title} — {i.price} ₽ ×</Text>
                  <InputNumber
                    data-testid={`cart-qty-${i.id}`}
                    min={1}
                    max={99}
                    value={i.qty}
                    onChange={(v) => save(cart.map((c) => c.id === i.id ? { ...c, qty: v } : c))}
                  />
                  <Button data-testid={`cart-remove-${i.id}`} danger onClick={() => save(cart.filter((c) => c.id !== i.id))}>Удалить</Button>
                </Space>
              </Card>
            </List.Item>
          )}
        />
      )}

      {cart.length > 0 && (
        <Card title="Оформление" style={{ marginTop: 16 }}>
          <Title level={3} data-testid="cart-total" style={{ marginTop: 0 }}>Итого: {total} ₽</Title>
          <Space wrap>
            <Input data-testid="cart-promo" placeholder="Промокод" value={promo} onChange={(e) => setPromo(e.target.value)} style={{ width: 200 }} />
            <Button data-testid="cart-checkout" type="primary" href={`/checkout?promo=${promo}`}>Оформить</Button>
            <Button data-testid="cart-clear" onClick={() => save([])}>Очистить</Button>
          </Space>
        </Card>
      )}
    </div>
  );
}
