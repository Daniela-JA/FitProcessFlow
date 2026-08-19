import type { Recipe } from "./recipes";
import type { Macros } from "./macros";

export type Swap = { title: string; reason: string; recipeId?: string };

export function leastEffortSwaps(input: {
  actual: Macros;
  target: Macros;
  recipes: Recipe[];
}): Swap[] {
  const swaps: Swap[] = [];
  const kcalOver = input.actual.kcal - input.target.kcal;
  const proteinGap = input.target.proteinG - input.actual.proteinG;
  const fiberGap = (input.target.fiberG || 28) - input.actual.fiberG;

  if (kcalOver > 80) {
    const lighter = input.recipes
      .filter((r) => r.macros.kcal < 450 && r.macros.proteinG >= 30)
      .sort((a, b) => a.macros.kcal / a.macros.proteinG - b.macros.kcal / b.macros.proteinG)[0];
    swaps.push({
      title: lighter ? `Swap in ${lighter.name}` : "Cut the extra sauce or bun",
      reason: "Smallest move to land kcal without dropping protein.",
      recipeId: lighter?.id,
    });
  }
  if (proteinGap > 15) {
    const highP = input.recipes
      .filter((r) => r.macros.proteinG >= 40)
      .sort((a, b) => b.macros.proteinG - a.macros.proteinG)[0];
    swaps.push({
      title: highP ? `Add ${highP.name}` : "Add 150g chicken or a skyr pint",
      reason: "Closes the protein gap with one food, not a whole new day.",
      recipeId: highP?.id,
    });
  }
  if (fiberGap > 8) {
    const fibrous = input.recipes
      .filter((r) => r.macros.fiberG >= 8)
      .sort((a, b) => b.macros.fiberG - a.macros.fiberG)[0];
    swaps.push({
      title: fibrous ? `Have ${fibrous.name}` : "Add a big salad or loaded greens",
      reason: "Fiber is the cheapest satiety lever left.",
      recipeId: fibrous?.id,
    });
  }
  if (swaps.length === 0) {
    swaps.push({
      title: "Keep the same meals tomorrow",
      reason: "You were close. Repeat beats reinventing.",
    });
  }
  return swaps.slice(0, 3);
}

export function cheerleaderLine(food: number, training: number): string {
  const avg = (food + training) / 2;
  if (avg >= 8) return "This is what steady looks like. Protect it.";
  if (avg >= 6) return "Solid process. One easy swap will make tomorrow quieter.";
  return "Not a failed day — a readable one. Pick the smallest fix and stop there.";
}

export function weekSeals(input: {
  sessionsHit: boolean;
  kcalBand: boolean;
  proteinBand: boolean;
}): string[] {
  const seals: string[] = [];
  if (input.sessionsHit) seals.push("4/4 sessions");
  if (input.kcalBand) seals.push("kcal band");
  if (input.proteinBand) seals.push("protein band");
  return seals;
}
