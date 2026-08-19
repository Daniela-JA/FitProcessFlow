import { fireEvent, render, screen } from "@testing-library/react-native";

import { generateWeek, DEFAULT_PROGRAM } from "../../domain/program";
import { createLog } from "../../domain/workoutLog";
import { ActiveSession } from "./ActiveSession";

describe("ActiveSession", () => {
  it("completes the current set", () => {
    const template = generateWeek(DEFAULT_PROGRAM)[0];
    const log = createLog(template, "u1");
    const onCompleteSet = jest.fn();
    render(
      <ActiveSession
        log={log}
        template={template}
        previousLogs={[]}
        elapsedSec={12}
        onCompleteSet={onCompleteSet}
        onFinish={jest.fn()}
      />,
    );
    fireEvent.press(screen.getByRole("button", { name: "Complete set" }));
    expect(onCompleteSet).toHaveBeenCalled();
    const first = log.sets[0];
    expect(onCompleteSet.mock.calls[0][0]).toBe(first.exerciseId);
    expect(onCompleteSet.mock.calls[0][1]).toBe(first.setIndex);
  });
});
