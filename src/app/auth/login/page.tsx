import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | English Learning Platform",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  const initialError =
    error === "confirmation"
      ? "That confirmation link is invalid or has expired. Request a new email by signing up again."
      : undefined;

  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="login-heading">
        <Link className="auth-brand" href="/">
          English Learning Platform
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1 id="login-heading">Sign in to continue learning.</h1>
          <p>Use the email address and password connected to your account.</p>
        </div>
        <LoginForm initialError={initialError} />
      </section>
    </main>
  );
}
