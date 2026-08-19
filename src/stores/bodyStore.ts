import { MockHealthProvider, type HealthSnapshot } from "../services/health";
import { navyBodyFatPct, leanMassKg, photoBodyFatEstimate } from "../domain/bodyFat";
import { createId } from "../domain/ids";
import { todayKey } from "../domain/dates";
import type { Sex } from "../domain/schema";
import { persistStorage } from "../lib/persistStorage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Measurement = {
  id: string;
  takenAt: string;
  weightKg: number;
  neckCm: number;
  waistCm: number;
  abdomenCm?: number;
  hipCm?: number;
  armCm: number;
  thighCm: number;
  bodyFatPct: number;
  leanMassKg: number;
  photoBfPct?: number;
  photoConfidence?: number;
  photoUri?: string;
};

export type CardioLog = {
  id: string;
  date: string;
  type: "walk" | "jog" | "cycle" | "row" | "elliptical" | "other";
  minutes: number;
  intensity: "easy" | "moderate" | "hard";
};

type BodyState = {
  sex: Sex | null;
  heightCm: number;
  age: number;
  stepTarget: number;
  sleepNeeded: number;
  kcalNudgePct: number;
  measurements: Measurement[];
  cardio: CardioLog[];
  healthByDate: Record<string, HealthSnapshot>;
  setProfile: (p: Partial<Pick<BodyState, "sex" | "heightCm" | "age" | "stepTarget" | "sleepNeeded" | "kcalNudgePct">>) => void;
  addMeasurement: (m: Omit<Measurement, "id" | "bodyFatPct" | "leanMassKg" | "takenAt"> & { takenAt?: string }) => Measurement;
  addCardio: (c: Omit<CardioLog, "id">) => void;
  attachPhoto: (measurementId: string, photoUri: string, poseQuality: number) => void;
  syncHealth: () => Promise<HealthSnapshot>;
};

const health = new MockHealthProvider();

export const useBodyStore = create<BodyState>()(
  persist(
    (set, get) => ({
      sex: null,
      heightCm: 168,
      age: 28,
      stepTarget: 8000,
      sleepNeeded: 8,
      kcalNudgePct: 0,
      measurements: [],
      cardio: [],
      healthByDate: {},
      setProfile: (p) => set(p),
      addMeasurement: (raw) => {
        const sex = get().sex;
        if (!sex) throw new Error("Choose sex before tape");
        const bodyFatPct = navyBodyFatPct({
          sex,
          heightCm: get().heightCm,
          neckCm: raw.neckCm,
          waistCm: raw.waistCm,
          abdomenCm: raw.abdomenCm,
          hipCm: raw.hipCm,
        });
        const row: Measurement = {
          id: createId("m"),
          takenAt: raw.takenAt ?? new Date().toISOString(),
          weightKg: raw.weightKg,
          neckCm: raw.neckCm,
          waistCm: raw.waistCm,
          abdomenCm: raw.abdomenCm,
          hipCm: raw.hipCm,
          armCm: raw.armCm,
          thighCm: raw.thighCm,
          bodyFatPct,
          leanMassKg: leanMassKg(raw.weightKg, bodyFatPct),
          photoUri: raw.photoUri,
        };
        set((s) => ({ measurements: [...s.measurements, row] }));
        return row;
      },
      addCardio: (c) =>
        set((s) => ({ cardio: [...s.cardio, { ...c, id: createId("c") }] })),
      attachPhoto: (measurementId, photoUri, poseQuality) => {
        const sex = get().sex;
        if (!sex) return;
        set((s) => ({
          measurements: s.measurements.map((m) => {
            if (m.id !== measurementId) return m;
            const photo = photoBodyFatEstimate({
              sex,
              heightCm: s.heightCm,
              weightKg: m.weightKg,
              age: s.age,
              poseQuality,
            });
            return { ...m, photoUri, photoBfPct: photo.bfPct, photoConfidence: photo.confidence };
          }),
        }));
      },
      syncHealth: async () => {
        const snap = await health.getToday();
        set((s) => ({ healthByDate: { ...s.healthByDate, [todayKey()]: snap } }));
        return snap;
      },
    }),
    { name: "fpf-body", storage: persistStorage() },
  ),
);
