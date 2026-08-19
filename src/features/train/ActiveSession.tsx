import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { exerciseById } from "../../data/exercises";
import { lastCompletedSet, threeSessionAverage } from "../../domain/workoutLog";
import { formatMmSs, idleRestTimer, restTimerReducer } from "../../domain/restTimer";
import type { WorkoutLog, WorkoutTemplate } from "../../domain/schema";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { AppText } from "../../ui/Text";
import { space } from "../../ui/theme";

export function ActiveSession({
  log,
  template,
  previousLogs,
  elapsedSec,
  onCompleteSet,
  onFinish,
}: {
  log: WorkoutLog;
  template: WorkoutTemplate;
  previousLogs: WorkoutLog[];
  elapsedSec: number;
  onCompleteSet: (exerciseId: string, setIndex: number, payload: { reps: number; weightKg: number }) => void;
  onFinish: () => void;
}) {
  const current = useMemo(() => {
    const next = log.sets.find((s) => !s.completed);
    return next ?? log.sets[log.sets.length - 1];
  }, [log.sets]);

  const exercise = exerciseById(current.exerciseId);
  const last = lastCompletedSet(previousLogs, current.exerciseId);
  const avg = threeSessionAverage(previousLogs, current.exerciseId);
  const item = template.items.find((i) => i.exerciseId === current.exerciseId);

  const [reps, setReps] = useState(String(current.reps));
  const [weight, setWeight] = useState(String(last?.weightKg ?? current.weightKg));
  const [timer, setTimer] = useState(idleRestTimer);

  useEffect(() => {
    setReps(String(current.reps));
    setWeight(String(last?.weightKg ?? current.weightKg));
  }, [current.exerciseId, current.setIndex, current.reps, current.weightKg, last?.weightKg]);

  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => setTimer((s) => restTimerReducer(s, { type: "tick" })), 1000);
    return () => clearInterval(id);
  }, [timer.running]);

  const remainingClock = Math.max(0, template.targetMinutes * 60 - elapsedSec);
  const allDone = log.sets.every((s) => s.completed);

  return (
    <ScrollView contentContainerStyle={styles.wrap}>
      <AppText variant="meta" tone="muted">
        {template.name} · {formatMmSs(remainingClock)} left of {template.targetMinutes}m
      </AppText>
      <AppText variant="title">{exercise?.name ?? current.exerciseId}</AppText>
      <AppText variant="meta" tone="muted">
        Set {current.setIndex + 1} of {item?.sets ?? "—"}
      </AppText>
      <AppText variant="display">{weight || "0"} kg</AppText>
      <AppText tone="muted">
        Last {last ? `${last.weightKg} kg × ${last.reps}` : "—"} · 3-session avg{" "}
        {avg ? `${avg.weightKg} kg × ${avg.reps}` : "—"}
      </AppText>
      {timer.running ? (
        <AppText variant="tabular">{formatMmSs(timer.remainingSec)}</AppText>
      ) : null}

      <Input label="Weight kg" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" />
      <View style={{ flexDirection: "row", gap: space.sm }}>
        {[0.5, 1.25, 2.5].map((n) => (
          <Button
            key={n}
            variant="ghost"
            label={`+${n}`}
            onPress={() => setWeight(String(Math.round(((Number(weight) || 0) + n) * 100) / 100))}
          />
        ))}
      </View>
      <Input label="Reps" value={reps} onChangeText={setReps} keyboardType="numeric" />

      <Button
        label={allDone ? "Session complete" : "Complete set"}
        onPress={() => {
          if (allDone) {
            onFinish();
            return;
          }
          onCompleteSet(current.exerciseId, current.setIndex, {
            reps: Number(reps) || 0,
            weightKg: Number(weight) || 0,
          });
          setTimer(restTimerReducer(timer, { type: "start", durationSec: item?.restSeconds ?? 90 }));
        }}
      />
      {timer.running ? (
        <Button
          variant="ghost"
          label="Skip rest"
          onPress={() => setTimer((s) => restTimerReducer(s, { type: "skip" }))}
        />
      ) : null}

      <View style={styles.list}>
        {template.items.map((it, index) => (
          <AppText key={`${it.exerciseId}-${index}`} tone="muted" variant="meta">
            {index + 1}. {exerciseById(it.exerciseId)?.name} · {it.sets}×{it.reps}
          </AppText>
        ))}
      </View>
      <Pressable onPress={onFinish}>
        <AppText variant="meta" tone="muted">
          End session
        </AppText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.md, paddingBottom: space.xl },
  list: { gap: space.xs, marginTop: space.lg },
});
