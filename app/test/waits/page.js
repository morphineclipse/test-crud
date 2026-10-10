"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button, Card, Typography } from "antd";

const { Title } = Typography;

function Body() {
  const sp = useSearchParams();
  const delay = Number(sp.get("delay") || 2000);
  const [text, setText] = useState("Загрузка...");
  return (
    <>
      <Button data-testid="waits-start" type="primary" onClick={() => { setText("Загрузка..."); setTimeout(() => setText("Готово"), delay); }}>Старт (delay={delay}ms)</Button>
      <div data-testid="waits-result" style={{ marginTop: 12 }}>{text}</div>
    </>
  );
}

export default function Waits() {
  return (
    <div data-testid="waits-page">
      <Card>
        <Title level={1}>Waits</Title>
        <Suspense><Body /></Suspense>
      </Card>
    </div>
  );
}
