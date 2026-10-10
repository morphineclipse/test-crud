"use client";
import { useState } from "react";
import { Button, Card, Space, Typography } from "antd";

const { Title } = Typography;

export default function Alerts() {
  const [msg, setMsg] = useState("");
  return (
    <div data-testid="alerts-page">
      <Card>
        <Title level={1}>Alerts</Title>
        <Space>
          <Button data-testid="alerts-alert" onClick={() => alert("hello alert")}>alert</Button>
          <Button data-testid="alerts-confirm" onClick={() => setMsg("confirm=" + confirm("ok?"))}>confirm</Button>
          <Button data-testid="alerts-prompt" onClick={() => setMsg("prompt=" + prompt("name?", "qa"))}>prompt</Button>
        </Space>
        <div data-testid="alerts-result" style={{ marginTop: 12 }}>{msg}</div>
      </Card>
    </div>
  );
}
