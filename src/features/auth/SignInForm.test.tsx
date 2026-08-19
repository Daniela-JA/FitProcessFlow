import { fireEvent, render, screen } from "@testing-library/react-native";

import { SignInForm } from "./SignInForm";

describe("SignInForm", () => {
  it("shows validation before submit", async () => {
    const onSubmit = jest.fn();
    render(<SignInForm submitLabel="Enter" onSubmit={onSubmit} />);
    fireEvent.press(screen.getByRole("button", { name: "Enter" }));
    expect(await screen.findByText("Email is required")).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
