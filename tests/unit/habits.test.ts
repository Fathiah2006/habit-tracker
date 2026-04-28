import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/src/lib/habits";
import type { Habit } from "@/src/types/habit";

const baseHabit: Habit = {
  id: "1",
  userId: "u1",
  name: "Drink Water",
  description: "",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: ["2024-01-01", "2024-01-02"],
};

describe("toggleHabitCompletion", () => {
  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(baseHabit, "2024-01-03");
    expect(result.completions).toContain("2024-01-03");
  });

  it("removes a completion date when the date already exists", () => {
    const result = toggleHabitCompletion(baseHabit, "2024-01-01");
    expect(result.completions).not.toContain("2024-01-01");
  });

  it("does not mutate the original habit object", () => {
    const original = [...baseHabit.completions];
    toggleHabitCompletion(baseHabit, "2024-01-03");
    expect(baseHabit.completions).toEqual(original);
  });

  it("does not return duplicate completion dates", () => {
    const habitWithDupe: Habit = {
      ...baseHabit,
      completions: ["2024-01-01", "2024-01-01"],
    };
    const result = toggleHabitCompletion(habitWithDupe, "2024-01-02");
    const unique = new Set(result.completions);
    expect(unique.size).toBe(result.completions.length);
  });
});
