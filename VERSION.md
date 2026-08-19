# FitProcessFlow 1.0.0

Personal daily driver. Dark-only. Tape is source of truth for body fat. Progress photos never leave the device.

## Day 1–6 shipped
- Auth (Firebase if configured, else on-device)
- Train generator: Minimalist 45 / Max Results 90 × sex × 2–6 days
- Logger: last set, 3-session average, rest timer, +0.5/1.25/2.5 kg
- Navy tape BF% + LBM; on-device photo estimate + confidence (no upload)
- Mock Health steps/sleep (swap HealthKit in a native build)
- ~80 Portugal-supermarket recipes, density kcal/protein ≤ 20, ≤10 ingredients
- Diary, barcode/name search (Open Food Facts), copy yesterday, grocery from plan
- Food score 40/30/20/10 (kcal/protein/micros/fiber)
- Training score equal fifths (session, quality, strength, steps, sleep)
- Insights at 07:00 copy, wins + least-effort swaps, micro alerts D/iron/zinc
- JSON/CSV export helpers, offline outbox helper

## Formula versions
- Navy / DoD tape, cm converted to inches internally
- Photo BF: on-device Deurenberg-from-BMI + pose quality confidence. Not a CV model. Tape wins if they disagree.
- LBM targets: 2.4 g/kg protein, 0.9 g/kg fat, remainder carbs, plus workout/cardio/step kcal, ±nudge

## Known limits
- Expo Go: HealthKit not live (mock). Camera barcode is manual/search. Photos stored as local URIs.
- NativeWind is configured; screens use the design tokens/StyleSheet so the look is not a generic template.
- No production EAS binary in this pass — run `npx eas build` when the Apple account is ready.
