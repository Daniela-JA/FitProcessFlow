import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView } from "react-native";

import { todayKey } from "../src/domain/dates";
import { emptyMicros } from "../src/domain/rdi";
import { kcalFromMacros } from "../src/domain/macros";
import { foodByBarcode, searchOpenFoodFacts } from "../src/services/openFoodFacts";
import { useFoodStore } from "../src/stores/foodStore";
import type { FoodItem } from "../src/data/foods";
import { Button } from "../src/ui/Button";
import { Input } from "../src/ui/Input";
import { Screen } from "../src/ui/Screen";
import { AppText } from "../src/ui/Text";
import { space } from "../src/ui/theme";

export default function BarcodeScreen() {
  const router = useRouter();
  const addFood = useFoodStore((s) => s.addFood);
  const logFood = useFoodStore((s) => s.logFood);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<FoodItem[]>([]);
  const [p, setP] = useState("30");
  const [c, setC] = useState("10");
  const [f, setF] = useState("5");

  async function search() {
    if (/^\d{8,14}$/.test(q.trim())) {
      const one = await foodByBarcode(q.trim());
      setHits(one ? [one] : []);
      return;
    }
    setHits(await searchOpenFoodFacts(q));
  }

  function log(item: FoodItem) {
    addFood(item);
    logFood({
      date: todayKey(),
      meal: "snack",
      name: item.name,
      foodId: item.id,
      grams: item.servingG,
      servings: 1,
      macros: item.macros,
      micros: item.micros,
    });
    router.back();
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 40 }}>
        <Pressable onPress={() => router.back()}>
          <AppText variant="meta" tone="olive">
            Back
          </AppText>
        </Pressable>
        <AppText variant="title">Search / barcode</AppText>
        <AppText tone="muted">Camera scan can wait on a native build. Type a barcode or a name. Offline: custom macros.</AppText>
        <Input label="Name or barcode" value={q} onChangeText={setQ} />
        <Button label="Search" onPress={search} />
        {hits.map((h) => (
          <Pressable key={h.id} onPress={() => log(h)}>
            <AppText>
              {h.name} · P {h.macros.proteinG} / 100g
            </AppText>
          </Pressable>
        ))}
        <AppText variant="meta">Custom macros</AppText>
        <Input label="Protein g" value={p} onChangeText={setP} keyboardType="numeric" />
        <Input label="Carb g" value={c} onChangeText={setC} keyboardType="numeric" />
        <Input label="Fat g" value={f} onChangeText={setF} keyboardType="numeric" />
        <Button
          label="Log custom"
          variant="ghost"
          onPress={() =>
            log({
              id: `custom_${Date.now()}`,
              source: "custom",
              name: q || "Custom",
              servingG: 100,
              macros: {
                kcal: kcalFromMacros(Number(p) || 0, Number(c) || 0, Number(f) || 0),
                proteinG: Number(p) || 0,
                carbG: Number(c) || 0,
                fatG: Number(f) || 0,
                fiberG: 0,
                sodiumMg: 0,
              },
              micros: emptyMicros(),
            })
          }
        />
      </ScrollView>
    </Screen>
  );
}
