export function workoutKcal(durationMin: number): number {
  return Math.round(durationMin * 8);
}

export function cardioKcal(
  minutes: number,
  intensity: "easy" | "moderate" | "hard",
): number {
  const met = intensity === "easy" ? 5 : intensity === "moderate" ? 7.5 : 10;
  return Math.round(minutes * met);
}

export function stepKcal(steps: number): number {
  return Math.round(steps * 0.04);
}
