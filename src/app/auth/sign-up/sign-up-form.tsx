"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { createClient } from "@/lib/supabase/client";

function getSignUpError(code?: string) {
  switch (code) {
    case "weak_password":
      return "Choose a stronger password and try again.";
    case "user_already_exists":
      return "An account may already exist for this email. Try signing in instead.";
    case "signup_disabled":
      return "New account registration is currently unavailable.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many requests were made. Please wait a moment and try again.";
    default:
      return "We could not create your account. Please try again.";
  }
}

export function SignUpForm() {
  const router = useRouter();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmationPassword = String(
      formData.get("confirmation-password") ?? "",
    );

    if (password !== confirmationPassword) {
      setErrorMessage("The passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const confirmUrl = new URL("/auth/confirm", window.location.origin);
      confirmUrl.searchParams.set("next", "/dashboard");

      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: confirmUrl.toString(),
        },
      });

      if (error) {
        setErrorMessage(getSignUpError(error.code));
        setIsSubmitting(false);
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
        router.refresh();
        return;
      }

      setSubmittedEmail(email);
      setIsSubmitting(false);
    } catch {
      setErrorMessage("We could not reach the sign-up service. Check your connection and try again.");
      setIsSubmitting(false);
    }
  }

  if (submittedEmail) {
    return (
      <div className="auth-success" role="status">
        <div className="success-mark" aria-hidden="true">
          ✓
        </div>
        <h2>Check your email</h2>
        <p>
          We sent a confirmation link to <strong>{submittedEmail}</strong>. Open it
          in this browser to finish creating your account.
        </p>
        <p className="auth-note">If it is not in your inbox, check your spam folder.</p>
        <Link className="button-link secondary-link" href="/auth/login">
          Return to sign in
        </Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="field-group">
        <label htmlFor="email">Email address</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div className="field-group">
        <label htmlFor="password">Password</label>
        <input
          aria-describedby="password-hint"
          autoComplete="new-password"
          id="password"
          minLength={8}
          name="password"
          required
          type="password"
        />
        <p className="field-hint" id="password-hint">
          Use at least 8 characters.
        </p>
      </div>

      <div className="field-group">
        <label htmlFor="confirmation-password">Confirm password</label>
        <input
          autoComplete="new-password"
          id="confirmation-password"
          minLength={8}
          name="confirmation-password"
          required
          type="password"
        />
      </div>

      {errorMessage ? (
        <p className="form-message form-message-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button className="auth-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creating account…" : "Create account"}
      </button>

      <p className="auth-footer">
        Already have an account? <Link href="/auth/login">Sign in</Link>
      </p>
    </form>
  );
}
