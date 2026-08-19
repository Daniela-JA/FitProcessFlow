import { generateWeek } from "./program";

describe("generateWeek", () => {
  it("emits 4 minimalist male sessions of 45 minutes", () => {
    const week = generateWeek({ style: "minimalist", sex: "male", daysPerWeek: 4 });
    expect(week).toHaveLength(4);
    expect(week.every((t) => t.targetMinutes === 45)).toBe(true);
    expect(week[0].name).toBe("Full body A");
    expect(week[1].name).toBe("Full body B");
  });

  it("adds extra glute volume for women max results", () => {
    const men = generateWeek({ style: "max_results", sex: "male", daysPerWeek: 4 });
    const women = generateWeek({ style: "max_results", sex: "female", daysPerWeek: 4 });
    const menIds = men[0].items.map((i) => i.exerciseId);
    const womenIds = women[0].items.map((i) => i.exerciseId);
    expect(womenIds).toContain("ex_thrust");
    expect(women[0].targetMinutes).toBe(90);
    expect(menIds.length).toBeGreaterThan(0);
  });

  it("trims sets at 6 days so weekly volume does not explode", () => {
    const four = generateWeek({ style: "minimalist", sex: "male", daysPerWeek: 4 });
    const six = generateWeek({ style: "minimalist", sex: "male", daysPerWeek: 6 });
    expect(six).toHaveLength(6);
    expect(six[0].items[0].sets).toBeLessThanOrEqual(four[0].items[0].sets);
  });
});
