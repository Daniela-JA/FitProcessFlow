import { kcalFromMacros, type Macros } from "../domain/macros";
import { emptyMicros, type Micros } from "../domain/rdi";

export type FoodItem = {
  id: string;
  source: "custom" | "off" | "barcode";
  name: string;
  barcode?: string;
  servingG: number;
  macros: Macros;
  micros: Micros;
};

function food(id: string, name: string, servingG: number, p: number, c: number, f: number, fiber: number, micros: Partial<Micros> = {}): FoodItem {
  return {
    id,
    source: "custom",
    name,
    servingG,
    macros: { kcal: kcalFromMacros(p, c, f), proteinG: p, carbG: c, fatG: f, fiberG: fiber, sodiumMg: 80 },
    micros: { ...emptyMicros(), ...micros },
  };
}

export const SEED_FOODS: FoodItem[] = [
  food("f_frango", "Frango grelhado", 100, 31, 0, 3.6, 0, { niacin_mg: 8, vitaminB6_mg: 0.5, zinc_mg: 1 }),
  food("f_skyr", "Skyr magro", 100, 11, 4, 0.2, 0, { calcium_mg: 120, vitaminB12_mcg: 0.6 }),
  food("f_atum", "Atum ao natural", 100, 26, 0, 1, 0, { vitaminD_mcg: 1.5, vitaminB12_mcg: 2 }),
  food("f_ovos", "Ovos", 100, 13, 1, 10, 0, { vitaminD_mcg: 2, vitaminB12_mcg: 1 }),
  food("f_arroz", "Arroz cozido", 100, 2.7, 28, 0.3, 0.4, { thiamin_mg: 0.1 }),
  food("f_batata", "Batata", 100, 2, 17, 0.1, 2.2, { potassium_mg: 400, vitaminC_mg: 12 }),
  food("f_aveia", "Aveia", 40, 5, 24, 3, 4, { iron_mg: 1.5, magnesium_mg: 50 }),
  food("f_whey", "Whey", 30, 24, 2, 1.5, 0, { calcium_mg: 80 }),
  food("f_pao", "Pão", 50, 5, 24, 1.5, 2, { thiamin_mg: 0.2 }),
  food("f_wrap", "Wrap", 60, 6, 28, 3, 3, {}),
  food("f_rucula", "Rúcula", 50, 1.3, 2, 0.3, 1.6, { vitaminK_mcg: 50, vitaminA_mcg: 80, vitaminC_mg: 8 }),
  food("f_azeite", "Azeite", 5, 0, 0, 5, 0, { vitaminE_mg: 0.7 }),
];
