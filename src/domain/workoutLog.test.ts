import { generateWeek, DEFAULT_PROGRAM } from "./program";
import {
  completeSet,
  createLog,
  durationSec,
  finishLog,
  lastCompletedSet,
  threeSessionAverage,
  weeklyCompletion,
} from "./workoutLog";

describe("workout log", () => {
  const templates = generateWeek(DEFAULT_PROGRAM);
  const template = templates[0];

  it("creates pending sets from the template", () => {
    const log = createLog(template, "u1", new Date("2026-08-19T10:00:00.000Z"));
    expect(log.sets.length).toBe(template.items.reduce((n, i) => n + i.sets, 0));
    expect(log.sets.every((s) => !s.completed)).toBe(true);
  });

  it("completes a set and records duration on finish", () => {
    const start = new Date("2026-08-19T10:00:00.000Z");
    let log = createLog(template, "u1", start);
    const first = log.sets[0];
    log = completeSet(log, first.exerciseId, first.setIndex, { reps: 8, weightKg: 60 });
    expect(log.sets[0].completed).toBe(true);
    expect(log.sets[0].weightKg).toBe(60);
    const ended = new Date("2026-08-19T10:42:00.000Z");
    log = finishLog(log, ended);
    expect(log.durationSec).toBe(42 * 60);
    expect(durationSec(log.startedAt, log.endedAt!)).toBe(42 * 60);
  });

  it("counts weekly completion", () => {
    const start = new Date("2026-08-17T10:00:00.000Z");
    let log = createLog(template, "u1", start);
    log = finishLog(log, new Date("2026-08-17T10:40:00.000Z"));
    const week = weeklyCompletion([log], new Date("2026-08-19T12:00:00.000Z"), 4);
    expect(week).toEqual({ done: 1, target: 4 });
  });

  it("averages last three sessions", () => {
    const logs = [50, 60, 70].map((weight, i) => {
      let log = createLog(template, "u1", new Date(`2026-08-0${i + 1}T10:00:00.000Z`));
      const first = log.sets[0];
      log = completeSet(log, first.exerciseId, first.setIndex, { reps: 6, weightKg: weight });
      return finishLog(log, new Date(`2026-08-0${i + 1}T10:40:00.000Z`));
    });
    const exId = template.items[0].exerciseId;
    expect(lastCompletedSet(logs, exId)?.weightKg).toBe(70);
    expect(threeSessionAverage(logs, exId)?.weightKg).toBe(60);
  });
});
