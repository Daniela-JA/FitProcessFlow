import { createId } from "./ids";
import type { WorkoutLog, WorkoutTemplate } from "./schema";

export function startOfIsoWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function createLog(
  template: WorkoutTemplate,
  userId: string,
  startedAt: Date = new Date(),
): WorkoutLog {
  return {
    id: createId("log"),
    userId,
    templateId: template.id,
    templateName: template.name,
    startedAt: startedAt.toISOString(),
    sets: template.items.flatMap((item) =>
      Array.from({ length: item.sets }, (_, setIndex) => ({
        exerciseId: item.exerciseId,
        variantId: item.variantId,
        setIndex,
        reps: item.reps,
        weightKg: 0,
        completed: false,
      })),
    ),
  };
}

export function completeSet(
  log: WorkoutLog,
  exerciseId: string,
  setIndex: number,
  payload: { reps: number; weightKg: number },
): WorkoutLog {
  return {
    ...log,
    sets: log.sets.map((set) =>
      set.exerciseId === exerciseId && set.setIndex === setIndex
        ? {
            ...set,
            reps: payload.reps,
            weightKg: payload.weightKg,
            completed: true,
          }
        : set,
    ),
  };
}

export function durationSec(startedAt: string, endedAt: string): number {
  const start = Date.parse(startedAt);
  const end = Date.parse(endedAt);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return Math.round((end - start) / 1000);
}

export function finishLog(log: WorkoutLog, endedAt: Date = new Date()): WorkoutLog {
  const ended = endedAt.toISOString();
  return {
    ...log,
    endedAt: ended,
    durationSec: durationSec(log.startedAt, ended),
  };
}

export function weeklyCompletion(
  logs: WorkoutLog[],
  weekStart: Date,
  targetSessions: number,
): { done: number; target: number } {
  const start = startOfIsoWeek(weekStart).getTime();
  const end = start + 7 * 24 * 60 * 60 * 1000;
  const done = logs.filter((log) => {
    if (!log.endedAt) return false;
    const t = Date.parse(log.endedAt);
    return t >= start && t < end;
  }).length;
  return { done, target: targetSessions };
}

export function lastCompletedSet(
  logs: WorkoutLog[],
  exerciseId: string,
): { reps: number; weightKg: number } | null {
  const finished = logs.filter((l) => l.endedAt);
  for (let i = finished.length - 1; i >= 0; i -= 1) {
    const match = [...finished[i].sets]
      .reverse()
      .find((s) => s.exerciseId === exerciseId && s.completed);
    if (match) return { reps: match.reps, weightKg: match.weightKg };
  }
  return null;
}

export function threeSessionAverage(
  logs: WorkoutLog[],
  exerciseId: string,
): { reps: number; weightKg: number } | null {
  const samples: { reps: number; weightKg: number }[] = [];
  const finished = [...logs].filter((l) => l.endedAt).reverse();
  for (const log of finished) {
    const sets = log.sets.filter((s) => s.exerciseId === exerciseId && s.completed);
    if (sets.length === 0) continue;
    const last = sets[sets.length - 1];
    samples.push({ reps: last.reps, weightKg: last.weightKg });
    if (samples.length === 3) break;
  }
  if (samples.length === 0) return null;
  return {
    reps: round1(samples.reduce((a, s) => a + s.reps, 0) / samples.length),
    weightKg: round1(samples.reduce((a, s) => a + s.weightKg, 0) / samples.length),
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
