import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "今天不喝",
  description: "软萌饮品记录与习惯养成 App"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
