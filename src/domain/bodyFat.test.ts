import { navyBodyFatPct, leanMassKg } from "./bodyFat";

describe("navy body fat", () => {
  it("matches the male 70in / 16 neck / 36 abdomen fixture", () => {
    const pct = navyBodyFatPct({
      sex: "male",
      heightCm: 70 * 2.54,
      neckCm: 16 * 2.54,
      waistCm: 36 * 2.54,
      abdomenCm: 36 * 2.54,
    });
    expect(pct).toBeCloseTo(19.45, 1);
  });

  it("computes lean mass from BF%", () => {
    expect(leanMassKg(80, 20)).toBeCloseTo(64, 1);
  });
});
