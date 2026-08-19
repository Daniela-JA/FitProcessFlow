import type { Exercise } from "../domain/schema";

export const EXERCISES: Exercise[] = [
  {
    id: "ex_squat",
    name: "Squat",
    pattern: "squat",
    defaultSets: 3,
    defaultReps: 6,
    restSeconds: 150,
    variants: [
      { id: "sq_barbell", equipment: "barbell", name: "Back squat" },
      { id: "sq_hack", equipment: "machine", name: "Hack squat" },
      { id: "sq_goblet", equipment: "dumbbell", name: "Goblet squat" },
    ],
  },
  {
    id: "ex_rdl",
    name: "Romanian deadlift",
    pattern: "hinge",
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 120,
    variants: [
      { id: "rdl_barbell", equipment: "barbell", name: "Barbell RDL" },
      { id: "rdl_db", equipment: "dumbbell", name: "DB RDL" },
      { id: "rdl_cable", equipment: "cable", name: "Cable RDL" },
    ],
  },
  {
    id: "ex_lunge",
    name: "Split squat",
    pattern: "lunge",
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 90,
    variants: [
      { id: "lunge_db", equipment: "dumbbell", name: "Bulgarian split squat" },
      { id: "lunge_smith", equipment: "machine", name: "Smith split squat" },
      { id: "lunge_walking", equipment: "dumbbell", name: "Walking lunge" },
    ],
  },
  {
    id: "ex_thrust",
    name: "Hip thrust",
    pattern: "glide",
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 90,
    variants: [
      { id: "thrust_bar", equipment: "barbell", name: "Barbell hip thrust" },
      { id: "thrust_machine", equipment: "machine", name: "Hip thrust machine" },
      { id: "thrust_cable", equipment: "cable", name: "Cable pull-through" },
    ],
  },
  {
    id: "ex_bench",
    name: "Bench press",
    pattern: "horizontal_push",
    defaultSets: 3,
    defaultReps: 6,
    restSeconds: 150,
    variants: [
      { id: "bench_bar", equipment: "barbell", name: "Barbell bench" },
      { id: "bench_db", equipment: "dumbbell", name: "DB bench" },
      { id: "bench_machine", equipment: "machine", name: "Chest press machine" },
    ],
  },
  {
    id: "ex_ohp",
    name: "Overhead press",
    pattern: "vertical_push",
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 120,
    variants: [
      { id: "ohp_bar", equipment: "barbell", name: "Barbell press" },
      { id: "ohp_db", equipment: "dumbbell", name: "DB press" },
      { id: "ohp_machine", equipment: "machine", name: "Shoulder press machine" },
    ],
  },
  {
    id: "ex_row",
    name: "Row",
    pattern: "horizontal_pull",
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 120,
    variants: [
      { id: "row_bar", equipment: "barbell", name: "Barbell row" },
      { id: "row_cable", equipment: "cable", name: "Seated cable row" },
      { id: "row_chest", equipment: "machine", name: "Chest-supported row" },
    ],
  },
  {
    id: "ex_pulldown",
    name: "Pulldown",
    pattern: "vertical_pull",
    defaultSets: 3,
    defaultReps: 8,
    restSeconds: 120,
    variants: [
      { id: "pd_lat", equipment: "cable", name: "Lat pulldown" },
      { id: "pd_assist", equipment: "machine", name: "Assisted pull-up" },
      { id: "pd_db", equipment: "dumbbell", name: "DB pullover" },
    ],
  },
  {
    id: "ex_abductor",
    name: "Hip abduction",
    pattern: "isolation",
    defaultSets: 3,
    defaultReps: 12,
    restSeconds: 60,
    variants: [
      { id: "abd_machine", equipment: "machine", name: "Abductor machine" },
      { id: "abd_cable", equipment: "cable", name: "Cable abduction" },
    ],
  },
  {
    id: "ex_stepup",
    name: "Step-up",
    pattern: "lunge",
    defaultSets: 3,
    defaultReps: 10,
    restSeconds: 75,
    variants: [
      { id: "step_db", equipment: "dumbbell", name: "DB step-up" },
      { id: "step_smith", equipment: "machine", name: "Smith step-up" },
    ],
  },
  {
    id: "ex_carry",
    name: "Farmer carry",
    pattern: "core",
    defaultSets: 3,
    defaultReps: 40,
    restSeconds: 60,
    variants: [
      { id: "carry_db", equipment: "dumbbell", name: "DB farmer carry" },
      { id: "carry_trap", equipment: "barbell", name: "Trap-bar carry" },
    ],
  },
  {
    id: "ex_curl",
    name: "Curl",
    pattern: "isolation",
    defaultSets: 2,
    defaultReps: 10,
    restSeconds: 60,
    variants: [
      { id: "curl_db", equipment: "dumbbell", name: "DB curl" },
      { id: "curl_cable", equipment: "cable", name: "Cable curl" },
    ],
  },
  {
    id: "ex_lateral",
    name: "Lateral raise",
    pattern: "isolation",
    defaultSets: 2,
    defaultReps: 12,
    restSeconds: 45,
    variants: [
      { id: "lat_db", equipment: "dumbbell", name: "DB lateral raise" },
      { id: "lat_cable", equipment: "cable", name: "Cable lateral raise" },
    ],
  },
];

export function exerciseById(id: string): Exercise | undefined {
  return EXERCISES.find((e) => e.id === id);
}
