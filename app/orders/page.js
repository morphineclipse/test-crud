"use client";
import { useEffect, useState } from "react";
import { Button, Card, Empty, List, Result, Spin, Tag, Typography } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Orders() {
  const [items, setItems] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    fetch("/api/orders").then(async (r) => {
      if (r.status === 401) { setState("denied"); return; }
      setItems(await r.json());
      setState("ready");
    }).catch(() => setState("denied"));
  }, []);

  if (state === "loading") return <Spin style={{ margin: 32 }} />;
  if (state === "denied") {
    return (
      <div data-testid="orders-page">
        <Title level={1} data-testid="orders-title">Заказы</Title>
        <Result
          status="403"
          title="Войдите, чтобы увидеть свои заказы"
          subTitle="Каждый пользователь видит только свои заказы."
          extra={<Button type="primary" href="/login?next=/orders">Войти</Button>}
        />
      </div>
    );
  }

  return (
    <div data-testid="orders-page">
      <Title level={1} data-testid="orders-title">Мои заказы</Title>

      {items.length === 0 ? (
        <Empty description="Заказов пока нет" />
      ) : (
        <List
          dataSource={items}
          renderItem={(o) => (
            <List.Item key={o.id} data-testid={`order-${o.id}`}>
              <Card style={{ width: "100%" }} title={<><ShoppingOutlined /> Заказ #{o.id}</>}>
                <Text>{o.email}</Text> · <Text strong>{o.total} ₽</Text>
                {" "}<Tag color={o.status === "new" ? "blue" : "green"}>{o.status}</Tag>
                <Text type="secondary">{o.promo ? ` · промо ${o.promo}` : ""} · {o.created_at}</Text>
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
