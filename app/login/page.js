"use client";
import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Form, Input, Tabs, Typography } from "antd";

const { Title } = Typography;

async function post(path, body) {
  const r = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  return { r, j };
}

function LoginTab({ next }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function submit() {
    const { r, j } = await post("/api/auth/login", { email, password });
    if (!r.ok) { setMsg((j.error || "")); return; }
    setMsg("OK: " + JSON.stringify(j));
    router.push(next);
  }

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input data-testid="login-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </Form.Item>
        <Form.Item label="Пароль">
          <Input.Password data-testid="login-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="пароль" />
        </Form.Item>
        <Button data-testid="login-submit" type="primary" block onClick={submit}>Войти</Button>
      </Form>
      <div data-testid="login-msg" style={{ marginTop: 12 }}>{msg}</div>
    </>
  );
}

function RegisterTab({ next }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function submit() {
    const { r, j } = await post("/api/auth/register", { email, password });
    if (!r.ok) { setMsg((j.error || "")); return; }
    setMsg("OK: " + JSON.stringify(j));
    router.push(next);
  }

  return (
    <>
      <Form layout="vertical">
        <Form.Item label="Email">
          <Input data-testid="register-email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        </Form.Item>
        <Form.Item label="Пароль">
          <Input.Password data-testid="register-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="пароль" />
        </Form.Item>
        <Button data-testid="register-submit" type="primary" block onClick={submit}>Зарегистрироваться</Button>
      </Form>
      <div data-testid="register-msg" style={{ marginTop: 12 }}>{msg}</div>
    </>
  );
}

function LoginForm() {
  const sp = useSearchParams();
  const next = sp.get("next") || "/products";
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const found = cookies.some((c) => c.startsWith("crud_session="));
    setHasSession(found);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "calc(100vh - 120px)" }}>
      <Card style={{ maxWidth: 440, width: "100%" }}>
        <Title level={2} data-testid="login-title" style={{ marginTop: 0 }}>Вход в Crud</Title>
        <Tabs
          defaultActiveKey="login"
          items={[
            { key: "login", label: "Вход", children: <LoginTab next={next} /> },
            { key: "register", label: "Регистрация", children: <RegisterTab next={next} /> },
          ]}
        />
        {hasSession && (
          <Button data-testid="logout-submit" block style={{ marginTop: 12 }} onClick={logout}>
            Выйти
          </Button>
        )}
      </Card>
    </div>
  );
}
export default function Login() {
  return (
    <div data-testid="login-page">
      <Suspense><LoginForm /></Suspense>
    </div>
  );
}
