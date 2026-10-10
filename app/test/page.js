"use client";
import { Button, Card, List, Typography } from "antd";

const { Title } = Typography;

const links = [
  { testid: "test-link-waits", href: "/test/waits", label: "waits / delays (?delay=ms)" },
  { testid: "test-link-flaky", href: "/test/flaky", label: "flaky button (50%)" },
  { testid: "test-link-alerts", href: "/test/alerts", label: "alerts / confirm / prompt" },
  { testid: "test-link-upload", href: "/test/upload", label: "file upload" },
  { testid: "test-link-dnd", href: "/test/dnd", label: "drag-n-drop" },
  { testid: "test-link-iframe", href: "/test/iframe", label: "iframe" },
];

export default function TestIndex() {
  return (
    <div data-testid="test-page">
      <Title level={1}>Тест-страницы для automation</Title>
      <Card>
        <List
          dataSource={links}
          renderItem={(l) => (
            <List.Item>
              <a data-testid={l.testid} href={l.href}>{l.label}</a>
            </List.Item>
          )}
        />
        <form action="/api/test/reset" method="post" style={{ marginTop: 12 }}>
          <Button data-testid="test-reset" type="primary" htmlType="submit">Сбросить БД к сидам (POST /api/test/reset)</Button>
        </form>
      </Card>
    </div>
  );
}
