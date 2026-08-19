import type { Macros } from "./macros";
import { microScore10, rdiFor, type Micros } from "./rdi";
import type { Sex } from "./schema";
import type { WorkoutLog } from "./schema";

function hitScore(actual: number, target: number): number {
  if (target <= 0) return 10;
  const err = Math.abs(actual - target) / target;
  return Math.round(Math.max(0, 10 * (1 - err / 0.5)) * 10) / 10;
}

function ratioScore(actual: number, target: number): number {
  if (target <= 0) return 10;
  return Math.round(Math.min(10, (actual / target) * 10) * 10) / 10;
}

export function foodScore10(input: {
  sex: Sex;
  actual: Macros & { micros: Micros };
  target: Macros;
}): number {
  const kcal = hitScore(input.actual.kcal, input.target.kcal);
  const protein = hitScore(input.actual.proteinG, input.target.proteinG);
  const micros = microScore10(input.actual.micros, rdiFor(input.sex));
  const fiber = ratioScore(input.actual.fiberG, input.target.fiberG || 28);
  return Math.round((kcal * 0.4 + protein * 0.3 + micros * 0.2 + fiber * 0.1) * 10) / 10;
}

export function trainingScore10(input: {
  isLiftDay: boolean;
  sessionCompleted: boolean;
  setsCompleted: number;
  setsPrescribed: number;
  strengthDeltaPct: number;
  steps: number;
  stepTarget: number;
  sleepHours: number;
  sleepNeeded: number;
}): number {
  const sessionMade =
    !input.isLiftDay || input.sessionCompleted ? 10 : 0;
  const quality =
    input.setsPrescribed <= 0
      ? 10
      : ratioScore(input.setsCompleted, input.setsPrescribed);
  const strength = Math.max(0, Math.min(10, 7 + input.strengthDeltaPct));
  const steps = ratioScore(input.steps, input.stepTarget);
  const sleep = ratioScore(input.sleepHours, input.sleepNeeded);
  return Math.round(((sessionMade + quality + strength + steps + sleep) / 5) * 10) / 10;
}

export function strengthDeltaPct(
  logs: WorkoutLog[],
  now: Date,
): number {
  const ended = logs.filter((l) => l.endedAt);
  if (ended.length === 0) return 0;
  const weekAgo = now.getTime() - 7 * 86400000;
  const threeAgo = now.getTime() - 21 * 86400000;
  const load = (log: WorkoutLog) =>
    log.sets.filter((s) => s.completed).reduce((n, s) => n + s.weightKg * s.reps, 0);
  const recent = ended.filter((l) => Date.parse(l.endedAt!) >= weekAgo);
  const older = ended.filter((l) => {
    const t = Date.parse(l.endedAt!);
    return t >= threeAgo && t < weekAgo;
  });
  const avg = (arr: WorkoutLog[]) =>
    arr.length ? arr.reduce((n, l) => n + load(l), 0) / arr.length : 0;
  const r = avg(recent);
  const o = avg(older);
  if (!o) return r > 0 ? 1 : 0;
  return ((r - o) / o) * 10;
}
