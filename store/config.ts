import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage } from "zustand/middleware";

export const persistConfig = {
  name: "app-storage",
  storage: createJSONStorage(() => AsyncStorage),
};
