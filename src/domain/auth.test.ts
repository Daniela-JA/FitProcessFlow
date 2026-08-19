import { validateEmail, validatePassword } from "./auth";

describe("auth validation", () => {
  it("rejects empty and malformed email", () => {
    expect(validateEmail("")).toBeTruthy();
    expect(validateEmail("not-an-email")).toBeTruthy();
    expect(validateEmail("a@b.com")).toBeNull();
  });

  it("requires 8 character passwords", () => {
    expect(validatePassword("short")).toBeTruthy();
    expect(validatePassword("longenough")).toBeNull();
  });
});
