import { idleRestTimer, restTimerReducer, formatMmSs } from "./restTimer";

describe("restTimerReducer", () => {
  it("starts, ticks, and completes", () => {
    let state = restTimerReducer(idleRestTimer, { type: "start", durationSec: 3 });
    expect(state.running).toBe(true);
    expect(state.remainingSec).toBe(3);
    state = restTimerReducer(state, { type: "tick" });
    expect(state.remainingSec).toBe(2);
    state = restTimerReducer(state, { type: "tick" });
    state = restTimerReducer(state, { type: "tick" });
    expect(state.remainingSec).toBe(0);
    expect(state.running).toBe(false);
  });

  it("skips remaining time", () => {
    let state = restTimerReducer(idleRestTimer, { type: "start", durationSec: 90 });
    state = restTimerReducer(state, { type: "skip" });
    expect(state.remainingSec).toBe(0);
    expect(state.running).toBe(false);
  });

  it("formats mm:ss", () => {
    expect(formatMmSs(90)).toBe("1:30");
    expect(formatMmSs(5)).toBe("0:05");
  });
});
