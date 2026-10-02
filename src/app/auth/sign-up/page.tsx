import type { Metadata } from "next";
import Link from "next/link";

import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Create an account | English Learning Platform",
};

export default function SignUpPage() {
  return (
    <main className="auth-main">
      <section className="auth-card" aria-labelledby="sign-up-heading">
        <Link className="auth-brand" href="/">
          English Learning Platform
        </Link>
        <div className="auth-heading">
          <p className="eyebrow">Start learning</p>
          <h1 id="sign-up-heading">Create your student account.</h1>
          <p>Use an email address you can open to confirm your account.</p>
        </div>
        <SignUpForm />
      </section>
    </main>
  );
}
