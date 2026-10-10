"use client";
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function Iframe() {
  return (
    <div data-testid="iframe-page">
      <Card>
        <Title level={1}>Iframe</Title>
        <iframe data-testid="iframe-frame" src="/test/waits?delay=500" width="400" height="200" title="inner" />
      </Card>
    </div>
  );
}
