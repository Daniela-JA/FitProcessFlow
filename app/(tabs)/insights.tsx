import { ScrollView } from "react-native";

import { diaryCsv, exportJson, workoutsCsv } from "../../src/domain/exportData";
import { cheerleaderLine, leastEffortSwaps, weekSeals } from "../../src/domain/insights";
import { microAlerts } from "../../src/domain/microAlerts";
import { useToday } from "../../src/hooks/useToday";
import { useBodyStore } from "../../src/stores/bodyStore";
import { useFoodStore } from "../../src/stores/foodStore";
import { useWorkoutStore } from "../../src/stores/workoutStore";
import { Button } from "../../src/ui/Button";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function InsightsScreen() {
  const today = useToday();
  const recipes = useFoodStore((s) => s.recipes);
  const entries = useFoodStore((s) => s.entries);
  const logs = useWorkoutStore((s) => s.logs);
  const program = useWorkoutStore((s) => s.program);
  const sex = useBodyStore((s) => s.sex);
  const measurements = useBodyStore((s) => s.measurements);
  const latest = measurements[measurements.length - 1];

  if (!today.ready || !sex) {
    return (
      <Screen>
        <AppText variant="title">Insights</AppText>
        <AppText tone="muted" style={{ marginTop: space.md }}>
          Choose sex and save a tape measurement. Then this page can tell the truth kindly.
        </AppText>
      </Screen>
    );
  }

  const swaps = leastEffortSwaps({
    actual: today.totals.macros,
    target: today.target,
    recipes,
  });
  const seals = weekSeals({
    sessionsHit: logs.filter((l) => l.endedAt).length >= program.daysPerWeek,
    kcalBand: Math.abs(today.totals.macros.kcal - today.target.kcal) / today.target.kcal <= 0.05,
    proteinBand: Math.abs(today.totals.macros.proteinG - today.target.proteinG) / today.target.proteinG <= 0.05,
  });
  const alerts = microAlerts(today.totals.micros, sex);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ gap: space.md, paddingBottom: 48 }}>
        <AppText variant="meta" tone="muted">
          Insights · 07:00
        </AppText>
        <AppText variant="title">How you are going</AppText>
        <AppText>{cheerleaderLine(today.food, today.training)}</AppText>
        <AppText variant="display">{today.food.toFixed(1)}</AppText>
        <AppText tone="muted">Food 0–10 · kcal / protein / micros / fiber</AppText>
        <AppText variant="tabular">{today.training.toFixed(1)} training</AppText>
        {latest ? (
          <AppText tone="muted">
            Tape BF {latest.bodyFatPct.toFixed(1)}% · LBM {latest.leanMassKg.toFixed(1)} kg
            {latest.photoBfPct
              ? ` · photo ${latest.photoBfPct.toFixed(1)}% (${Math.round((latest.photoConfidence ?? 0) * 100)}%)`
              : ""}
          </AppText>
        ) : null}
        <AppText variant="meta">Wins</AppText>
        {seals.length ? seals.map((s) => <AppText key={s}>{s}</AppText>) : <AppText tone="muted">No seals yet. Process first.</AppText>}
        <AppText variant="meta">Easy fixes</AppText>
        {swaps.map((s) => (
          <AppText key={s.title}>
            {s.title} — {s.reason}
          </AppText>
        ))}
        {alerts.map((a) => (
          <AppText key={a.key} tone="muted">
            Rolling {a.key} is at {a.pct.toFixed(0)}% of RDI. Food, not guilt.
          </AppText>
        ))}
        <Button
          label="Export JSON"
          variant="ghost"
          onPress={() => {
            exportJson({ entries, logs, measurements });
          }}
        />
        <AppText tone="muted" numberOfLines={3}>
          CSV diary {diaryCsv(entries).slice(0, 80)} · workouts {workoutsCsv(logs).slice(0, 40)}
        </AppText>
      </ScrollView>
    </Screen>
  );
}
