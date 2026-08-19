import { z } from "zod";

export const sexSchema = z.enum(["male", "female"]);
export const trainingStyleSchema = z.enum(["minimalist", "max_results"]);
export const daysPerWeekSchema = z.union([
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

export const equipmentSchema = z.enum([
  "barbell",
  "dumbbell",
  "machine",
  "cable",
  "bodyweight",
  "plate_loaded",
]);

export const patternSchema = z.enum([
  "squat",
  "hinge",
  "lunge",
  "horizontal_push",
  "vertical_push",
  "horizontal_pull",
  "vertical_pull",
  "glide",
  "core",
  "isolation",
]);

export const exerciseVariantSchema = z.object({
  id: z.string(),
  equipment: equipmentSchema,
  name: z.string(),
});

export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  pattern: patternSchema,
  defaultSets: z.number().int().positive(),
  defaultReps: z.number().int().positive(),
  restSeconds: z.number().int().positive(),
  variants: z.array(exerciseVariantSchema),
});

export const templateItemSchema = z.object({
  exerciseId: z.string(),
  variantId: z.string(),
  sets: z.number().int().positive(),
  reps: z.number().int().positive(),
  restSeconds: z.number().int().positive(),
});

export const workoutTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  style: trainingStyleSchema,
  sex: sexSchema,
  daysPerWeek: daysPerWeekSchema,
  targetMinutes: z.number().int().positive(),
  weekdayIndex: z.number().int().min(0).max(6),
  items: z.array(templateItemSchema),
});

export const loggedSetSchema = z.object({
  exerciseId: z.string(),
  variantId: z.string(),
  setIndex: z.number().int().min(0),
  reps: z.number().int().min(0),
  weightKg: z.number().min(0),
  completed: z.boolean(),
});

export const workoutLogSchema = z.object({
  id: z.string(),
  userId: z.string(),
  templateId: z.string(),
  templateName: z.string(),
  startedAt: z.string(),
  endedAt: z.string().optional(),
  durationSec: z.number().int().min(0).optional(),
  sets: z.array(loggedSetSchema),
});

export const programInputSchema = z.object({
  style: trainingStyleSchema,
  sex: sexSchema,
  daysPerWeek: daysPerWeekSchema,
});

export type Sex = z.infer<typeof sexSchema>;
export type TrainingStyle = z.infer<typeof trainingStyleSchema>;
export type DaysPerWeek = z.infer<typeof daysPerWeekSchema>;
export type Exercise = z.infer<typeof exerciseSchema>;
export type WorkoutTemplate = z.infer<typeof workoutTemplateSchema>;
export type WorkoutLog = z.infer<typeof workoutLogSchema>;
export type LoggedSet = z.infer<typeof loggedSetSchema>;
export type ProgramInput = z.infer<typeof programInputSchema>;
export type TemplateItem = z.infer<typeof templateItemSchema>;
