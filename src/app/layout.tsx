import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Learning Platform",
  description: "Teacher-designed English learning courses and student portfolios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>{children}</body>
    </html>
  );
}
