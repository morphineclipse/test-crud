"use client";
import { useEffect, useState } from "react";
import { Button, Card, Form, Input, InputNumber, Result, Space, Spin, Table, Typography } from "antd";

const { Title } = Typography;

export default function Admin() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");
  const [auth, setAuth] = useState("loading");
  const [form, setForm] = useState({ title: "", price: 100, stock: 10, category: "misc", description: "" });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.role === "admin") {
          setAuth("admin");
          load();
        } else {
          setAuth("denied");
        }
      })
      .catch(() => setAuth("denied"));
  }, []);

  function load() { fetch("/api/products?sort=id").then((r) => r.json()).then(setItems); }

  async function create() {
    const r = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) }),
    });
    const j = await r.json();
    setMsg(r.ok ? "Создан id=" + j.id : "Ошибка " + r.status + ": " + j.error);
    load();
  }

  async function remove(id) {
    const r = await fetch(`/api/products/${id}`, { method: "DELETE" });
    setMsg(r.ok ? "Удален " + id : "Ошибка " + r.status);
    load();
  }

  if (auth === "loading") return <Spin data-testid="admin-loading" style={{ margin: 32 }} />;
  if (auth === "denied") {
    return (
      <div data-testid="admin-page">
        <Result
          data-testid="admin-denied"
          status="403"
          title="403 — только для администратора"
          subTitle="Войдите под учетной записью с ролью admin."
          extra={<Button data-testid="admin-login-link" type="primary" href="/login?next=/admin">Войти</Button>}
        />
      </div>
    );
  }

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Название", dataIndex: "title", key: "title" },
    { title: "Цена", dataIndex: "price", key: "price" },
    { title: "Остаток", dataIndex: "stock", key: "stock" },
    {
      title: "Действия",
      key: "actions",
      render: (_, p) => (
        <Button data-testid={`admin-delete-${p.id}`} danger onClick={() => remove(p.id)}>Удалить</Button>
      ),
    },
  ];

  return (
    <div data-testid="admin-page">
      <Title level={1} data-testid="admin-title">Админка</Title>
      <Card title="Новый товар" style={{ marginBottom: 16 }}>
        <Form layout="inline" style={{ rowGap: 12 }}>
          <Form.Item label="Название">
            <Input data-testid="admin-title-input" placeholder="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Form.Item>
          <Form.Item label="Цена">
            <InputNumber data-testid="admin-price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
          </Form.Item>
          <Form.Item label="Остаток">
            <InputNumber data-testid="admin-stock" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
          </Form.Item>
          <Form.Item label="Категория">
            <Input data-testid="admin-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </Form.Item>
          <Form.Item label="Описание">
            <Input data-testid="admin-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Form.Item>
          <Form.Item>
            <Button data-testid="admin-create" type="primary" onClick={create}>Создать</Button>
          </Form.Item>
        </Form>
      </Card>
      <div data-testid="admin-msg" style={{ marginBottom: 12 }}>{msg}</div>
      <Table
        data-testid="admin-table"
        dataSource={items}
        columns={columns}
        rowKey="id"
        pagination={false}
        onRow={(p) => ({ "data-testid": `admin-row-${p.id}` })}
      />

    </div>
  );
}
