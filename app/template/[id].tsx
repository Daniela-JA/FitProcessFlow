import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { exerciseById } from "../../src/data/exercises";
import { useWorkoutStore } from "../../src/stores/workoutStore";
import { Button } from "../../src/ui/Button";
import { Input } from "../../src/ui/Input";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function TemplateEditorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const template = useWorkoutStore((s) => s.templates.find((t) => t.id === id));
  const updateTemplateItem = useWorkoutStore((s) => s.updateTemplateItem);
  const reorderTemplate = useWorkoutStore((s) => s.reorderTemplate);

  if (!template) {
    return (
      <Screen>
        <AppText>Template not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: space.xl }}>
        <Pressable onPress={() => router.back()}>
          <AppText variant="meta" tone="olive">
            Back
          </AppText>
        </Pressable>
        <AppText variant="title">{template.name}</AppText>
        <AppText tone="muted">Change order if a machine is busy. Variants are listed under each lift.</AppText>
        {template.items.map((item, index) => {
          const ex = exerciseById(item.exerciseId);
          return (
            <View key={`${item.exerciseId}-${index}`} style={{ gap: space.sm }}>
              <AppText variant="meta">{ex?.name}</AppText>
              <View style={{ flexDirection: "row", gap: space.sm }}>
                <Button
                  variant="ghost"
                  label="Up"
                  onPress={() => index > 0 && reorderTemplate(template.id, index, index - 1)}
                />
                <Button
                  variant="ghost"
                  label="Down"
                  onPress={() =>
                    index < template.items.length - 1 &&
                    reorderTemplate(template.id, index, index + 1)
                  }
                />
              </View>
              <Input
                label="Sets"
                value={String(item.sets)}
                keyboardType="numeric"
                onChangeText={(v) =>
                  updateTemplateItem(template.id, item.exerciseId, { sets: Number(v) || 1 })
                }
              />
              <Input
                label="Reps"
                value={String(item.reps)}
                keyboardType="numeric"
                onChangeText={(v) =>
                  updateTemplateItem(template.id, item.exerciseId, { reps: Number(v) || 1 })
                }
              />
              <Input
                label="Rest seconds"
                value={String(item.restSeconds)}
                keyboardType="numeric"
                onChangeText={(v) =>
                  updateTemplateItem(template.id, item.exerciseId, {
                    restSeconds: Number(v) || 30,
                  })
                }
              />
              <AppText tone="muted">
                Variants: {ex?.variants.map((v) => v.name).join(" · ")}
              </AppText>
              {ex?.variants.map((v) => (
                <Pressable
                  key={v.id}
                  onPress={() =>
                    updateTemplateItem(template.id, item.exerciseId, { variantId: v.id })
                  }
                >
                  <AppText tone={v.id === item.variantId ? "olive" : "muted"} variant="meta">
                    {v.equipment} · {v.name}
                  </AppText>
                </Pressable>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </Screen>
  );
}
