import type { WorkoutLog } from "./schema";
import type { DiaryEntry } from "./foodTotals";

export function exportJson(payload: unknown): string {
  return JSON.stringify(payload, null, 2);
}

export function diaryCsv(entries: DiaryEntry[]): string {
  const header = "date,meal,name,kcal,proteinG,carbG,fatG,fiberG";
  const rows = entries.map(
    (e) =>
      `${e.date},${e.meal},"${e.name.replace(/"/g, "'")}",${e.macros.kcal},${e.macros.proteinG},${e.macros.carbG},${e.macros.fatG},${e.macros.fiberG}`,
  );
  return [header, ...rows].join("\n");
}

export function workoutsCsv(logs: WorkoutLog[]): string {
  const header = "id,template,startedAt,endedAt,durationSec";
  const rows = logs.map(
    (l) => `${l.id},${l.templateName},${l.startedAt},${l.endedAt ?? ""},${l.durationSec ?? ""}`,
  );
  return [header, ...rows].join("\n");
}
