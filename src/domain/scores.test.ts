import { emptyMicros } from "./rdi";
import { foodScore10, trainingScore10 } from "./scores";
import { enqueue, drain } from "./outbox";
import { leastEffortSwaps, cheerleaderLine } from "./insights";
import { COOKBOOK } from "../data/cookbook";

describe("scores", () => {
  it("weights food kcal 40 / protein 30 / micros 20 / fiber 10", () => {
    const perfect = foodScore10({
      sex: "female",
      actual: {
        kcal: 1800,
        proteinG: 140,
        carbG: 100,
        fatG: 50,
        fiberG: 28,
        sodiumMg: 1,
        micros: { ...emptyMicros(), vitaminC_mg: 90, calcium_mg: 1300, iron_mg: 18, potassium_mg: 4700, vitaminA_mcg: 900, vitaminD_mcg: 20, vitaminE_mg: 15, vitaminK_mcg: 90, thiamin_mg: 1.2, riboflavin_mg: 1.3, niacin_mg: 16, vitaminB6_mg: 1.7, folate_mcg: 400, vitaminB12_mcg: 2.4, magnesium_mg: 320, zinc_mg: 8 },
      },
      target: { kcal: 1800, proteinG: 140, carbG: 100, fatG: 50, fiberG: 28, sodiumMg: 1 },
    });
    expect(perfect).toBeGreaterThan(8);
  });

  it("does not punish rest days for missed sessions", () => {
    expect(
      trainingScore10({
        isLiftDay: false,
        sessionCompleted: false,
        setsCompleted: 0,
        setsPrescribed: 0,
        strengthDeltaPct: 0,
        steps: 8000,
        stepTarget: 8000,
        sleepHours: 8,
        sleepNeeded: 8,
      }),
    ).toBeGreaterThan(8);
  });
});

describe("outbox", () => {
  it("retries failed sends", async () => {
    const box = enqueue([], { id: "1", kind: "workout", payload: {} });
    const left = await drain(box, async () => {
      throw new Error("offline");
    });
    expect(left[0].attempts).toBe(1);
  });
});

describe("insights", () => {
  it("offers least-effort swaps without morality", () => {
    const swaps = leastEffortSwaps({
      actual: { kcal: 2300, proteinG: 80, carbG: 200, fatG: 80, fiberG: 10, sodiumMg: 1 },
      target: { kcal: 1800, proteinG: 140, carbG: 150, fatG: 50, fiberG: 28, sodiumMg: 1 },
      recipes: COOKBOOK,
    });
    expect(swaps.length).toBeGreaterThan(0);
    expect(cheerleaderLine(5, 6).length).toBeGreaterThan(10);
  });
});
