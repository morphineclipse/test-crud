"use client";
import { useState } from "react";
import { Button, Card, Typography } from "antd";

const { Title } = Typography;

export default function Upload() {
  const [msg, setMsg] = useState("");
  async function send(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const r = await fetch("/api/test/upload", { method: "POST", body: fd });
    setMsg(JSON.stringify(await r.json()));
  }
  return (
    <div data-testid="upload-page">
      <Card>
        <Title level={1}>Upload</Title>
        <form onSubmit={send}>
          <input data-testid="upload-input" type="file" name="file" />
          <div style={{ marginTop: 12 }}>
            <Button data-testid="upload-submit" type="primary" htmlType="submit">Загрузить</Button>
          </div>
        </form>
        <div data-testid="upload-result" style={{ marginTop: 12 }}>{msg}</div>
      </Card>
    </div>
  );
}
