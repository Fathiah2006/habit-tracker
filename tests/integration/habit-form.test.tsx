import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import HabitForm from "@/src/components/habits/HabitForm";
import HabitCard from "@/src/components/habits/HabitCard";
import HabitList from "@/src/components/habits/HabitList";
import { getHabits, setHabits, setSession } from "@/src/lib/storage";
import { getHabitSlug } from "@/src/lib/slug";
import type { Habit } from "@/src/types/habit";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

(useRouter as ReturnType<typeof vi.fn>).mockReturnValue({ replace: vi.fn() });

const TODAY = new Date().toISOString().slice(0, 10);

const mockSession = { userId: "user-1", email: "test@example.com" };

const mockHabit: Habit = {
  id: "habit-1",
  userId: "user-1",
  name: "Drink Water",
  description: "8 glasses",
  frequency: "daily",
  createdAt: "2024-01-01T00:00:00.000Z",
  completions: [],
};

beforeEach(() => {
  localStorage.clear();
  setSession(mockSession);
});

describe("habit form", () => {
  it("shows a validation error when habit name is empty", async () => {
    render(<HabitForm onSave={vi.fn()} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Habit name is required",
      );
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    const onSave = vi.fn();
    render(<HabitForm onSave={onSave} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Morning Run" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });

    const habits = getHabits();
    expect(habits.some((h) => h.name === "Morning Run")).toBe(true);

    const saved = habits.find((h) => h.name === "Morning Run")!;
    const slug = getHabitSlug("Morning Run");

    render(
      <HabitList
        habits={[saved]}
        today={TODAY}
        onUpdate={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    expect(screen.getByTestId(`habit-card-${slug}`)).toBeInTheDocument();
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    setHabits([mockHabit]);
    const onSave = vi.fn();

    render(
      <HabitForm editingHabit={mockHabit} onSave={onSave} onCancel={vi.fn()} />,
    );

    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink More Water" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => expect(onSave).toHaveBeenCalled());

    const updated = getHabits().find((h) => h.id === "habit-1")!;
    expect(updated.name).toBe("Drink More Water");
    expect(updated.id).toBe(mockHabit.id);
    expect(updated.userId).toBe(mockHabit.userId);
    expect(updated.createdAt).toBe(mockHabit.createdAt);
    expect(updated.completions).toEqual(mockHabit.completions);
  });

  it("deletes a habit only after explicit confirmation", async () => {
    setHabits([mockHabit]);
    const onUpdate = vi.fn();
    const slug = getHabitSlug(mockHabit.name);

    render(
      <HabitCard
        habit={mockHabit}
        today={TODAY}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
      />,
    );

    // Click delete — habit should still exist, confirmation dialog shown
    fireEvent.click(screen.getByTestId(`habit-delete-${slug}`));
    expect(getHabits()).toHaveLength(1);

    // Confirm deletion
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(getHabits()).toHaveLength(0);
      expect(onUpdate).toHaveBeenCalled();
    });
  });

  it("toggles completion and updates the streak display", async () => {
    setHabits([mockHabit]);
    const slug = getHabitSlug(mockHabit.name);
    const onUpdate = vi.fn();

    const { rerender } = render(
      <HabitCard
        habit={mockHabit}
        today={TODAY}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
      />,
    );

    // Streak should start at 0
    expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent("0D");

    // Toggle complete
    fireEvent.click(screen.getByTestId(`habit-complete-${slug}`));
    expect(onUpdate).toHaveBeenCalled();

    // Re-render with updated habit
    const updatedHabit = { ...mockHabit, completions: [TODAY] };
    rerender(
      <HabitCard
        habit={updatedHabit}
        today={TODAY}
        onUpdate={onUpdate}
        onEdit={vi.fn()}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId(`habit-streak-${slug}`)).toHaveTextContent(
        "1D",
      );
    });
  });
});
