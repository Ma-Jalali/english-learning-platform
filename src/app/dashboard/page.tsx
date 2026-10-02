import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { SignOutButton } from "./sign-out-button";

export const metadata: Metadata = {
  title: "Dashboard | English Learning Platform",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error: claimsError } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const userId = claims?.sub;

  if (claimsError || !userId) {
    redirect("/auth/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  const email = typeof claims.email === "string" ? claims.email : "Email unavailable";
  const role = typeof profile?.role === "string" ? profile.role : "Unavailable";

  return (
    <main className="dashboard-main">
      <section className="dashboard-shell" aria-labelledby="dashboard-heading">
        <header className="dashboard-header">
          <Link className="auth-brand" href="/">
            English Learning Platform
          </Link>
          <SignOutButton />
        </header>

        <div className="dashboard-intro">
          <p className="eyebrow">Your dashboard</p>
          <h1 id="dashboard-heading">Welcome to your learning space.</h1>
          <p>This is the first protected placeholder. Course features will come later.</p>
        </div>

        <dl className="account-details">
          <div>
            <dt>Email</dt>
            <dd>{email}</dd>
          </div>
          <div>
            <dt>Profile role</dt>
            <dd>
              <span className="role-badge">{role}</span>
            </dd>
          </div>
        </dl>

        {profileError ? (
          <p className="form-message form-message-error" role="alert">
            Your account is signed in, but the profile role could not be loaded.
          </p>
        ) : null}
      </section>
    </main>
  );
}
