"use client";
import { useState } from "react";
import { Button, Card, Typography } from "antd";

const { Title } = Typography;

export default function Flaky() {
  const [msg, setMsg] = useState("Жми");
  return (
    <div data-testid="flaky-page">
      <Card>
        <Title level={1}>Flaky</Title>
        <Button data-testid="flaky-btn" type="primary" onClick={() => setMsg(Math.random() < 0.5 ? "Успех" : "Флейк-ошибка, жми еще")}>Жми меня</Button>
        <div data-testid="flaky-result" style={{ marginTop: 12 }}>{msg}</div>
      </Card>
    </div>
  );
}
