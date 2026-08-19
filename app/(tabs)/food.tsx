import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { groceryMerge } from "../../src/domain/recipes";
import { todayKey } from "../../src/domain/dates";
import { recipeMicroScore } from "../../src/domain/recipes";
import { useToday } from "../../src/hooks/useToday";
import { useBodyStore } from "../../src/stores/bodyStore";
import { useFoodStore } from "../../src/stores/foodStore";
import { Button } from "../../src/ui/Button";
import { Card, CardTitle } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function FoodScreen() {
  const router = useRouter();
  const today = useToday();
  const recipes = useFoodStore((s) => s.recipes);
  const entries = useFoodStore((s) => s.entries);
  const recents = useFoodStore((s) => s.recents);
  const favorites = useFoodStore((s) => s.favorites);
  const plan = useFoodStore((s) => s.plan);
  const logRecipe = useFoodStore((s) => s.logRecipe);
  const copyYesterday = useFoodStore((s) => s.copyYesterday);
  const sex = useBodyStore((s) => s.sex) ?? "female";
  const key = todayKey();
  const dayEntries = entries.filter((e) => e.date === key);
  const pillars = ["burger", "fries", "creami", "pizza", "salad", "pancakes", "sandwich"];
  const grocery = groceryMerge(
    plan
      .map((p) => {
        const recipe = recipes.find((r) => r.id === p.recipeId);
        return recipe ? { recipe, servings: p.servings } : null;
      })
      .filter((x): x is { recipe: (typeof recipes)[0]; servings: number } => Boolean(x)),
  );

  return (
    <Screen tone="olive">
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 48 }}>
        <AppText variant="meta" tone="muted">
          Food
        </AppText>
        <AppText variant="title">Kitchen</AppText>
        {today.ready ? (
          <>
            <AppText variant="display">{Math.round(today.totals.macros.kcal)}</AppText>
            <AppText tone="muted">
              {today.target.kcal} kcal · P {Math.round(today.totals.macros.proteinG)}/{today.target.proteinG} · fiber{" "}
              {Math.round(today.totals.macros.fiberG)} · micros {today.food.toFixed(1)}
            </AppText>
          </>
        ) : (
          <AppText tone="muted">Set sex and a tape measurement to unlock targets.</AppText>
        )}

        <Button label="Copy yesterday" onPress={() => copyYesterday(key)} variant="ghost" />
        <Pressable onPress={() => router.push("/barcode")}>
          <AppText variant="meta" tone="olive">
            Barcode / search
          </AppText>
        </Pressable>

        {recents.slice(0, 5).map((name) => {
          const recipe = recipes.find((r) => r.name === name);
          return (
            <Pressable key={name} onPress={() => recipe && logRecipe(recipe.id, key, "snack", 1)}>
              <AppText>Quick log · {name}</AppText>
            </Pressable>
          );
        })}

        {dayEntries.map((e) => (
          <AppText key={e.id} tone="muted">
            {e.meal} · {e.name} · {Math.round(e.macros.kcal)} kcal
          </AppText>
        ))}

        {pillars.map((p) => (
          <View key={p} style={{ gap: space.sm }}>
            <AppText variant="meta">{p}</AppText>
            {recipes
              .filter((r) => r.pillar === p)
              .map((r) => (
                <Card key={r.id}>
                  <CardTitle>{r.name}</CardTitle>
                  <AppText tone="muted">
                    {r.macros.kcal} kcal · P {r.macros.proteinG} · C {r.macros.carbG} · F {r.macros.fatG} · fiber {r.macros.fiberG} · micros{" "}
                    {recipeMicroScore(r, sex).toFixed(1)}
                  </AppText>
                  <Pressable onPress={() => router.push(`/recipe/${r.id}`)}>
                    <AppText variant="meta" tone="olive">
                      Open
                    </AppText>
                  </Pressable>
                </Card>
              ))}
          </View>
        ))}

        <AppText variant="meta">Broad library</AppText>
        {recipes
          .filter((r) => r.pillar === "broad")
          .slice(0, 12)
          .map((r) => (
            <Pressable key={r.id} onPress={() => router.push(`/recipe/${r.id}`)}>
              <AppText>
                {r.name} · P {r.macros.proteinG} · micros {recipeMicroScore(r, sex).toFixed(1)}
                {favorites.includes(r.id) ? " · fav" : ""}
              </AppText>
            </Pressable>
          ))}

        <AppText variant="meta">Grocery</AppText>
        {grocery.length === 0 ? (
          <AppText tone="muted">Assign recipes to the week from a recipe page.</AppText>
        ) : (
          grocery.map((g) => (
            <AppText key={g.name} tone="muted">
              {g.name} · {g.grams} g
            </AppText>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
