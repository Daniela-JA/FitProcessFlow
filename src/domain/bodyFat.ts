import type { Sex } from "./schema";

const toIn = (cm: number) => cm / 2.54;

export function navyBodyFatPct(input: {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  abdomenCm?: number;
  hipCm?: number;
}): number {
  const height = toIn(input.heightCm);
  const neck = toIn(input.neckCm);
  if (input.sex === "male") {
    const abdomen = toIn(input.abdomenCm ?? input.waistCm);
    const girth = abdomen - neck;
    if (girth <= 0 || height <= 0) return 0;
    return (
      86.01 * Math.log10(girth) - 70.041 * Math.log10(height) + 36.76
    );
  }
  const waist = toIn(input.waistCm);
  const hip = toIn(input.hipCm ?? input.waistCm);
  const girth = waist + hip - neck;
  if (girth <= 0 || height <= 0) return 0;
  return (
    163.205 * Math.log10(girth) - 97.684 * Math.log10(height) - 78.387
  );
}

export function leanMassKg(weightKg: number, bfPct: number): number {
  return weightKg * (1 - Math.min(60, Math.max(3, bfPct)) / 100);
}

export function photoBodyFatEstimate(input: {
  sex: Sex;
  heightCm: number;
  weightKg: number;
  age: number;
  poseQuality: number;
}): { bfPct: number; confidence: number } {
  const bmi = input.weightKg / (input.heightCm / 100) ** 2;
  const age = input.age || 28;
  const bfPct =
    input.sex === "male"
      ? 1.2 * bmi + 0.23 * age - 16.2
      : 1.2 * bmi + 0.23 * age - 5.4;
  const pose = Math.min(1, Math.max(0, input.poseQuality));
  return {
    bfPct: Math.min(50, Math.max(5, bfPct)),
    confidence: Math.round((0.3 + 0.5 * pose) * 100) / 100,
  };
}
