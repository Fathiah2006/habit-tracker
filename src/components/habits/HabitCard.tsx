"use client";

// ─── HabitCard (Brutalist) ────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import type { Habit } from "@/src/types/habit";
import { getHabitSlug } from "@/src/lib/slug";
import { calculateCurrentStreak } from "@/src/lib/streaks";
import { toggleHabitCompletion } from "@/src/lib/habits";
import { getHabits, setHabits } from "@/src/lib/storage";

interface Props {
  habit: Habit;
  today: string;
  onUpdate: () => void;
  onEdit: (habit: Habit) => void;
}

export default function HabitCard({ habit, today, onUpdate, onEdit }: Props) {
  const slug = getHabitSlug(habit.name);
  const streak = calculateCurrentStreak(habit.completions, today);
  const completed = habit.completions.includes(today);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [stamping, setStamping] = useState(false);

  const handleToggle = useCallback(() => {
    const wasCompleted = habit.completions.includes(today);
    if (!wasCompleted) {
      setStamping(true);
      setTimeout(() => setStamping(false), 300);
    }
    const all = getHabits();
    const updated = all.map((h) =>
      h.id === habit.id ? toggleHabitCompletion(h, today) : h,
    );
    setHabits(updated);
    onUpdate();
  }, [habit, today, onUpdate]);

  function handleDelete() {
    const all = getHabits();
    const updated = all.filter((h) => h.id !== habit.id);
    setHabits(updated);
    onUpdate();
  }

  return (
    <article
      data-testid={`habit-card-${slug}`}
      style={{
        borderBottom: "1.5px solid var(--b-border)",
        padding: "18px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Streak watermark stamp ── */}
      <span
        data-testid={`habit-streak-${slug}`}
        aria-label={`${streak} day streak`}
        className="font-display"
        style={{
          position: "absolute",
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: streak >= 100 ? 96 : streak >= 10 ? 108 : 120,
          lineHeight: 1,
          color: streak > 0 ? "rgba(26,26,26,0.07)" : "rgba(26,26,26,0.04)",
          userSelect: "none",
          pointerEvents: "none",
          letterSpacing: "-4px",
          fontWeight: 900,
          transition: "color 0.3s",
        }}
      >
        {streak}
      </span>

      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* ── Completion button ── */}
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={handleToggle}
          aria-label={
            completed ? `Unmark ${habit.name}` : `Mark ${habit.name} complete`
          }
          aria-pressed={completed}
          style={{
            width: 36,
            height: 36,
            border: "1.5px solid var(--b-border)",
            background: completed ? "var(--b-black)" : "transparent",
            flexShrink: 0,
            marginTop: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "background 0.1s",
            borderRadius: 0,
          }}
        >
          {completed && (
            <span
              className={stamping ? "animate-stamp font-mono" : "font-mono"}
              style={{
                fontSize: 16,
                color: "var(--b-cream)",
                fontWeight: 700,
                lineHeight: 1,
                display: "block",
              }}
            >
              ✓
            </span>
          )}
        </button>

        {/* ── Content ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="font-display"
                style={{
                  fontSize: 22,
                  color: completed ? "var(--b-muted)" : "var(--b-black)",
                  textDecoration: completed ? "line-through" : "none",
                  textDecorationColor: "rgba(26,26,26,0.3)",
                  textDecorationThickness: "2px",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                {habit.name.toUpperCase()}
              </p>

              {habit.description && (
                <p
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--b-muted)",
                    fontStyle: "italic",
                    margin: "3px 0 0",
                    letterSpacing: "0.3px",
                  }}
                >
                  {habit.description}
                </p>
              )}
            </div>

            {/* Edit / Delete */}
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button
                data-testid={`habit-edit-${slug}`}
                onClick={() => onEdit(habit)}
                aria-label={`Edit ${habit.name}`}
                style={{
                  background: "transparent",
                  border: "1px solid var(--b-border-light)",
                  color: "var(--b-muted)",
                  fontSize: 10,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontFamily: "var(--font-mono)",
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
                ED
              </button>
              <button
                data-testid={`habit-delete-${slug}`}
                onClick={() => setConfirmDelete(true)}
                aria-label={`Delete ${habit.name}`}
                style={{
                  background: "transparent",
                  border: "1px solid var(--b-border-light)",
                  color: "var(--b-muted)",
                  fontSize: 10,
                  cursor: "pointer",
                  padding: "3px 6px",
                  fontFamily: "var(--font-mono)",
                  transition: "all 0.1s",
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#1a1a1a";
                  e.currentTarget.style.color = "#f5f0e8";
                  e.currentTarget.style.borderColor = "#1a1a1a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--b-muted)";
                  e.currentTarget.style.borderColor = "var(--b-border-light)";
                }}
              >
                DEL
              </button>
            </div>
          </div>

          {/* ── Streak label ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                letterSpacing: "2px",
                color: streak > 0 ? "var(--b-black)" : "var(--b-muted)",
                fontWeight: streak > 0 ? 700 : 400,
                textTransform: "uppercase",
              }}
            >
              {streak > 0 ? `${streak}-day streak` : "no streak yet"}
            </span>

            {streak >= 7 && (
              <span
                className="font-mono"
                style={{
                  background: "var(--b-black)",
                  color: "var(--b-cream)",
                  fontSize: 7,
                  padding: "2px 6px",
                  letterSpacing: "1.5px",
                  fontWeight: 700,
                  borderRadius: 0,
                }}
              >
                {streak >= 30 ? "30D ★" : streak >= 21 ? "21D ★" : "7D ★"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete confirmation ── */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,26,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: 24,
          }}
        >
          <div
            className="b-card animate-b-slide-up"
            style={{ maxWidth: 320, width: "100%", padding: 24 }}
          >
            <p
              className="font-display"
              style={{
                fontSize: 28,
                color: "var(--b-black)",
                margin: "0 0 8px",
              }}
            >
              DELETE HABIT?
            </p>
            <p
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--b-muted)",
                margin: "0 0 24px",
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              "{habit.name}" and all completions will be permanently removed.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmDelete(false)}
                className="b-btn-ghost"
                style={{ flex: 1 }}
              >
                CANCEL
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={handleDelete}
                style={{
                  flex: 1,
                  background: "var(--b-black)",
                  border: "1.5px solid var(--b-black)",
                  color: "var(--b-cream)",
                  fontFamily: "var(--font-bebas)",
                  fontSize: 18,
                  letterSpacing: "2px",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: 0,
                }}
              >
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
