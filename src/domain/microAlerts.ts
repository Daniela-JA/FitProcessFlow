import { percentRdi, rdiFor, type Micros } from "./rdi";
import type { Sex } from "./schema";

const WATCH = ["vitaminD_mcg", "iron_mg", "zinc_mg"] as const;

export function microAlerts(
  rolling: Micros,
  sex: Sex,
): Array<{ key: (typeof WATCH)[number]; pct: number }> {
  const pct = percentRdi(rolling, rdiFor(sex));
  return WATCH.filter((k) => pct[k] < 50).map((k) => ({ key: k, pct: pct[k] }));
}
