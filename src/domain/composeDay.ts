import { cardioKcal, stepKcal, workoutKcal } from "./energy";
import { foodScore10, strengthDeltaPct, trainingScore10 } from "./scores";
import { targetsFromLbm } from "./macros";
import { dayTotals, type DiaryEntry } from "./foodTotals";
import { isIsoWeekdayLiftDay, todayKey } from "./dates";
import type { WorkoutLog } from "./schema";
import type { Sex } from "./schema";

export function composeDay(input: {
  date: Date;
  sex: Sex;
  lbmKg: number;
  kcalNudgePct: number;
  entries: DiaryEntry[];
  logs: WorkoutLog[];
  daysPerWeek: number;
  steps: number;
  stepTarget: number;
  sleepHours: number;
  sleepNeeded: number;
  cardioMinutes: number;
  cardioIntensity: "easy" | "moderate" | "hard";
}) {
  const dateKey = todayKey(input.date);
  const dayEntries = input.entries.filter((e) => e.date === dateKey);
  const totals = dayTotals(dayEntries);
  const dayLogs = input.logs.filter((l) => (l.endedAt ?? l.startedAt).startsWith(dateKey));
  const workoutMin = dayLogs.reduce((n, l) => n + (l.durationSec ?? 0) / 60, 0);
  const target = targetsFromLbm(input.lbmKg, {
    proteinGPerKg: 2.4,
    fatGPerKg: 0.9,
    workoutKcal: workoutKcal(workoutMin),
    cardioKcal: cardioKcal(input.cardioMinutes, input.cardioIntensity),
    stepKcal: stepKcal(input.steps),
    nudgePct: input.kcalNudgePct,
  });
  const isLiftDay = isIsoWeekdayLiftDay(input.date, input.daysPerWeek);
  const session = dayLogs[0];
  const setsPrescribed = session?.sets.length ?? 0;
  const setsCompleted = session?.sets.filter((s) => s.completed).length ?? 0;
  const food = foodScore10({
    sex: input.sex,
    actual: { ...totals.macros, micros: totals.micros },
    target,
  });
  const training = trainingScore10({
    isLiftDay,
    sessionCompleted: Boolean(session?.endedAt),
    setsCompleted,
    setsPrescribed,
    strengthDeltaPct: strengthDeltaPct(input.logs, input.date),
    steps: input.steps,
    stepTarget: input.stepTarget,
    sleepHours: input.sleepHours,
    sleepNeeded: input.sleepNeeded,
  });
  return { dateKey, totals, target, food, training, isLiftDay };
}
