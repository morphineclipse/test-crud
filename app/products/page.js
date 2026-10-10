"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Input, Row, Select, Space, Tag, Typography } from "antd";

const { Title, Text } = Typography;

export default function Products() {
  const router = useRouter();

  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [sort, setSort] = useState("id");
  const [page, setPage] = useState(1);

  async function load() {
    const p = new URLSearchParams({ q, cat, sort, page: String(page) });
    const r = await fetch(`/api/products?${p}`);
    setItems(await r.json());
  }
  useEffect(() => { load(); }, [page]);

  function addToCart(p) {
    const cart = JSON.parse(localStorage.getItem("crud_cart") || "[]");
    const f = cart.find((i) => i.id === p.id);
    if (f) f.qty += 1;
    else cart.push({ id: p.id, title: p.title, price: p.price, qty: 1 });
    localStorage.setItem("crud_cart", JSON.stringify(cart));
    alert("В корзине: " + cart.reduce((s, i) => s + i.qty, 0));
  }

  return (
    <div data-testid="products-page">
      <Title level={1} data-testid="products-title">Каталог</Title>
      <Card title="Фильтры" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input data-testid="products-search" placeholder="Поиск" value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 200 }} />
          <Select
            data-testid="products-category"
            value={cat}
            onChange={setCat}
            style={{ width: 140 }}
            options={[
              { value: "", label: "Все" },
              { value: "tech", label: "tech" },
              { value: "books", label: "books" },
              { value: "clothes", label: "clothes" },
              { value: "home", label: "home" },
              { value: "misc", label: "misc" },
            ]}
          />
          <Select
            data-testid="products-sort"
            value={sort}
            onChange={setSort}
            style={{ width: 140 }}
            options={[
              { value: "id", label: "По id" },
              { value: "price_asc", label: "Дешевле" },
              { value: "price_desc", label: "Дороже" },
            ]}
          />
          <Button data-testid="products-apply" type="primary" onClick={() => { setPage(1); load(); }}>Найти</Button>
        </Space>
      </Card>
      <div data-testid="products-list">
        <Row gutter={[16, 16]}>
          {items.map((p) => (
            <Col key={p.id} xs={24} sm={12} md={8}>
              <Card
                hoverable
                data-testid={`product-${p.id}`}
                title={p.title}
                onClick={() => router.push(`/products/${p.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div data-testid={`product-price-${p.id}`}>
                  <Text strong style={{ fontSize: 18 }}>{p.price} ₽</Text>
                  {" "}<Tag>{p.category}</Tag>
                  <div>Остаток: <span data-testid={`product-stock-${p.id}`}>{p.stock}</span></div>
                </div>
                <Button
                  data-testid={`product-add-${p.id}`}
                  type="primary"
                  block
                  onClick={(e) => {
                    e.stopPropagation();   // ← не даём клику всплыть до Card
                    addToCart(p);
                  }}
                  disabled={p.stock === 0}
                  style={{ marginTop: 8 }}
                >
                  {p.stock === 0 ? "Нет в наличии" : "В корзину"}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Space style={{ marginTop: 16 }}>
        <Button data-testid="products-prev" onClick={() => setPage((x) => Math.max(1, x - 1))}>Назад</Button>
        <Text data-testid="products-page"> Стр. {page} </Text>
        <Button data-testid="products-next" onClick={() => setPage((x) => x + 1)}>Вперед</Button>
      </Space>
    </div>
  );
}
