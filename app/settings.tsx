import { useRouter } from "expo-router";
import { Pressable, ScrollView } from "react-native";

import { useBodyStore } from "../src/stores/bodyStore";
import { useWorkoutStore } from "../src/stores/workoutStore";
import type { DaysPerWeek, Sex, TrainingStyle } from "../src/domain/schema";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Screen } from "../src/ui/Screen";
import { AppText } from "../src/ui/Text";
import { space } from "../src/ui/theme";

export default function SettingsScreen() {
  const router = useRouter();
  const program = useWorkoutStore((s) => s.program);
  const setProgram = useWorkoutStore((s) => s.setProgram);
  const body = useBodyStore();

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <AppText variant="meta" tone="olive">
            Back
          </AppText>
        </Pressable>
        <AppText variant="title">Settings</AppText>
        <AppText tone="muted">Sex is required before tape BF%. Switching style regenerates the week, logs stay.</AppText>
        {(["female", "male"] as Sex[]).map((sex) => (
          <Button
            key={sex}
            variant={body.sex === sex ? "primary" : "ghost"}
            label={sex}
            onPress={() => {
              body.setProfile({ sex });
              setProgram({ ...program, sex });
            }}
          />
        ))}
        {(["minimalist", "max_results"] as TrainingStyle[]).map((style) => (
          <Button
            key={style}
            variant={program.style === style ? "primary" : "ghost"}
            label={style === "minimalist" ? "Minimalist 45m" : "Max Results 90m"}
            onPress={() => setProgram({ ...program, style })}
          />
        ))}
        {([2, 3, 4, 5, 6] as DaysPerWeek[]).map((n) => (
          <Button
            key={n}
            variant={program.daysPerWeek === n ? "primary" : "ghost"}
            label={`${n}× / week`}
            onPress={() => setProgram({ ...program, daysPerWeek: n })}
          />
        ))}
        <Input
          label="Height cm"
          value={String(body.heightCm)}
          keyboardType="numeric"
          onChangeText={(v) => body.setProfile({ heightCm: Number(v) || body.heightCm })}
        />
        <Input
          label="Sleep needed hours"
          value={String(body.sleepNeeded)}
          keyboardType="decimal-pad"
          onChangeText={(v) => body.setProfile({ sleepNeeded: Number(v) || 8 })}
        />
        <Input
          label="Step target"
          value={String(body.stepTarget)}
          keyboardType="numeric"
          onChangeText={(v) => body.setProfile({ stepTarget: Number(v) || 8000 })}
        />
        <Input
          label="Kcal nudge %"
          value={String(body.kcalNudgePct)}
          keyboardType="numeric"
          onChangeText={(v) => body.setProfile({ kcalNudgePct: Number(v) || 0 })}
        />
      </ScrollView>
    </Screen>
  );
}
