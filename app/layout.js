import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import SiteHeader from "@/components/SiteHeader";

export const metadata = { title: "Crud — test shop", description: "Mini shop for manual/automated QA training" };

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AntdRegistry>
          <SiteHeader>{children}</SiteHeader>
        </AntdRegistry>
      </body>
    </html>
  );
}
