import { COOKBOOK } from "../data/cookbook";
import { assertRecipeRules, groceryMerge, scaleRecipe } from "./recipes";
import { proteinDensity as density } from "./macros";

describe("cookbook seed", () => {
  it("ships at least 80 recipes that pass density and ingredient rules", () => {
    expect(COOKBOOK.length).toBeGreaterThanOrEqual(80);
    for (const r of COOKBOOK) {
      expect(() => assertRecipeRules(r)).not.toThrow();
      expect(density(r.macros.kcal, r.macros.proteinG)).toBeLessThanOrEqual(20);
    }
    const pillars = ["burger", "fries", "creami", "pizza", "salad", "pancakes", "sandwich"];
    for (const p of pillars) {
      const group = COOKBOOK.filter((r) => r.pillar === p);
      expect(group.length).toBeGreaterThanOrEqual(5);
      expect(group.some((r) => r.vegetarian)).toBe(true);
    }
  });

  it("scales servings and merges groceries", () => {
    const r = COOKBOOK[0];
    const doubled = scaleRecipe(r, 2);
    expect(doubled.macros.proteinG).toBeCloseTo(r.macros.proteinG * 2, 1);
    const list = groceryMerge([
      { recipe: r, servings: 1 },
      { recipe: r, servings: 1 },
    ]);
    expect(list[0].grams).toBeGreaterThan(0);
  });
});
