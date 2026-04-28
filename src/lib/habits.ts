import { Habit } from "@/src/types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const newCompletions = [...habit.completions];
  const index = newCompletions.indexOf(date);

  if (index > -1) {
    newCompletions.splice(index, 1);
  } else {
    newCompletions.push(date);
  }

  return {
    ...habit,
    completions: Array.from(new Set(newCompletions)),
  };
}
