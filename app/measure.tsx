import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { useBodyStore } from "../src/stores/bodyStore";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Screen } from "../src/ui/Screen";
import { AppText } from "../src/ui/Text";
import { space } from "../src/ui/theme";

export default function MeasureScreen() {
  const router = useRouter();
  const sex = useBodyStore((s) => s.sex);
  const addMeasurement = useBodyStore((s) => s.addMeasurement);
  const measurements = useBodyStore((s) => s.measurements);
  const [weightKg, setW] = useState("68");
  const [neckCm, setN] = useState("32");
  const [waistCm, setWa] = useState("74");
  const [abdomenCm, setA] = useState("76");
  const [hipCm, setH] = useState("98");
  const [armCm, setArm] = useState("28");
  const [thighCm, setT] = useState("56");

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <AppText variant="meta" tone="olive">
            Back
          </AppText>
        </Pressable>
        <AppText variant="title">Tape</AppText>
        {!sex ? (
          <AppText tone="muted">Choose female or male in Settings first.</AppText>
        ) : (
          <>
            <Input label="Weight kg" value={weightKg} onChangeText={setW} keyboardType="decimal-pad" />
            <Input label="Neck cm" value={neckCm} onChangeText={setN} keyboardType="decimal-pad" />
            <Input label="Waist cm" value={waistCm} onChangeText={setWa} keyboardType="decimal-pad" />
            {sex === "male" ? (
              <Input label="Abdomen cm" value={abdomenCm} onChangeText={setA} keyboardType="decimal-pad" />
            ) : (
              <Input label="Hip cm" value={hipCm} onChangeText={setH} keyboardType="decimal-pad" />
            )}
            <Input label="Arm cm" value={armCm} onChangeText={setArm} keyboardType="decimal-pad" />
            <Input label="Thigh cm" value={thighCm} onChangeText={setT} keyboardType="decimal-pad" />
            <Button
              label="Save tape"
              onPress={() => {
                addMeasurement({
                  weightKg: Number(weightKg),
                  neckCm: Number(neckCm),
                  waistCm: Number(waistCm),
                  abdomenCm: sex === "male" ? Number(abdomenCm) : undefined,
                  hipCm: sex === "female" ? Number(hipCm) : undefined,
                  armCm: Number(armCm),
                  thighCm: Number(thighCm),
                });
                router.back();
              }}
            />
          </>
        )}
        {measurements
          .slice()
          .reverse()
          .map((m) => (
            <AppText key={m.id} tone="muted">
              {new Date(m.takenAt).toLocaleDateString("en-GB")} · BF {m.bodyFatPct.toFixed(1)}% · LBM {m.leanMassKg.toFixed(1)} kg · scale {m.weightKg}
            </AppText>
          ))}
      </ScrollView>
    </Screen>
  );
}
