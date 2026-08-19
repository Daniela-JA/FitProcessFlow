import { proteinDensity, scaleMacros, type Macros } from "./macros";
import { microScore10, rdiFor, type Micros } from "./rdi";
import { scaleMicros } from "./foodTotals";

export type RecipeIngredient = { name: string; grams: number };

export type Recipe = {
  id: string;
  name: string;
  pillar: string;
  vegetarian: boolean;
  tags: string[];
  prepMinutes: number;
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: string[];
  macros: Macros;
  micros: Micros;
};

const SPICES = new Set([
  "salt",
  "pepper",
  "chili flakes",
  "paprika",
  "garlic powder",
  "oregano",
  "cinnamon",
  "peri-peri",
]);

export function countedIngredients(list: RecipeIngredient[]): RecipeIngredient[] {
  return list.filter((i) => !SPICES.has(i.name.toLowerCase()));
}

export function assertRecipeRules(r: {
  macros: Macros;
  ingredients: RecipeIngredient[];
}): void {
  if (proteinDensity(r.macros.kcal, r.macros.proteinG) > 20) {
    throw new Error("protein density");
  }
  if (countedIngredients(r.ingredients).length > 10) {
    throw new Error("too many ingredients");
  }
}

export function scaleRecipe(recipe: Recipe, servings: number): Recipe {
  const factor = servings / recipe.servings;
  return {
    ...recipe,
    servings,
    ingredients: recipe.ingredients.map((i) => ({ ...i, grams: i.grams * factor })),
    macros: scaleMacros(recipe.macros, factor),
    micros: scaleMicros(recipe.micros, factor),
  };
}

export function groceryMerge(
  slots: Array<{ recipe: Recipe; servings: number }>,
): Array<{ name: string; grams: number }> {
  const map = new Map<string, number>();
  for (const slot of slots) {
    const scaled = scaleRecipe(slot.recipe, slot.servings);
    for (const ing of scaled.ingredients) {
      map.set(ing.name, (map.get(ing.name) ?? 0) + ing.grams);
    }
  }
  return [...map.entries()]
    .map(([name, grams]) => ({ name, grams: Math.round(grams) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function recipeMicroScore(recipe: Recipe, sex: "male" | "female"): number {
  return microScore10(recipe.micros, rdiFor(sex));
}
