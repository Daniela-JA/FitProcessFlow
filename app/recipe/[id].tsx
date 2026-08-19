import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView } from "react-native";

import { todayKey } from "../../src/domain/dates";
import { recipeMicroScore } from "../../src/domain/recipes";
import { useBodyStore } from "../../src/stores/bodyStore";
import { useFoodStore } from "../../src/stores/foodStore";
import { Button } from "../../src/ui/Button";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = useFoodStore((s) => s.recipes.find((r) => r.id === id));
  const logRecipe = useFoodStore((s) => s.logRecipe);
  const toggleFavorite = useFoodStore((s) => s.toggleFavorite);
  const assignPlan = useFoodStore((s) => s.assignPlan);
  const favorites = useFoodStore((s) => s.favorites);
  const sex = useBodyStore((s) => s.sex) ?? "female";

  if (!recipe) {
    return (
      <Screen>
        <AppText>Recipe not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen tone="olive">
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <AppText variant="meta" tone="olive">
            Back
          </AppText>
        </Pressable>
        <AppText variant="title">{recipe.name}</AppText>
        <AppText tone="muted">
          {recipe.macros.kcal} kcal · P {recipe.macros.proteinG} · C {recipe.macros.carbG} · F {recipe.macros.fatG} · fiber {recipe.macros.fiberG} · micros{" "}
          {recipeMicroScore(recipe, sex).toFixed(1)}
        </AppText>
        {recipe.instructions.map((step) => (
          <AppText key={step}>{step}</AppText>
        ))}
        {recipe.ingredients.map((i) => (
          <AppText key={i.name} tone="muted">
            {i.name} · {i.grams} g
          </AppText>
        ))}
        <Button label="Log 1 serving" onPress={() => logRecipe(recipe.id, todayKey(), "lunch", 1)} />
        <Button
          variant="ghost"
          label={favorites.includes(recipe.id) ? "Unfavourite" : "Favourite"}
          onPress={() => toggleFavorite(recipe.id)}
        />
        <Button
          variant="ghost"
          label="Add to tonight’s plan"
          onPress={() => assignPlan({ date: todayKey(), meal: "dinner", recipeId: recipe.id, servings: 1 })}
        />
      </ScrollView>
    </Screen>
  );
}
