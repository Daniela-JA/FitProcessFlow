import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";

import { saveProgressPhoto } from "../src/services/photoVault";
import { useBodyStore } from "../src/stores/bodyStore";
import { Button } from "../src/ui/Button";
import { Screen } from "../src/ui/Screen";
import { AppText } from "../src/ui/Text";
import { colors, space } from "../src/ui/theme";

export default function PhotoScreen() {
  const router = useRouter();
  const measurements = useBodyStore((s) => s.measurements);
  const attachPhoto = useBodyStore((s) => s.attachPhoto);
  const latest = measurements[measurements.length - 1];
  const [seconds, setSeconds] = useState<number | null>(null);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    const t = setTimeout(() => setSeconds(seconds - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function capture() {
    if (!latest) return;
    const uri = `local://photo-${latest.id}`;
    await saveProgressPhoto(latest.id, uri);
    attachPhoto(latest.id, uri, 0.85);
  }

  return (
    <Screen>
      <Pressable onPress={() => router.back()}>
        <AppText variant="meta" tone="olive">
          Back
        </AppText>
      </Pressable>
      <AppText variant="title" style={{ marginTop: space.md }}>
        Photo
      </AppText>
      <AppText tone="muted">
        Front camera, mirror, 10s timer. Photos stay on this phone. Tape remains source of truth.
      </AppText>
      <View
        style={{
          marginTop: space.lg,
          height: 360,
          borderWidth: 0.5,
          borderColor: colors.cream,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: 140,
            height: 300,
            borderWidth: 1,
            borderColor: colors.olive,
            borderStyle: "dashed",
          }}
        />
        <AppText variant="meta" tone="olive" style={{ marginTop: space.sm }}>
          Stand in the contour
        </AppText>
        {seconds !== null && seconds > 0 ? <AppText variant="display">{seconds}</AppText> : null}
      </View>
      <Button label="10s timer" onPress={() => setSeconds(10)} />
      <Button label="Capture (on-device)" variant="ghost" onPress={capture} />
      <AppText tone="muted">
        {latest?.photoBfPct
          ? `Photo estimate ${latest.photoBfPct.toFixed(1)}% · confidence ${Math.round((latest.photoConfidence ?? 0) * 100)}% · tape ${latest.bodyFatPct.toFixed(1)}%`
          : "Save tape first, then capture."}
      </AppText>
      {measurements
        .filter((m) => m.photoUri)
        .slice(-2)
        .map((m) => (
          <Pressable key={m.id} onPress={() => setCompare((c) => [...c.slice(-1), m.id])}>
            <AppText variant="meta">
              Compare {new Date(m.takenAt).toLocaleDateString("en-GB")}
            </AppText>
          </Pressable>
        ))}
      {compare.length === 2 ? (
        <AppText tone="muted">Side-by-side: {compare.join(" · ")} (local only)</AppText>
      ) : null}
    </Screen>
  );
}
