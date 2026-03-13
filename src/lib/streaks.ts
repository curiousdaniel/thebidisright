export function shouldResetDailyStreak(
  lastPredictionDate: string | null
): boolean {
  if (!lastPredictionDate) return true;

  const last = new Date(lastPredictionDate);
  const now = new Date();

  last.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays > 1;
}

export function isSameDay(dateA: string | Date, dateB: string | Date): boolean {
  const a = new Date(dateA);
  const b = new Date(dateB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isNewDay(lastPredictionDate: string | null): boolean {
  if (!lastPredictionDate) return true;
  return !isSameDay(lastPredictionDate, new Date());
}

export function calculateStreakPoints(currentStreak: number): number {
  let points = 25;
  if (currentStreak > 0 && currentStreak % 7 === 0) {
    points += 250;
  }
  return points;
}

export function isAccuracyStreakEligible(accuracyTier: string): boolean {
  return ["bullseye", "hot_read", "good_eye"].includes(accuracyTier);
}
