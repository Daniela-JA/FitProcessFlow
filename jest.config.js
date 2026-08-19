module.exports = {
  preset: "jest-expo",
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^react-native/setup-env$": "<rootDir>/jest.stubs/setup-env.js",
    "^test-renderer$": "react-test-renderer",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
