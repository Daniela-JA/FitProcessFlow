export type Macros = {
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  fiberG: number;
  sodiumMg: number;
};

export const emptyMacros = (): Macros => ({
  kcal: 0,
  proteinG: 0,
  carbG: 0,
  fatG: 0,
  fiberG: 0,
  sodiumMg: 0,
});

export function sumMacros(items: Macros[]): Macros {
  return items.reduce(
    (acc, m) => ({
      kcal: acc.kcal + m.kcal,
      proteinG: acc.proteinG + m.proteinG,
      carbG: acc.carbG + m.carbG,
      fatG: acc.fatG + m.fatG,
      fiberG: acc.fiberG + m.fiberG,
      sodiumMg: acc.sodiumMg + m.sodiumMg,
    }),
    emptyMacros(),
  );
}

export function scaleMacros(m: Macros, factor: number): Macros {
  return {
    kcal: m.kcal * factor,
    proteinG: m.proteinG * factor,
    carbG: m.carbG * factor,
    fatG: m.fatG * factor,
    fiberG: m.fiberG * factor,
    sodiumMg: m.sodiumMg * factor,
  };
}

export function kcalFromMacros(proteinG: number, carbG: number, fatG: number): number {
  return Math.round(proteinG * 4 + carbG * 4 + fatG * 9);
}

export function targetsFromLbm(
  lbmKg: number,
  extras: {
    proteinGPerKg: number;
    fatGPerKg: number;
    workoutKcal: number;
    cardioKcal: number;
    stepKcal: number;
    nudgePct: number;
  },
) {
  const proteinG = lbmKg * extras.proteinGPerKg;
  const fatG = lbmKg * extras.fatGPerKg;
  const baseKcal = lbmKg * 24 * 1.2;
  let kcal = baseKcal + extras.workoutKcal + extras.cardioKcal + extras.stepKcal;
  kcal *= 1 + extras.nudgePct / 100;
  const carbG = Math.max(0, (kcal - proteinG * 4 - fatG * 9) / 4);
  return {
    kcal: Math.round(kcal),
    proteinG: Math.round(proteinG),
    carbG: Math.round(carbG),
    fatG: Math.round(fatG),
    fiberG: 28,
    sodiumMg: 2300,
  };
}

export function proteinDensity(kcal: number, proteinG: number): number {
  return proteinG <= 0 ? Infinity : kcal / proteinG;
}
