import type { Metadata } from "next";
import Link from "next/link";

import { SignOutButton } from "@/app/dashboard/sign-out-button";

export const metadata: Metadata = {
  title: {
    default: "My learning | English Learning Platform",
    template: "%s | English Learning Platform",
  },
};

export default function LearningLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="learning-main">
      <div className="learning-shell">
        <header className="learning-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <div className="learning-header-actions">
            <Link className="button-link secondary-link" href="/dashboard">
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        </header>
        {children}
      </div>
    </main>
  );
}
