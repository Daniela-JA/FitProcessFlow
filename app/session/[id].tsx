import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { ActiveSession } from "../../src/features/train/ActiveSession";
import { useWorkoutStore } from "../../src/stores/workoutStore";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";

export default function SessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const logs = useWorkoutStore((s) => s.logs);
  const templates = useWorkoutStore((s) => s.templates);
  const completeActiveSet = useWorkoutStore((s) => s.completeActiveSet);
  const finishActive = useWorkoutStore((s) => s.finishActive);
  const log = logs.find((l) => l.id === id);
  const template = templates.find((t) => t.id === log?.templateId);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!log) return;
    const started = Date.parse(log.startedAt);
    const tick = () => setElapsed(Math.max(0, Math.round((Date.now() - started) / 1000)));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [log?.startedAt]);

  if (!log || !template) {
    return (
      <Screen>
        <AppText>Session not found</AppText>
      </Screen>
    );
  }

  return (
    <Screen>
      <ActiveSession
        log={log}
        template={template}
        previousLogs={logs.filter((l) => l.id !== log.id)}
        elapsedSec={elapsed}
        onCompleteSet={completeActiveSet}
        onFinish={async () => {
          await finishActive();
          router.replace("/(tabs)/train");
        }}
      />
    </Screen>
  );
}
