"use client";
import { useState } from "react";
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function Dnd() {
  const [msg, setMsg] = useState("Перетащи квадрат в зону");
  return (
    <div data-testid="dnd-page">
      <Card>
        <Title level={1}>Drag-n-drop</Title>
        <div data-testid="dnd-src" draggable onDragStart={(e) => e.dataTransfer.setData("text", "box")}
          style={{ width: 80, height: 80, background: "#1677ff", borderRadius: 8 }} />
        <div data-testid="dnd-dst" onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); setMsg("drop=" + e.dataTransfer.getData("text")); }}
          style={{ width: 200, height: 100, border: "2px dashed #1677ff", borderRadius: 8, marginTop: 8 }} />
        <div data-testid="dnd-result" style={{ marginTop: 12 }}>{msg}</div>
      </Card>
    </div>
  );
}
