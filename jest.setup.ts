import { memoryStorage } from "./src/lib/memoryStorage";

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

beforeEach(() => {
  memoryStorage.clear();
});
