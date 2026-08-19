import { create } from "zustand";
import { persist } from "zustand/middleware";

import { generateWeek, DEFAULT_PROGRAM } from "../domain/program";
import type { ProgramInput, WorkoutLog, WorkoutTemplate } from "../domain/schema";
import { completeSet, createLog, finishLog } from "../domain/workoutLog";
import { persistStorage } from "../lib/persistStorage";
import { upsertWorkoutRemote } from "../lib/firebase";

type WorkoutState = {
  program: ProgramInput;
  templates: WorkoutTemplate[];
  logs: WorkoutLog[];
  activeLogId: string | null;
  setProgram: (program: ProgramInput) => void;
  startSession: (templateId: string, userId: string) => string;
  completeActiveSet: (
    exerciseId: string,
    setIndex: number,
    payload: { reps: number; weightKg: number },
  ) => void;
  finishActive: () => Promise<void>;
  updateTemplateItem: (
    templateId: string,
    exerciseId: string,
    patch: Partial<{ sets: number; reps: number; restSeconds: number; variantId: string }>,
  ) => void;
  reorderTemplate: (templateId: string, from: number, to: number) => void;
};

function activeLog(state: WorkoutState): WorkoutLog | undefined {
  return state.logs.find((l) => l.id === state.activeLogId);
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      program: DEFAULT_PROGRAM,
      templates: generateWeek(DEFAULT_PROGRAM),
      logs: [],
      activeLogId: null,
      setProgram: (program) =>
        set({ program, templates: generateWeek(program) }),
      startSession: (templateId, userId) => {
        const template = get().templates.find((t) => t.id === templateId);
        if (!template) throw new Error("Template not found");
        const log = createLog(template, userId);
        set((s) => ({ logs: [...s.logs, log], activeLogId: log.id }));
        return log.id;
      },
      completeActiveSet: (exerciseId, setIndex, payload) => {
        const current = activeLog(get());
        if (!current) return;
        const next = completeSet(current, exerciseId, setIndex, payload);
        set((s) => ({
          logs: s.logs.map((l) => (l.id === next.id ? next : l)),
        }));
      },
      finishActive: async () => {
        const current = activeLog(get());
        if (!current) return;
        const next = finishLog(current);
        set((s) => ({
          logs: s.logs.map((l) => (l.id === next.id ? next : l)),
          activeLogId: null,
        }));
        await upsertWorkoutRemote(next.userId, next);
      },
      updateTemplateItem: (templateId, exerciseId, patch) => {
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id !== templateId
              ? t
              : {
                  ...t,
                  items: t.items.map((item) =>
                    item.exerciseId === exerciseId ? { ...item, ...patch } : item,
                  ),
                },
          ),
        }));
      },
      reorderTemplate: (templateId, from, to) => {
        set((s) => ({
          templates: s.templates.map((t) => {
            if (t.id !== templateId) return t;
            const items = [...t.items];
            const [moved] = items.splice(from, 1);
            items.splice(to, 0, moved);
            return { ...t, items };
          }),
        }));
      },
    }),
    {
      name: "fpf-workouts",
      storage: persistStorage(),
    },
  ),
);
