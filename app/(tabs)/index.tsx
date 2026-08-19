import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, View } from "react-native";

import { useToday } from "../../src/hooks/useToday";
import { scheduleInsightsNotification } from "../../src/services/notifications";
import { useAuthStore } from "../../src/stores/authStore";
import { useBodyStore } from "../../src/stores/bodyStore";
import { useFoodStore } from "../../src/stores/foodStore";
import { useWorkoutStore } from "../../src/stores/workoutStore";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { colors, space } from "../../src/ui/theme";

export default function HomeScreen() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const today = useToday();
  const templates = useWorkoutStore((s) => s.templates);
  const recents = useFoodStore((s) => s.recents);
  const recipes = useFoodStore((s) => s.recipes);
  const logRecipe = useFoodStore((s) => s.logRecipe);
  const syncHealth = useBodyStore((s) => s.syncHealth);
  const next = templates[0];

  useEffect(() => {
    void syncHealth();
    void scheduleInsightsNotification();
  }, [syncHealth]);

  return (
    <Screen>
      <AppText variant="meta" tone="muted">
        FitProcessFlow
      </AppText>
      <AppText variant="title" style={{ marginTop: space.md }}>
        {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
      </AppText>
      <AppText tone="muted">{user?.email}</AppText>

      <View style={{ marginTop: space.xl, paddingBottom: space.lg, borderBottomWidth: 0.5, borderBottomColor: colors.line, gap: space.sm }}>
        <AppText variant="meta" tone="muted">
          Train
        </AppText>
        <AppText variant="display">{today.ready ? today.training.toFixed(1) : "—"}</AppText>
        <AppText tone="muted">{next?.name ?? "Set program"} · 45 / 90 min</AppText>
        <Pressable onPress={() => router.push("/(tabs)/train")}>
          <AppText variant="meta" tone="olive">
            Open session
          </AppText>
        </Pressable>
      </View>

      <View style={{ marginTop: space.lg, gap: space.sm }}>
        <AppText variant="meta" tone="muted">
          Food
        </AppText>
        <AppText variant="display">{today.ready ? today.food.toFixed(1) : "—"}</AppText>
        <AppText tone="muted">
          {today.ready ? `${Math.round(today.target.kcal - today.totals.macros.kcal)} kcal remaining` : "Add tape + sex in settings"}
        </AppText>
        {recents.slice(0, 3).map((name) => {
          const recipe = recipes.find((r) => r.name === name);
          return (
            <Pressable
              key={name}
              onPress={() => {
                if (recipe && today.ready) logRecipe(recipe.id, today.key, "snack", 1);
              }}
            >
              <AppText variant="meta" tone="olive">
                Log {name}
              </AppText>
            </Pressable>
          );
        })}
        <Pressable onPress={() => router.push("/(tabs)/food")}>
          <AppText variant="meta" tone="olive">
            Kitchen
          </AppText>
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/settings")} style={{ marginTop: space.lg }}>
        <AppText variant="meta" tone="muted">
          Settings · sex, style, frequency
        </AppText>
      </Pressable>
      <Pressable onPress={() => useAuthStore.getState().signOut()} style={{ marginTop: space.sm }}>
        <AppText variant="meta" tone="muted">
          Sign out
        </AppText>
      </Pressable>
    </Screen>
  );
}
