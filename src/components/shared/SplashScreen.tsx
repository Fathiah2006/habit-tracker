"use client";

// ─── SplashScreen ─────────────────────────────────────────────────

export default function SplashScreen() {
  return (
    <div
      data-testid="splash-screen"
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--b-cream)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Top border strip */}
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

      {/* Bottom border strip */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          left: 0,
          right: 0,
          height: 1.5,
          background: "var(--b-black)",
        }}
      />

      {/* Marquee ticker */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          background: "var(--b-black)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="animate-marquee"
          style={{
            display: "flex",
            gap: 0,
            whiteSpace: "nowrap",
            fontFamily: "var(--font-bebas)",
            fontSize: 18,
            letterSpacing: "3px",
            color: "var(--b-cream)",
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} style={{ marginRight: 32 }}>
              HABIT TRACKER &nbsp;·&nbsp; BUILD THE STREAK &nbsp;·&nbsp; SHOW UP
              DAILY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Grid lines background */}
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

      {/* Main display */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Big label */}
        <p
          className="font-mono animate-b-fade"
          style={{
            fontSize: 9,
            letterSpacing: "5px",
            textTransform: "uppercase",
            color: "var(--b-muted)",
            marginBottom: 16,
            opacity: 0,
          }}
        >
          loading
        </p>

        {/* HABIT TRACKER in huge Bebas Neue */}
        <h1
          className="font-display animate-b-slide-up"
          style={{
            fontSize: "clamp(60px, 18vw, 96px)",
            lineHeight: 0.9,
            color: "var(--b-black)",
            margin: 0,
            opacity: 0,
          }}
        >
          HABIT
          <br />
          TRACKER
        </h1>

        {/* Blinking cursor */}
        <span
          className="animate-blink font-mono"
          style={{
            display: "inline-block",
            width: 14,
            height: 28,
            background: "var(--b-black)",
            marginTop: 16,
            verticalAlign: "bottom",
          }}
        />
      </div>

      {/* Corner marks */}
      {[
        { top: 20, left: 20 },
        { top: 20, right: 20 },
        { bottom: 64, left: 20 },
        { bottom: 64, right: 20 },
      ].map((pos, i) => (
        <svg
          key={i}
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 16 16"
          style={{ position: "absolute", ...pos, opacity: 0.3 }}
        >
          <path
            d={
              i === 0
                ? "M8,0 L0,0 L0,8"
                : i === 1
                  ? "M8,0 L16,0 L16,8"
                  : i === 2
                    ? "M0,8 L0,16 L8,16"
                    : "M16,8 L16,16 L8,16"
            }
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="2"
          />
        </svg>
      ))}
    </div>
  );
}
