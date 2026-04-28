export function calculateCurrentStreak(
  completions: string[],
  today?: string,
): number {
  if (!completions || completions.length === 0) return 0;

  const unique = Array.from(new Set(completions)).sort();
  const checkDate = today ?? new Date().toISOString().split("T")[0];

  if (!unique.includes(checkDate)) return 0;

  let streak = 0;
  let current = checkDate;

  for (let i = unique.length - 1; i >= 0; i--) {
    if (unique[i] === current) {
      streak++;
      const d = new Date(current + "T00:00:00Z");
      d.setUTCDate(d.getUTCDate() - 1);
      current = d.toISOString().split("T")[0];
    } else if (unique[i] < current) {
      break;
    }
  }

  return streak;
}
