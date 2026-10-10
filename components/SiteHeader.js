"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button, ConfigProvider, Layout, Menu, Space, Typography } from "antd";
import { LogoutOutlined, ShopOutlined } from "@ant-design/icons";
import ruRU from "antd/locale/ru_RU";

const { Header, Content, Footer } = Layout;

export default function SiteHeader({ children }) {
  const [me, setMe] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => setMe(j && j.email ? j : null))
      .catch(() => setMe(null));
  }, [pathname]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    router.push("/login");
  }

  const items = [
    { key: "/products", label: <a data-testid="nav-products" href="/products">Каталог</a> },
    { key: "/cart", label: <a data-testid="nav-cart" href="/cart">Корзина</a> },
    { key: "/orders", label: <a data-testid="nav-orders" href="/orders">Заказы</a> },
    ...(me?.role === "admin"
      ? [{ key: "/admin", label: <a data-testid="nav-admin" href="/admin">Админка</a> }]
      : []),
    ...(!me
      ? [{
        key: "/login",
        label: <a data-testid="nav-login" href="/login">Вход</a>,
      }]
      : []),
  ];

  const selected = "/" + (pathname || "/").split("/")[1];

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: "#4f46e5",
          borderRadius: 8,
          fontSize: 15,
        },
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          data-testid="header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "0 20px",
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#1e1b4b",
          }}
        >
          <a
            data-testid="nav-home"
            href="/products"
            style={{ color: "#fff", fontWeight: 800, fontSize: 22, display: "flex", alignItems: "center", gap: 8 }}
          >
            <ShopOutlined /> Crud
          </a>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selected]}
            items={items}
            style={{ flex: 1, minWidth: 0, background: "transparent" }}
          />
          {me && (
            <Space>
              <Typography.Text style={{ color: "#c7d2fe" }}>{me.role === "admin" ? "admin" : me.email}</Typography.Text>
              <Button icon={<LogoutOutlined />} size="small" ghost onClick={logout}>
                Выйти
              </Button>
            </Space>
          )}
        </Header>
        <Content style={{ padding: "28px 20px" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto" }}>
            <main data-testid="main">{children}</main>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <Typography.Text type="secondary">Crud — учебный магазин для QA</Typography.Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  );
}
