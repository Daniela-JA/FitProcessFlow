import { emptyMacros, scaleMacros, sumMacros, type Macros } from "./macros";
import { emptyMicros, type Micros } from "./rdi";

export type DiaryEntry = {
  id: string;
  date: string;
  meal: "breakfast" | "lunch" | "dinner" | "snack";
  name: string;
  foodId?: string;
  recipeId?: string;
  grams: number;
  servings: number;
  macros: Macros;
  micros: Micros;
};

export function scaleMicros(m: Micros, factor: number): Micros {
  const out = emptyMicros();
  (Object.keys(out) as Array<keyof Micros>).forEach((k) => {
    out[k] = m[k] * factor;
  });
  return out;
}

export function sumMicros(items: Micros[]): Micros {
  return items.reduce((acc, m) => {
    const next = emptyMicros();
    (Object.keys(next) as Array<keyof Micros>).forEach((k) => {
      next[k] = acc[k] + m[k];
    });
    return next;
  }, emptyMicros());
}

export function dayTotals(entries: DiaryEntry[]): { macros: Macros; micros: Micros } {
  return {
    macros: sumMacros(entries.map((e) => e.macros)),
    micros: sumMicros(entries.map((e) => e.micros)),
  };
}

export function copyDay(entries: DiaryEntry[], fromDate: string, toDate: string, newId: () => string): DiaryEntry[] {
  return entries
    .filter((e) => e.date === fromDate)
    .map((e) => ({ ...e, id: newId(), date: toDate }));
}

export { emptyMacros, scaleMacros };
