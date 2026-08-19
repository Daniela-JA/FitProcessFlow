import { composeDay } from "../domain/composeDay";
import { todayKey } from "../domain/dates";
import { useBodyStore } from "../stores/bodyStore";
import { useFoodStore } from "../stores/foodStore";
import { useWorkoutStore } from "../stores/workoutStore";

export function useToday(date = new Date()) {
  const sex = useBodyStore((s) => s.sex);
  const measurements = useBodyStore((s) => s.measurements);
  const kcalNudgePct = useBodyStore((s) => s.kcalNudgePct);
  const stepTarget = useBodyStore((s) => s.stepTarget);
  const sleepNeeded = useBodyStore((s) => s.sleepNeeded);
  const healthByDate = useBodyStore((s) => s.healthByDate);
  const cardio = useBodyStore((s) => s.cardio);
  const entries = useFoodStore((s) => s.entries);
  const logs = useWorkoutStore((s) => s.logs);
  const daysPerWeek = useWorkoutStore((s) => s.program.daysPerWeek);
  const latest = measurements[measurements.length - 1];
  const key = todayKey(date);
  const health = healthByDate[key];
  const dayCardio = cardio.filter((c) => c.date === key);
  const cardioMinutes = dayCardio.reduce((n, c) => n + c.minutes, 0);
  if (!sex || !latest) {
    return { ready: false as const, sex, latest, key };
  }
  const composed = composeDay({
    date,
    sex,
    lbmKg: latest.leanMassKg,
    kcalNudgePct,
    entries,
    logs,
    daysPerWeek,
    steps: health?.steps ?? 0,
    stepTarget,
    sleepHours: health?.sleepHours ?? 0,
    sleepNeeded,
    cardioMinutes,
    cardioIntensity: dayCardio[0]?.intensity ?? "easy",
  });
  return { ready: true as const, sex, latest, key, ...composed };
}
