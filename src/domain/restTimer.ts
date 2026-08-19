export type RestTimerState = {
  remainingSec: number;
  running: boolean;
  durationSec: number;
};

export type RestTimerEvent =
  | { type: "start"; durationSec: number }
  | { type: "tick" }
  | { type: "skip" }
  | { type: "complete" };

export const idleRestTimer: RestTimerState = {
  remainingSec: 0,
  running: false,
  durationSec: 0,
};

export function restTimerReducer(
  state: RestTimerState,
  event: RestTimerEvent,
): RestTimerState {
  switch (event.type) {
    case "start":
      return {
        durationSec: event.durationSec,
        remainingSec: event.durationSec,
        running: event.durationSec > 0,
      };
    case "tick":
      if (!state.running) return state;
      if (state.remainingSec <= 1) {
        return { ...state, remainingSec: 0, running: false };
      }
      return { ...state, remainingSec: state.remainingSec - 1 };
    case "skip":
    case "complete":
      return { ...state, remainingSec: 0, running: false };
    default:
      return state;
  }
}

export function formatMmSs(totalSec: number): string {
  const clamped = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
