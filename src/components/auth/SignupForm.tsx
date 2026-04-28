"use client";

// ─── SignupForm (Brutalist) ───────────────────────────────────────────────────

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signup } from "@/src/lib/auth";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    const result = signup(email, password);
    if (result.success) {
      router.replace("/dashboard");
    } else {
      setError(result.error ?? null);
      setLoading(false);
    }
  }

  return (
    <div className="animate-b-slide-up">
      <h1
        className="font-display"
        style={{
          fontSize: 64,
          lineHeight: 0.9,
          color: "var(--b-black)",
          margin: "0 0 4px",
        }}
      >
        SIGN
        <br />
        UP.
      </h1>
      <p
        className="font-mono"
        style={{
          fontSize: 9,
          letterSpacing: "3px",
          color: "var(--b-muted)",
          marginBottom: 32,
          textTransform: "uppercase",
        }}
      >
        create your account
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="signup-email" className="b-label">
            EMAIL
          </label>
          <input
            id="signup-email"
            data-testid="auth-signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="person@example.com"
            className="b-input"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label htmlFor="signup-password" className="b-label">
            PASSWORD
          </label>
          <input
            id="signup-password"
            data-testid="auth-signup-password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="input password"
            className="b-input"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="animate-shake"
            style={{
              border: "1.5px solid #c00",
              padding: "10px 12px",
              marginBottom: 16,
              display: "flex",
              gap: 8,
              alignItems: "center",
              background: "rgba(200,0,0,0.04)",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 10,
                color: "#c00",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              !
            </span>
            <p
              className="font-mono"
              style={{
                fontSize: 11,
                color: "#c00",
                margin: 0,
                letterSpacing: "0.3px",
              }}
            >
              {error}
            </p>
          </div>
        )}

        <button
          data-testid="auth-signup-submit"
          type="submit"
          disabled={loading}
          className="b-btn-primary"
          style={{ marginBottom: 20, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "CREATING..." : "CREATE ACCOUNT →"}
        </button>
      </form>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          opacity: 0.3,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "var(--b-black)" }} />
        <span
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: "2px" }}
        >
          OR
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--b-black)" }} />
      </div>

      <p
        className="font-mono"
        style={{
          fontSize: 10,
          color: "var(--b-muted)",
          textAlign: "center",
          letterSpacing: "0.5px",
        }}
      >
        HAVE AN ACCOUNT?{" "}
        <Link
          href="/login"
          style={{
            color: "var(--b-black)",
            textDecoration: "underline",
            fontWeight: 700,
          }}
        >
          LOG IN
        </Link>
      </p>
    </div>
  );
}
