"use client";

// ─── /login (Brutalist) ───────────────────────────────────────────────────────

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "../../components/auth/LoginForm";
import { getSession } from "../../lib/storage";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--b-cream)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top border bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "var(--b-black)",
        }}
      />

      {/* Grid background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* Large background text */}
      <span
        aria-hidden
        className="font-display"
        style={{
          position: "absolute",
          bottom: -20,
          right: -10,
          fontSize: 220,
          color: "rgba(26,26,26,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-4px",
        }}
      >
        LOGIN
      </span>

      {/* Corner bracket — bottom right */}
      <svg
        aria-hidden
        width="40"
        height="40"
        viewBox="0 0 40 40"
        style={{ position: "absolute", bottom: 24, right: 24, opacity: 0.2 }}
      >
        <path
          d="M0,20 L0,40 L20,40"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="2"
        />
      </svg>

      {/* Form */}
      <div
        style={{
          width: "100%",
          maxWidth: 360,
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: 8,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: "rgba(26,26,26,0.3)",
            marginBottom: 28,
          }}
        >
          HABIT TRACKER
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
