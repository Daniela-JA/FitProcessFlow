import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

import { memoryStorage } from "./memoryStorage";

export function persistStorage() {
  if (process.env.NODE_ENV === "test") {
    return createJSONStorage(() => memoryStorage);
  }
  return createJSONStorage(() => AsyncStorage);
}
