import type { FoodItem } from "../data/foods";
import { kcalFromMacros } from "../domain/macros";
import { emptyMicros } from "../domain/rdi";

export async function searchOpenFoodFacts(query: string): Promise<FoodItem[]> {
  const q = query.trim();
  if (!q) return [];
  const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=8`;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    const json = (await res.json()) as { products?: Array<Record<string, unknown>> };
    return (json.products ?? []).map(mapProduct).filter((f): f is FoodItem => Boolean(f));
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

export async function foodByBarcode(code: string): Promise<FoodItem | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json`;
  try {
    const res = await fetch(url);
    const json = (await res.json()) as { product?: Record<string, unknown> };
    return json.product ? mapProduct(json.product) : null;
  } catch {
    return null;
  }
}

function num(v: unknown): number {
  return typeof v === "number" ? v : Number(v) || 0;
}

function mapProduct(p: Record<string, unknown>): FoodItem | null {
  const n = (p.nutriments ?? {}) as Record<string, unknown>;
  const name = String(p.product_name || p.brands || "").trim();
  if (!name) return null;
  const protein = num(n["proteins_100g"]);
  const carb = num(n["carbohydrates_100g"]);
  const fat = num(n["fat_100g"]);
  return {
    id: `off_${String(p.code ?? name)}`,
    source: "off",
    name,
    barcode: p.code ? String(p.code) : undefined,
    servingG: 100,
    macros: {
      kcal: kcalFromMacros(protein, carb, fat),
      proteinG: protein,
      carbG: carb,
      fatG: fat,
      fiberG: num(n["fiber_100g"]),
      sodiumMg: num(n["sodium_100g"]) * 1000,
    },
    micros: emptyMicros(),
  };
}
