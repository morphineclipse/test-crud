"use client";
import { Button, Card, Col, Row, Typography } from "antd";
import { AppstoreOutlined, ShoppingCartOutlined, OrderedListOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const feats = [
  { icon: <AppstoreOutlined style={{ fontSize: 28, color: "#4f46e5" }} />, title: "Каталог", text: "Поиск, фильтры, сортировка и пагинация.", href: "/products" },
  { icon: <ShoppingCartOutlined style={{ fontSize: 28, color: "#4f46e5" }} />, title: "Корзина", text: "Промокоды и оформление заказа.", href: "/cart" },
  { icon: <OrderedListOutlined style={{ fontSize: 28, color: "#4f46e5" }} />, title: "Заказы", text: "Каждый видит только свои заказы.", href: "/orders" },
];

export default function Home() {
  return (
    <div data-testid="home">
      <Card
        style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #4f46e5 60%, #7c3aed 100%)",
          border: "none",
          marginBottom: 24,
        }}
        styles={{ body: { padding: "56px 40px" } }}
      >
        <Title level={1} data-testid="home-title" style={{ color: "#fff", margin: 0 }}>
          Crud — учебный магазин
        </Title>
        <Paragraph style={{ color: "#e0e7ff", fontSize: 17, maxWidth: 560 }}>
          Мини-шоп для ручного и автоматизированного тестирования: каталог, корзина, заказы и админка.
        </Paragraph>
        <Button data-testid="home-cta" type="primary" size="large" href="/products" ghost={false} style={{ background: "#fff", color: "#4f46e5", border: "none", fontWeight: 600 }}>
          Перейти в каталог
        </Button>
      </Card>
      <Row gutter={[16, 16]}>
        {feats.map((f) => (
          <Col key={f.title} xs={24} sm={12} md={8}>
            <Card hoverable title={f.title} extra={<a href={f.href}>Открыть →</a>}>
              {f.icon}
              <Paragraph type="secondary" style={{ marginTop: 8 }}>{f.text}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
