import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mock Tive Sender",
  description: "Generate and send test Tive webhook payloads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

