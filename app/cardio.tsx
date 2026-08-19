import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable } from "react-native";

import { todayKey } from "../src/domain/dates";
import { useBodyStore } from "../src/stores/bodyStore";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Screen } from "../src/ui/Screen";
import { AppText } from "../src/ui/Text";
import { space } from "../src/ui/theme";

export default function CardioScreen() {
  const router = useRouter();
  const addCardio = useBodyStore((s) => s.addCardio);
  const [minutes, setMinutes] = useState("30");
  const [type, setType] = useState<"walk" | "jog" | "cycle" | "row">("walk");
  const [intensity, setIntensity] = useState<"easy" | "moderate" | "hard">("easy");

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <AppText variant="meta" tone="olive">
          Back
        </AppText>
      </Pressable>
      <AppText variant="title" style={{ marginTop: space.md }}>
        Cardio
      </AppText>
      <Input label="Minutes" value={minutes} onChangeText={setMinutes} keyboardType="numeric" />
      {(["walk", "jog", "cycle", "row"] as const).map((t) => (
        <Button key={t} variant={type === t ? "primary" : "ghost"} label={t} onPress={() => setType(t)} />
      ))}
      {(["easy", "moderate", "hard"] as const).map((i) => (
        <Button key={i} variant={intensity === i ? "primary" : "ghost"} label={i} onPress={() => setIntensity(i)} />
      ))}
      <Button
        label="Save"
        onPress={() => {
          addCardio({ date: todayKey(), type, minutes: Number(minutes) || 0, intensity });
          router.back();
        }}
      />
    </Screen>
  );
}
