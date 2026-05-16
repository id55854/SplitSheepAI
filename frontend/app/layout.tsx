import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beach Worth Going — Split",
  description:
    "Live beach conditions for Split, Croatia. Crowd, water quality, sea temp, wind and waves on one map.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
