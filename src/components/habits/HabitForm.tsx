"use client";

// ─── HabitForm (Brutalist) ────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import type { Habit } from "@/src/types/habit";
import type { Session } from "@/src/types/auth";
import { validateHabitName } from "@/src/lib/validators";
import { getHabits, setHabits, getSession } from "@/src/lib/storage";

const MAX = 60;

interface Props {
  editingHabit?: Habit | null;
  onSave: () => void;
  onCancel: () => void;
}

export default function HabitForm({ editingHabit, onSave, onCancel }: Props) {
  const [name, setName] = useState(editingHabit?.name ?? "");
  const [description, setDescription] = useState(
    editingHabit?.description ?? "",
  );
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (editingHabit) {
      setName(editingHabit.name);
      setDescription(editingHabit.description);
    }
  }, [editingHabit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);
    if (!validation.valid) {
      setNameError(validation.error);
      return;
    }

    setNameError(null);
    const session = getSession() as Session;
    const all = getHabits();

    if (editingHabit) {
      setHabits(
        all.map((h) =>
          h.id === editingHabit.id
            ? {
                ...h,
                name: validation.value,
                description: description.trim(),
                frequency: "daily" as const,
              }
            : h,
        ),
      );
    } else {
      setHabits([
        ...all,
        {
          id: nanoid(),
          userId: session.userId,
          name: validation.value,
          description: description.trim(),
          frequency: "daily" as const,
          createdAt: new Date().toISOString(),
          completions: [],
        },
      ]);
    }
    onSave();
  }

  const nameLen = name.length;
  const nearLimit = nameLen >= MAX * 0.8;
  const atLimit = nameLen >= MAX;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,26,26,0.7)",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        zIndex: 40,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div
        data-testid="habit-form"
        className="animate-b-slide-up"
        style={{
          width: "100%",
          maxWidth: 480,
          background: "var(--b-cream)",
          border: "1.5px solid var(--b-black)",
          borderBottom: "none",
          padding: "28px 24px 32px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <h2
            className="font-display"
            style={{
              fontSize: 28,
              color: "var(--b-black)",
              margin: 0,
              letterSpacing: "2px",
            }}
          >
            {editingHabit ? "EDIT HABIT" : "NEW HABIT"}
          </h2>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="font-mono"
            style={{
              background: "transparent",
              border: "1.5px solid var(--b-border)",
              color: "var(--b-black)",
              fontSize: 12,
              cursor: "pointer",
              padding: "4px 8px",
              borderRadius: 0,
              fontWeight: 700,
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--b-black)";
              e.currentTarget.style.color = "var(--b-cream)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--b-black)";
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <label
                htmlFor="habit-name"
                className="b-label"
                style={{ marginBottom: 0 }}
              >
                HABIT NAME *
              </label>
              <span
                className="font-mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "1px",
                  color: atLimit
                    ? "#c00"
                    : nearLimit
                      ? "#996600"
                      : "var(--b-muted)",
                  transition: "color 0.2s",
                }}
              >
                {nameLen}/{MAX}
              </span>
            </div>
            <input
              id="habit-name"
              data-testid="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              placeholder="e.g. Drink Water"
              className="b-input"
              maxLength={MAX}
              style={{ textTransform: "uppercase" }}
              aria-describedby={nameError ? "habit-name-error" : undefined}
              aria-invalid={!!nameError}
            />
            {nameError && (
              <p
                id="habit-name-error"
                role="alert"
                className="font-mono animate-shake"
                style={{
                  fontSize: 10,
                  color: "#c00",
                  marginTop: 6,
                  letterSpacing: "0.5px",
                  fontWeight: 700,
                }}
              >
                ! {nameError}
              </p>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="habit-description" className="b-label">
              DESCRIPTION (OPTIONAL)
            </label>
            <input
              id="habit-description"
              data-testid="habit-description-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. drink at least 8 glasses"
              className="b-input"
            />
          </div>

          {/* Frequency */}
          <div style={{ marginBottom: 28 }}>
            <label htmlFor="habit-frequency" className="b-label">
              FREQUENCY
            </label>
            <select
              id="habit-frequency"
              data-testid="habit-frequency-select"
              value="daily"
              disabled
              onChange={() => {}}
              className="b-input"
            >
              <option value="daily">Daily</option>
            </select>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={onCancel}
              className="b-btn-ghost"
              style={{ flex: 1 }}
            >
              CANCEL
            </button>
            <button
              data-testid="habit-save-button"
              type="submit"
              className="b-btn-primary"
              style={{ flex: 2 }}
            >
              {editingHabit ? "SAVE CHANGES" : "ADD HABIT →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
