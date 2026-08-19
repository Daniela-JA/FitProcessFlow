import { EXERCISES, exerciseById } from "../data/exercises";
import type {
  DaysPerWeek,
  Exercise,
  ProgramInput,
  Sex,
  TemplateItem,
  TrainingStyle,
  WorkoutTemplate,
} from "./schema";

type Slot = { exerciseId: string; extraSet?: boolean };

function item(exerciseId: string, extraSet = false): TemplateItem {
  const ex = exerciseById(exerciseId);
  if (!ex) throw new Error(`Unknown exercise ${exerciseId}`);
  const variant = ex.variants[0];
  return {
    exerciseId: ex.id,
    variantId: variant.id,
    sets: extraSet ? ex.defaultSets + 1 : ex.defaultSets,
    reps: ex.defaultReps,
    restSeconds: ex.restSeconds,
  };
}

function slotsFor(style: TrainingStyle, sex: Sex, letter: "A" | "B"): Slot[] {
  const max = style === "max_results";
  if (sex === "female") {
    if (letter === "A") {
      return [
        { exerciseId: "ex_squat" },
        { exerciseId: "ex_rdl" },
        { exerciseId: "ex_thrust", extraSet: true },
        { exerciseId: "ex_bench" },
        { exerciseId: "ex_row" },
        ...(max ? [{ exerciseId: "ex_abductor" as const }, { exerciseId: "ex_lunge" as const }] : []),
      ];
    }
    return [
      { exerciseId: "ex_rdl" },
      { exerciseId: "ex_lunge" },
      { exerciseId: "ex_stepup" },
      { exerciseId: "ex_ohp" },
      { exerciseId: "ex_pulldown" },
      ...(max ? [{ exerciseId: "ex_thrust" as const }, { exerciseId: "ex_abductor" as const }] : []),
    ];
  }
  if (letter === "A") {
    return [
      { exerciseId: "ex_squat" },
      { exerciseId: "ex_bench" },
      { exerciseId: "ex_row" },
      { exerciseId: "ex_rdl" },
      { exerciseId: "ex_carry" },
      ...(max ? [{ exerciseId: "ex_ohp" as const }, { exerciseId: "ex_curl" as const }] : []),
    ];
  }
  return [
    { exerciseId: "ex_rdl" },
    { exerciseId: "ex_ohp" },
    { exerciseId: "ex_pulldown" },
    { exerciseId: "ex_lunge" },
    { exerciseId: "ex_lateral" },
    ...(max ? [{ exerciseId: "ex_bench" as const }, { exerciseId: "ex_row" as const }] : []),
  ];
}

function lettersFor(days: DaysPerWeek): Array<"A" | "B"> {
  const pattern: Array<"A" | "B"> = [];
  for (let i = 0; i < days; i += 1) pattern.push(i % 2 === 0 ? "A" : "B");
  return pattern;
}

function trimSets(items: TemplateItem[], days: DaysPerWeek): TemplateItem[] {
  if (days <= 4) return items;
  const drop = days === 5 ? 1 : 1;
  return items.map((it) => ({ ...it, sets: Math.max(2, it.sets - drop) }));
}

export function generateWeek(
  input: ProgramInput,
  _library: Exercise[] = EXERCISES,
): WorkoutTemplate[] {
  const minutes = input.style === "minimalist" ? 45 : 90;
  return lettersFor(input.daysPerWeek).map((letter, index) => {
    const raw = slotsFor(input.style, input.sex, letter).map((s) =>
      item(s.exerciseId, s.extraSet),
    );
    return {
      id: `tpl_${input.style}_${input.sex}_${input.daysPerWeek}_${letter}_${index}`,
      name: `Full body ${letter}`,
      style: input.style,
      sex: input.sex,
      daysPerWeek: input.daysPerWeek,
      targetMinutes: minutes,
      weekdayIndex: index,
      items: trimSets(raw, input.daysPerWeek),
    };
  });
}

export const DEFAULT_PROGRAM: ProgramInput = {
  style: "minimalist",
  sex: "male",
  daysPerWeek: 4,
};
