import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { exerciseById } from "../../src/data/exercises";
import { useAuthStore } from "../../src/stores/authStore";
import { useWorkoutStore } from "../../src/stores/workoutStore";
import { weeklyCompletion } from "../../src/domain/workoutLog";
import { Button } from "../../src/ui/Button";
import { Card, CardTitle } from "../../src/ui/Card";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function TrainScreen() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.uid ?? "local");
  const templates = useWorkoutStore((s) => s.templates);
  const logs = useWorkoutStore((s) => s.logs);
  const program = useWorkoutStore((s) => s.program);
  const startSession = useWorkoutStore((s) => s.startSession);
  const week = weeklyCompletion(logs, new Date(), program.daysPerWeek);
  const history = [...logs].filter((l) => l.endedAt).reverse().slice(0, 8);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: space.xl, gap: space.md }}>
        <AppText variant="meta" tone="muted">
          Train
        </AppText>
        <AppText variant="title">
          {program.style === "minimalist" ? "Minimalist" : "Max Results"} · {program.daysPerWeek}× · {program.sex}
        </AppText>
        <AppText tone="muted">
          {week.done}/{week.target} this week · {program.style === "minimalist" ? 45 : 90} min · rest days are not missed workouts
        </AppText>
        <Pressable onPress={() => router.push("/settings")}>
          <AppText variant="meta" tone="olive">
            Change style / frequency / sex
          </AppText>
        </Pressable>
        <Pressable onPress={() => router.push("/measure")}>
          <AppText variant="meta" tone="olive">
            Tape + LBM
          </AppText>
        </Pressable>
        <Pressable onPress={() => router.push("/photo")}>
          <AppText variant="meta" tone="olive">
            Progress photo
          </AppText>
        </Pressable>
        <Pressable onPress={() => router.push("/cardio")}>
          <AppText variant="meta" tone="olive">
            Steady-state cardio
          </AppText>
        </Pressable>

        {templates.map((template) => (
          <Card key={template.id}>
            <CardTitle>{template.name}</CardTitle>
            <AppText tone="muted">
              {template.items
                .map((i) => exerciseById(i.exerciseId)?.name)
                .filter(Boolean)
                .join(" · ")}
            </AppText>
            <View style={{ gap: space.sm }}>
              <Button
                label="Start"
                onPress={() => {
                  const id = startSession(template.id, userId);
                  router.push(`/session/${id}`);
                }}
              />
              <Pressable onPress={() => router.push(`/template/${template.id}`)}>
                <AppText variant="meta" tone="olive">
                  Edit order / sets
                </AppText>
              </Pressable>
            </View>
          </Card>
        ))}

        <AppText variant="meta" tone="muted" style={{ marginTop: space.md }}>
          History
        </AppText>
        {history.length === 0 ? (
          <AppText tone="muted">No sessions yet</AppText>
        ) : (
          history.map((log) => (
            <AppText key={log.id} tone="muted">
              {log.templateName} · {Math.round((log.durationSec ?? 0) / 60)} min ·{" "}
              {new Date(log.endedAt ?? log.startedAt).toLocaleDateString("en-GB")}
            </AppText>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
