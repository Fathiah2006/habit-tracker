"use client";

// ─── HabitList (Brutalist) ────────────────────────────────────────────────────

import type { Habit } from "../../types/habit";
import HabitCard from "./HabitCard";

interface Props {
  habits: Habit[];
  today: string;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitList({ habits, today, onUpdate, onEdit }: Props) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        style={{
          padding: "48px 0 64px",
          textAlign: "center",
          position: "relative",
        }}
      >
        {/* Big crossed box */}
        <div
          style={{
            width: 80,
            height: 80,
            border: "1.5px solid var(--b-black)",
            margin: "0 auto 24px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* X lines */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            aria-hidden
            style={{ position: "absolute", inset: 0 }}
          >
            <line
              x1="0"
              y1="0"
              x2="80"
              y2="80"
              stroke="rgba(26,26,26,0.1)"
              strokeWidth="1"
            />
            <line
              x1="80"
              y1="0"
              x2="0"
              y2="80"
              stroke="rgba(26,26,26,0.1)"
              strokeWidth="1"
            />
          </svg>
          <span
            className="font-display"
            style={{
              fontSize: 28,
              color: "rgba(26,26,26,0.2)",
              position: "relative",
              zIndex: 1,
            }}
          >
            0
          </span>
        </div>

        <p
          className="font-display"
          style={{
            fontSize: 32,
            color: "var(--b-black)",
            margin: "0 0 8px",
            letterSpacing: "2px",
          }}
        >
          NO HABITS YET.
        </p>

        <p
          className="font-mono"
          style={{
            fontSize: 10,
            color: "var(--b-muted)",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: 28,
          }}
        >
          — add your first below —
        </p>

        {/* Decorative rule */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            justifyContent: "center",
            opacity: 0.25,
          }}
        >
          <div
            style={{ width: 32, height: 1.5, background: "var(--b-black)" }}
          />
          <div
            style={{
              width: 6,
              height: 6,
              border: "1.5px solid var(--b-black)",
              transform: "rotate(45deg)",
            }}
          />
          <div
            style={{ width: 32, height: 1.5, background: "var(--b-black)" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {habits.map((habit, i) => (
        <div
          key={habit.id}
          className="animate-snap-in"
          style={{ opacity: 0, animationDelay: `${i * 0.05}s` }}
        >
          <HabitCard
            habit={habit}
            today={today}
            onUpdate={onUpdate}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
