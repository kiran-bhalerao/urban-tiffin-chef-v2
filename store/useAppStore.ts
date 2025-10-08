import { I_LANGUAGE } from "@/i18n";
import { persistConfig } from "@/store/config";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUser {
  _id: string;
  mobile: number;
  email: string;
  fssai: string;
  emailVerified: boolean;
  name: string;
  kitchen: {
    _id: string;
    name: string;
    kitchenHub: string;
    rating: number;
    active: boolean;
    contacts: any[];
    kitchenManager: string;
    image: string;
    descriptions: string;
    description: string;
  };
}

interface AppState {
  user: undefined | IUser;
  lang: I_LANGUAGE;
  accessToken: string | undefined;
  setLang: (lang: AppState["lang"]) => void;
  setAccessToken: (accessToken: AppState["accessToken"]) => void;
  setUser: (user: AppState["user"]) => void;
  logout: () => void;
}

export const DEFAULT_LANG: I_LANGUAGE = "en";

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: undefined,
      lang: DEFAULT_LANG,
      accessToken: undefined,
      setLang: (lang) => set((state) => ({ lang })),
      setAccessToken: (accessToken) => set((state) => ({ accessToken })),
      setUser: (user) => set((state) => ({ user })),
      logout: () => {
        set((_) => ({ accessToken: undefined, user: undefined }));
      },
    }),
    persistConfig
  )
);
