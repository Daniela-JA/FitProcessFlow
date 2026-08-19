import { kcalFromMacros, type Macros } from "../domain/macros";
import { assertRecipeRules, type Recipe, type RecipeIngredient } from "../domain/recipes";
import { emptyMicros, type Micros } from "../domain/rdi";

type Row = {
  id: string;
  name: string;
  pillar: string;
  vegetarian?: boolean;
  tags: string[];
  prep: number;
  protein: number;
  carb: number;
  fat: number;
  fiber: number;
  ingredients: Array<[string, number]>;
  steps: string[];
  microBoost?: Partial<Micros>;
};

function macrosOf(r: Row): Macros {
  return {
    kcal: kcalFromMacros(r.protein, r.carb, r.fat),
    proteinG: r.protein,
    carbG: r.carb,
    fatG: r.fat,
    fiberG: r.fiber,
    sodiumMg: 400,
  };
}

function microsOf(r: Row): Micros {
  return { ...emptyMicros(), calcium_mg: 180, potassium_mg: 700, vitaminC_mg: 20, iron_mg: 2, zinc_mg: 3, vitaminD_mcg: 1.5, vitaminB12_mcg: 1.2, ...r.microBoost };
}

function toRecipe(r: Row): Recipe {
  const ingredients: RecipeIngredient[] = r.ingredients.map(([name, grams]) => ({ name, grams }));
  const recipe: Recipe = {
    id: r.id,
    name: r.name,
    pillar: r.pillar,
    vegetarian: Boolean(r.vegetarian),
    tags: r.tags,
    prepMinutes: r.prep,
    servings: 1,
    ingredients,
    instructions: r.steps,
    macros: macrosOf(r),
    micros: microsOf(r),
  };
  assertRecipeRules(recipe);
  return recipe;
}

const heroes: Row[] = [
  { id: "r_smash", name: "5% smash + pickle volume", pillar: "burger", tags: ["fit_fast_food", "air_fryer"], prep: 20, protein: 48, carb: 28, fat: 12, fiber: 7, ingredients: [["carne picada 5%", 160], ["pão", 50], ["pickles", 40], ["rúcula", 50], ["tomate", 80], ["skyr", 40], ["cebola", 30]], steps: ["Air-fry patty.", "Stack with salad volume."] },
  { id: "r_chicken_smash", name: "Air-fryer chicken smash", pillar: "burger", tags: ["air_fryer"], prep: 18, protein: 52, carb: 24, fat: 8, fiber: 6, ingredients: [["frango", 180], ["pão", 45], ["rúcula", 60], ["tomate", 70], ["skyr", 40], ["pimento", 40]], steps: ["Smash chicken in air fryer.", "Sauce with skyr."] },
  { id: "r_breakfast_burger", name: "Peru + egg breakfast burger", pillar: "burger", tags: ["breakfast"], prep: 15, protein: 46, carb: 22, fat: 11, fiber: 5, ingredients: [["peru", 100], ["ovos", 100], ["pão", 40], ["rúcula", 40], ["tomate", 50], ["skyr", 30]], steps: ["Air-fry peru.", "Egg on top."] },
  { id: "r_tuna_melt", name: "Atum-melt burger", pillar: "burger", tags: ["pantry"], prep: 12, protein: 44, carb: 26, fat: 9, fiber: 6, ingredients: [["atum ao natural", 140], ["pão", 45], ["queijo light", 20], ["rúcula", 50], ["tomate", 60], ["skyr", 40]], steps: ["Mix tuna and skyr.", "Melt cheese."] },
  { id: "r_bean_smash", name: "Black bean + skyr smash", pillar: "burger", vegetarian: true, tags: ["vegetarian"], prep: 22, protein: 38, carb: 36, fat: 8, fiber: 12, ingredients: [["feijão", 180], ["skyr", 120], ["pão", 40], ["rúcula", 50], ["tomate", 70], ["cebola", 30], ["ovos", 50]], steps: ["Mash beans with skyr.", "Air-fry patty."] },
  { id: "r_peri_fries", name: "Peri-peri frango loaded fries", pillar: "fries", tags: ["air_fryer", "fit_fast_food"], prep: 25, protein: 50, carb: 38, fat: 9, fiber: 8, ingredients: [["batata", 180], ["frango", 170], ["skyr", 80], ["pimento", 60], ["rúcula", 40], ["peri-peri", 2]], steps: ["Air-fry potatoes.", "Load chicken and skyr."] },
  { id: "r_bolo_fries", name: "Turkey bolognese loaded fries", pillar: "fries", tags: ["air_fryer"], prep: 30, protein: 48, carb: 36, fat: 10, fiber: 9, ingredients: [["batata", 170], ["peru", 160], ["tomate", 120], ["cebola", 40], ["skyr", 50], ["rúcula", 30]], steps: ["Simmer turkey sauce.", "Load fries."] },
  { id: "r_greek_fries", name: "Skyr-cucumber Greek fries", pillar: "fries", tags: ["high_fiber"], prep: 22, protein: 42, carb: 34, fat: 8, fiber: 8, ingredients: [["batata", 160], ["frango", 140], ["skyr", 150], ["pepino", 100], ["tomate", 60], ["rúcula", 40]], steps: ["Air-fry potatoes.", "Cold skyr topping."] },
  { id: "r_tuna_fries", name: "Tuna sweetcorn loaded fries", pillar: "fries", tags: ["pantry"], prep: 20, protein: 43, carb: 37, fat: 7, fiber: 8, ingredients: [["batata", 170], ["atum ao natural", 140], ["skyr", 80], ["feijão", 60], ["rúcula", 40], ["pimento", 40]], steps: ["Air-fry.", "Mix tuna."] },
  { id: "r_grao_fries", name: "Grão + skyr loaded fries", pillar: "fries", vegetarian: true, tags: ["vegetarian"], prep: 22, protein: 36, carb: 42, fat: 8, fiber: 13, ingredients: [["batata", 160], ["grão", 160], ["skyr", 150], ["rúcula", 50], ["tomate", 70], ["cebola", 30], ["paprika", 1]], steps: ["Air-fry potatoes.", "Warm chickpeas."] },
  { id: "r_creami_choc", name: "Chocolate whey + skyr pint", pillar: "creami", tags: ["creami"], prep: 8, protein: 46, carb: 18, fat: 4, fiber: 4, ingredients: [["whey", 35], ["skyr", 250], ["leite magro", 80], ["cinnamon", 1]], steps: ["Freeze pint.", "Spin Creami."] },
  { id: "r_creami_berry", name: "Morango Creami pint", pillar: "creami", tags: ["creami"], prep: 8, protein: 42, carb: 22, fat: 3, fiber: 5, ingredients: [["whey", 30], ["skyr", 220], ["banana", 60], ["leite magro", 60]], steps: ["Freeze.", "Spin."] },
  { id: "r_creami_pb", name: "Amendoim Creami pint", pillar: "creami", tags: ["creami", "fit_fast_food"], prep: 8, protein: 44, carb: 16, fat: 7, fiber: 4, ingredients: [["whey", 35], ["skyr", 240], ["leite magro", 70], ["cinnamon", 1]], steps: ["Freeze.", "Spin."] },
  { id: "r_creami_nata", name: "Café nata Creami pint", pillar: "creami", tags: ["creami"], prep: 8, protein: 43, carb: 17, fat: 4, fiber: 3, ingredients: [["whey", 32], ["skyr", 240], ["leite magro", 70], ["cinnamon", 1]], steps: ["Freeze.", "Spin with cinnamon."] },
  { id: "r_creami_mango", name: "Skyr-mango Creami", pillar: "creami", vegetarian: true, tags: ["creami", "vegetarian"], prep: 8, protein: 38, carb: 24, fat: 3, fiber: 4, ingredients: [["skyr", 280], ["banana", 80], ["leite magro", 60], ["whey", 20]], steps: ["Freeze.", "Spin."] },
  { id: "r_pizza_skyr", name: "Skyr-oat personal pizza", pillar: "pizza", tags: ["air_fryer", "fit_fast_food"], prep: 18, protein: 48, carb: 32, fat: 8, fiber: 7, ingredients: [["skyr", 150], ["aveia", 40], ["frango", 120], ["tomate", 80], ["queijo light", 25], ["rúcula", 40], ["oregano", 1]], steps: ["Mix base.", "Air-fry.", "Top chicken."] },
  { id: "r_pizza_wrap", name: "Air-fryer wrap pizza", pillar: "pizza", tags: ["air_fryer"], prep: 12, protein: 42, carb: 28, fat: 9, fiber: 6, ingredients: [["wraps", 60], ["frango", 140], ["tomate", 70], ["queijo light", 25], ["rúcula", 40], ["skyr", 40]], steps: ["Top wrap.", "Air-fry 6 min."] },
  { id: "r_pizza_chicken", name: "Chicken-crust pizza", pillar: "pizza", tags: ["high_protein"], prep: 22, protein: 55, carb: 12, fat: 10, fiber: 4, ingredients: [["frango", 200], ["ovos", 50], ["tomate", 80], ["queijo light", 25], ["rúcula", 50], ["oregano", 1]], steps: ["Press chicken crust.", "Bake.", "Top."] },
  { id: "r_pizza_white", name: "Requeijão white pizza", pillar: "pizza", tags: ["air_fryer"], prep: 16, protein: 44, carb: 26, fat: 9, fiber: 5, ingredients: [["skyr", 80], ["requeijão", 80], ["aveia", 35], ["frango", 100], ["rúcula", 40], ["cogumelos", 80]], steps: ["Base.", "White topping."] },
  { id: "r_pizza_mushroom", name: "Mushroom-skyr pizza", pillar: "pizza", vegetarian: true, tags: ["vegetarian"], prep: 16, protein: 36, carb: 30, fat: 8, fiber: 7, ingredients: [["skyr", 160], ["aveia", 40], ["cogumelos", 120], ["queijo light", 25], ["rúcula", 40], ["ovos", 50], ["oregano", 1]], steps: ["Skyr-oat base.", "Mushrooms."] },
  { id: "r_caesar", name: "Frango Caesar light", pillar: "salad", tags: ["high_fiber"], prep: 15, protein: 50, carb: 14, fat: 10, fiber: 6, ingredients: [["frango", 180], ["rúcula", 80], ["skyr", 80], ["pepino", 80], ["tomate", 70], ["pão", 25]], steps: ["Grill chicken.", "Skyr dressing."] },
  { id: "r_med_tuna", name: "Atum Mediterranean salad", pillar: "salad", tags: ["high_fiber"], prep: 10, protein: 42, carb: 18, fat: 9, fiber: 8, ingredients: [["atum ao natural", 140], ["rúcula", 80], ["tomate", 100], ["pepino", 80], ["grão", 80], ["skyr", 40]], steps: ["Bowl.", "Drain tuna."] },
  { id: "r_steak_salad", name: "Preto + potato volume salad", pillar: "salad", tags: ["air_fryer"], prep: 20, protein: 48, carb: 28, fat: 11, fiber: 7, ingredients: [["carne picada 5%", 160], ["batata", 140], ["rúcula", 70], ["tomate", 80], ["pepino", 60], ["skyr", 40]], steps: ["Air-fry potato.", "Lean beef."] },
  { id: "r_taco_salad", name: "Peri-peri taco salad", pillar: "salad", tags: ["fit_fast_food"], prep: 15, protein: 47, carb: 22, fat: 9, fiber: 8, ingredients: [["frango", 170], ["rúcula", 70], ["tomate", 80], ["pimento", 70], ["skyr", 70], ["feijão", 60], ["peri-peri", 2]], steps: ["Season chicken.", "Load greens."] },
  { id: "r_grao_egg", name: "Grão + ovo greens", pillar: "salad", vegetarian: true, tags: ["vegetarian", "high_fiber"], prep: 12, protein: 34, carb: 28, fat: 10, fiber: 11, ingredients: [["grão", 160], ["ovos", 100], ["rúcula", 80], ["tomate", 80], ["pepino", 70], ["skyr", 50]], steps: ["Boil eggs.", "Bowl."] },
  { id: "r_panc_skyr", name: "Skyr-oat blender pancakes", pillar: "pancakes", tags: ["breakfast"], prep: 12, protein: 42, carb: 32, fat: 6, fiber: 6, ingredients: [["skyr", 180], ["aveia", 50], ["ovos", 50], ["whey", 20], ["banana", 40], ["cinnamon", 1]], steps: ["Blend.", "Pan."] },
  { id: "r_panc_choc", name: "Requeijão chocolate pancakes", pillar: "pancakes", tags: ["breakfast"], prep: 12, protein: 40, carb: 28, fat: 7, fiber: 5, ingredients: [["requeijão", 120], ["aveia", 40], ["whey", 25], ["ovos", 50], ["leite magro", 40], ["cinnamon", 1]], steps: ["Blend.", "Cook low."] },
  { id: "r_panc_banana", name: "Banana-whey pancakes", pillar: "pancakes", tags: ["breakfast"], prep: 10, protein: 38, carb: 30, fat: 6, fiber: 5, ingredients: [["banana", 90], ["whey", 35], ["ovos", 100], ["aveia", 30], ["skyr", 50]], steps: ["Mash.", "Pan."] },
  { id: "r_panc_savoury", name: "Savoury egg + peru pancakes", pillar: "pancakes", tags: ["breakfast"], prep: 14, protein: 44, carb: 18, fat: 10, fiber: 4, ingredients: [["ovos", 120], ["peru", 90], ["aveia", 25], ["skyr", 40], ["espinafres", 40], ["pimento", 40]], steps: ["Mix savoury batter.", "Fold peru."] },
  { id: "r_panc_pumpkin", name: "Pumpkin-skyr pancakes", pillar: "pancakes", vegetarian: true, tags: ["vegetarian", "breakfast"], prep: 12, protein: 36, carb: 32, fat: 6, fiber: 6, ingredients: [["skyr", 180], ["aveia", 45], ["ovos", 50], ["banana", 50], ["cinnamon", 1], ["whey", 15]], steps: ["Blend.", "Pan."] },
  { id: "r_sand_frango", name: "Frango pimento sandwich", pillar: "sandwich", tags: ["lunch"], prep: 10, protein: 46, carb: 28, fat: 8, fiber: 6, ingredients: [["pão", 60], ["frango", 150], ["pimento", 60], ["rúcula", 40], ["skyr", 40], ["tomate", 50]], steps: ["Fill weighed bread."] },
  { id: "r_sand_breakfast", name: "Breakfast peru-ovo sandwich", pillar: "sandwich", tags: ["breakfast"], prep: 8, protein: 40, carb: 24, fat: 10, fiber: 5, ingredients: [["pão", 50], ["peru", 80], ["ovos", 100], ["rúcula", 30], ["tomate", 40], ["skyr", 30]], steps: ["Toast.", "Stack."] },
  { id: "r_sand_tuna", name: "Atum-iogurte sandwich", pillar: "sandwich", tags: ["pantry"], prep: 6, protein: 38, carb: 26, fat: 7, fiber: 6, ingredients: [["pão", 55], ["atum ao natural", 120], ["skyr", 50], ["rúcula", 40], ["pepino", 50], ["tomate", 40]], steps: ["Mix tuna skyr.", "Fill."] },
  { id: "r_sand_bifana", name: "Bifana-style volume sandwich", pillar: "sandwich", tags: ["fit_fast_food"], prep: 14, protein: 45, carb: 30, fat: 9, fiber: 6, ingredients: [["pão", 55], ["peru", 160], ["pimento", 70], ["rúcula", 50], ["skyr", 30], ["mostarda", 8]], steps: ["Air-fry lean pork/turkey.", "Salad volume."] },
  { id: "r_sand_veg", name: "Grilled veg requeijão sandwich", pillar: "sandwich", vegetarian: true, tags: ["vegetarian"], prep: 12, protein: 32, carb: 30, fat: 9, fiber: 8, ingredients: [["pão", 55], ["requeijão", 90], ["ovos", 50], ["pimento", 70], ["cogumelos", 80], ["rúcula", 40]], steps: ["Grill veg.", "Spread requeijão."] },
];

const proteins = [
  { name: "frango", p: 42, c: 0, f: 4 },
  { name: "peru", p: 40, c: 0, f: 3 },
  { name: "atum ao natural", p: 38, c: 0, f: 2 },
  { name: "ovos", p: 26, c: 1, f: 10 },
  { name: "carne picada 5%", p: 36, c: 0, f: 6 },
];
const bases = [
  { name: "arroz", c: 28, f: 0.5, fiber: 2, p: 3 },
  { name: "batata", c: 26, f: 0.2, fiber: 3, p: 3 },
  { name: "wraps", c: 22, f: 3, fiber: 3, p: 6 },
  { name: "feijão", c: 20, f: 1, fiber: 8, p: 10 },
  { name: "grão", c: 18, f: 3, fiber: 8, p: 9 },
  { name: "aveia", c: 24, f: 3, fiber: 5, p: 6 },
  { name: "rúcula bowl", c: 4, f: 0.3, fiber: 3, p: 2 },
  { name: "batata doce", c: 28, f: 0.2, fiber: 4, p: 2 },
  { name: "cogumelos", c: 4, f: 0.4, fiber: 2, p: 3 },
];

function broad(): Row[] {
  const out: Row[] = [];
  let n = 0;
  for (const p of proteins) {
    for (const b of bases) {
      if (out.length >= 45) break;
      n += 1;
      const protein = p.p + b.p + 12;
      const carb = b.c + 8;
      const fat = p.f + b.f + 2;
      const fiber = b.fiber + 4;
      out.push({
        id: `r_broad_${n}`,
        name: `${p.name} ${b.name} volume bowl`,
        pillar: "broad",
        tags: ["high_fiber", "bowl"],
        prep: 15,
        protein,
        carb,
        fat,
        fiber,
        ingredients: [
          [p.name, 150],
          [b.name === "rúcula bowl" ? "rúcula" : b.name, 150],
          ["skyr", 80],
          ["tomate", 80],
          ["pepino", 60],
          ["rúcula", 40],
        ],
        steps: ["Cook protein.", "Volume base.", "Cold skyr."],
      });
    }
  }
  return out;
}

export const COOKBOOK: Recipe[] = [...heroes, ...broad()].map(toRecipe);

export function recipesByPillar(pillar: string): Recipe[] {
  return COOKBOOK.filter((r) => r.pillar === pillar);
}
