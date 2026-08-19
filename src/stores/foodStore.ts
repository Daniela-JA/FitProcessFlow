import { create } from "zustand";
import { persist } from "zustand/middleware";

import { SEED_FOODS, type FoodItem } from "../data/foods";
import { COOKBOOK } from "../data/cookbook";
import { createId } from "../domain/ids";
import { copyDay, type DiaryEntry } from "../domain/foodTotals";
import { scaleRecipe, type Recipe } from "../domain/recipes";
import { persistStorage } from "../lib/persistStorage";

type FoodState = {
  foods: FoodItem[];
  recipes: Recipe[];
  favorites: string[];
  entries: DiaryEntry[];
  recents: string[];
  plan: Array<{ date: string; meal: DiaryEntry["meal"]; recipeId: string; servings: number }>;
  addFood: (food: FoodItem) => void;
  logFood: (entry: Omit<DiaryEntry, "id">) => void;
  logRecipe: (recipeId: string, date: string, meal: DiaryEntry["meal"], servings: number) => void;
  copyYesterday: (today: string) => void;
  toggleFavorite: (recipeId: string) => void;
  assignPlan: (slot: { date: string; meal: DiaryEntry["meal"]; recipeId: string; servings: number }) => void;
};

export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foods: SEED_FOODS,
      recipes: COOKBOOK,
      favorites: [],
      entries: [],
      recents: [],
      plan: [],
      addFood: (food) => set((s) => ({ foods: [food, ...s.foods] })),
      logFood: (entry) =>
        set((s) => ({
          entries: [...s.entries, { ...entry, id: createId("e") }],
          recents: [entry.name, ...s.recents.filter((n) => n !== entry.name)].slice(0, 10),
        })),
      logRecipe: (recipeId, date, meal, servings) => {
        const recipe = get().recipes.find((r) => r.id === recipeId);
        if (!recipe) return;
        const scaled = scaleRecipe(recipe, servings);
        get().logFood({
          date,
          meal,
          name: recipe.name,
          recipeId,
          grams: 0,
          servings,
          macros: scaled.macros,
          micros: scaled.micros,
        });
      },
      copyYesterday: (today) => {
        const y = new Date(`${today}T12:00:00.000Z`);
        y.setUTCDate(y.getUTCDate() - 1);
        const from = y.toISOString().slice(0, 10);
        set((s) => ({
          entries: [...s.entries, ...copyDay(s.entries, from, today, () => createId("e"))],
        }));
      },
      toggleFavorite: (recipeId) =>
        set((s) => ({
          favorites: s.favorites.includes(recipeId)
            ? s.favorites.filter((id) => id !== recipeId)
            : [...s.favorites, recipeId],
        })),
      assignPlan: (slot) =>
        set((s) => ({
          plan: [
            ...s.plan.filter((p) => !(p.date === slot.date && p.meal === slot.meal)),
            slot,
          ],
        })),
    }),
    { name: "fpf-food", storage: persistStorage() },
  ),
);
