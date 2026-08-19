import type { Sex } from "./schema";

export type Micros = {
  vitaminA_mcg: number;
  vitaminC_mg: number;
  vitaminD_mcg: number;
  vitaminE_mg: number;
  vitaminK_mcg: number;
  thiamin_mg: number;
  riboflavin_mg: number;
  niacin_mg: number;
  vitaminB6_mg: number;
  folate_mcg: number;
  vitaminB12_mcg: number;
  calcium_mg: number;
  iron_mg: number;
  magnesium_mg: number;
  potassium_mg: number;
  zinc_mg: number;
};

export const emptyMicros = (): Micros => ({
  vitaminA_mcg: 0,
  vitaminC_mg: 0,
  vitaminD_mcg: 0,
  vitaminE_mg: 0,
  vitaminK_mcg: 0,
  thiamin_mg: 0,
  riboflavin_mg: 0,
  niacin_mg: 0,
  vitaminB6_mg: 0,
  folate_mcg: 0,
  vitaminB12_mcg: 0,
  calcium_mg: 0,
  iron_mg: 0,
  magnesium_mg: 0,
  potassium_mg: 0,
  zinc_mg: 0,
});

export function rdiFor(sex: Sex): Micros {
  return {
    vitaminA_mcg: 900,
    vitaminC_mg: 90,
    vitaminD_mcg: 20,
    vitaminE_mg: 15,
    vitaminK_mcg: sex === "female" ? 90 : 120,
    thiamin_mg: 1.2,
    riboflavin_mg: 1.3,
    niacin_mg: 16,
    vitaminB6_mg: 1.7,
    folate_mcg: 400,
    vitaminB12_mcg: 2.4,
    calcium_mg: 1300,
    iron_mg: sex === "female" ? 18 : 8,
    magnesium_mg: sex === "female" ? 320 : 420,
    potassium_mg: 4700,
    zinc_mg: sex === "female" ? 8 : 11,
  };
}

export function percentRdi(actual: Micros, rdi: Micros): Record<keyof Micros, number> {
  const out = {} as Record<keyof Micros, number>;
  (Object.keys(rdi) as Array<keyof Micros>).forEach((k) => {
    const den = rdi[k] || 1;
    out[k] = Math.min(999, Math.max(0, (actual[k] / den) * 100));
  });
  return out;
}

export function microScore10(actual: Micros, rdi: Micros): number {
  const pct = percentRdi(actual, rdi);
  const keys = Object.keys(pct) as Array<keyof Micros>;
  const avg = keys.reduce((s, k) => s + Math.min(100, pct[k]), 0) / keys.length;
  return Math.round((avg / 10) * 10) / 10;
}
