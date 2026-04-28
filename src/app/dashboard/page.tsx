"use client";

// ─── /dashboard (Brutalist) ───────────────────────────────────────────────────

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/src/components/shared/ProtectedRoute";
import HabitList from "@/src/components/habits/HabitList";
import HabitForm from "@/src/components/habits/HabitForm";
import type { Habit } from "@/src/types/habit";
import type { Session } from "@/src/types/auth";
import { getSession, getHabits } from "@/src/lib/storage";
import { logout } from "@/src/lib/auth";

const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(ds: string) {
  const d = new Date(ds + "T00:00:00Z");
  return {
    day: DAY_NAMES[d.getUTCDay()],
    date: `${d.getUTCDate()} ${MONTH_NAMES[d.getUTCMonth()]}`,
  };
}

function ProgressBar({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const allDone = total > 0 && completed === total;

  return (
    <div style={{ marginBottom: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span
          className="font-display"
          style={{ fontSize: 48, lineHeight: 1, color: "var(--b-black)" }}
        >
          {completed}
          <span style={{ fontSize: 24, color: "var(--b-muted)" }}>
            /{total}
          </span>
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: 10,
            letterSpacing: "2px",
            color: allDone ? "var(--b-black)" : "var(--b-muted)",
            fontWeight: allDone ? 700 : 400,
          }}
        >
          {allDone ? "[ ALL DONE ]" : `${pct}%`}
        </span>
      </div>

      {total > 0 && (
        <div style={{ display: "flex", gap: 2, height: 8 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: "100%",
                background:
                  i < completed ? "var(--b-black)" : "rgba(26,26,26,0.12)",
                border: `1px solid ${i < completed ? "var(--b-black)" : "rgba(26,26,26,0.2)"}`,
                transition: "background 0.15s",
                borderRadius: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardInner() {
  const router = useRouter();
  const session = getSession() as Session;
  const today = getToday();
  const { day, date } = formatDate(today);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const loadHabits = useCallback(() => {
    setHabits(getHabits().filter((h) => h.userId === session.userId));
  }, [session.userId]);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  const completedCount = habits.filter((h) =>
    h.completions.includes(today),
  ).length;

  return (
    <div
      data-testid="dashboard-page"
      style={{
        minHeight: "100dvh",
        background: "var(--b-cream)",
        maxWidth: 480,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        paddingBottom: 100,
        position: "relative",
      }}
    >
      {/* ── Top border ── */}
      <div style={{ height: 6, background: "var(--b-black)", flexShrink: 0 }} />

      {/* ── Header ── */}
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1.5px solid var(--b-black)",
          position: "sticky",
          top: 0,
          background: "var(--b-cream)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <span
            className="font-mono"
            style={{
              fontSize: 8,
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "var(--b-muted)",
            }}
          >
            HABIT TRACKER
          </span>
          <button
            data-testid="auth-logout-button"
            onClick={handleLogout}
            className="font-mono"
            style={{
              background: "transparent",
              border: "1px solid var(--b-border-light)",
              fontSize: 8,
              letterSpacing: "2px",
              color: "var(--b-muted)",
              cursor: "pointer",
              padding: "4px 8px",
              textTransform: "uppercase",
              transition: "all 0.1s",
              borderRadius: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--b-black)";
              e.currentTarget.style.color = "var(--b-cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--b-muted)";
            }}
          >
            LOG OUT
          </button>
        </div>

        <div style={{ marginBottom: 12 }}>
          <p
            className="font-mono"
            style={{
              fontSize: 9,
              letterSpacing: "3px",
              color: "var(--b-muted)",
              margin: "0 0 4px",
            }}
          >
            {day} · {date}
          </p>
          <p
            className="font-display"
            style={{
              fontSize: 36,
              lineHeight: 1,
              color: "var(--b-black)",
              margin: "0 0 12px",
            }}
          >
            TODAY'S HABITS
          </p>
          {habits.length > 0 && (
            <ProgressBar completed={completedCount} total={habits.length} />
          )}
        </div>
      </header>

      {/* ── Habits ── */}
      <main
        style={{ flex: 1, padding: "0 24px", position: "relative", zIndex: 1 }}
      >
        <p
          className="font-mono"
          style={{
            fontSize: 8,
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "rgba(26,26,26,0.3)",
            padding: "14px 0 6px",
          }}
        >
          — YOUR PRACTICES —
        </p>
        <HabitList
          habits={habits}
          today={today}
          onUpdate={loadHabits}
          onEdit={(habit) => {
            setEditingHabit(habit);
            setShowForm(true);
          }}
        />
      </main>

      {/* ── Add habit CTA ── */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          padding: "12px 24px 24px",
          background:
            "linear-gradient(to top, var(--b-cream) 70%, transparent)",
          zIndex: 20,
        }}
      >
        <button
          data-testid="create-habit-button"
          onClick={() => {
            setEditingHabit(null);
            setShowForm(true);
          }}
          className="b-btn-primary"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 22 }}>+</span>
          ADD NEW HABIT
        </button>
      </div>

      {/* ── Form modal ── */}
      {showForm && (
        <HabitForm
          editingHabit={editingHabit}
          onSave={() => {
            setShowForm(false);
            setEditingHabit(null);
            loadHabits();
          }}
          onCancel={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}
