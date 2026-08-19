import { memoryStorage } from "../lib/memoryStorage";
import { generateWeek, DEFAULT_PROGRAM } from "./program";
import { createLog, finishLog } from "./workoutLog";

describe("local persist of a finished workout", () => {
  beforeEach(() => {
    memoryStorage.clear();
  });

  it("round-trips a finished log through storage", async () => {
    const template = generateWeek(DEFAULT_PROGRAM)[0];
    const finished = finishLog(createLog(template, "u1"));
    await memoryStorage.setItem("fpf-workouts", JSON.stringify({ state: { logs: [finished] } }));
    const raw = await memoryStorage.getItem("fpf-workouts");
    const parsed = JSON.parse(raw ?? "{}") as { state: { logs: typeof finished[] } };
    expect(parsed.state.logs[0].id).toBe(finished.id);
    expect(parsed.state.logs[0].endedAt).toBeTruthy();
    expect(parsed.state.logs[0].durationSec).toBeGreaterThanOrEqual(0);
  });
});
