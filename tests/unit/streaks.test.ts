/* MENTOR_TRACE_STAGE3_HABIT_A91 */

import { describe, it, expect } from "vitest";
import { calculateCurrentStreak } from "@/src/lib/streaks";

describe("calculateCurrentStreak", () => {
  it("returns 0 when completions is empty", () => {
    expect(calculateCurrentStreak([], "2024-01-10")).toBe(0);
  });

  it("returns 0 when today is not completed", () => {
    expect(calculateCurrentStreak(["2024-01-09"], "2024-01-10")).toBe(0);
  });

  it("returns the correct streak for consecutive completed days", () => {
    expect(
      calculateCurrentStreak(
        ["2024-01-08", "2024-01-09", "2024-01-10"],
        "2024-01-10",
      ),
    ).toBe(3);
    expect(calculateCurrentStreak(["2024-01-10"], "2024-01-10")).toBe(1);
  });

  it("ignores duplicate completion dates", () => {
    expect(
      calculateCurrentStreak(
        ["2024-01-10", "2024-01-10", "2024-01-09"],
        "2024-01-10",
      ),
    ).toBe(2);
  });

  it("breaks the streak when a calendar day is missing", () => {
    expect(
      calculateCurrentStreak(["2024-01-08", "2024-01-10"], "2024-01-10"),
    ).toBe(1);
  });
});
