import { create } from "zustand";
import { persist } from "zustand/middleware";

import { validateEmail, validatePassword } from "../domain/auth";
import {
  firebaseEnabled,
  firebaseSignIn,
  firebaseSignOutUser,
  firebaseSignUp,
  listenFirebaseUser,
} from "../lib/firebase";
import { persistStorage } from "../lib/persistStorage";

export type SessionUser = { uid: string; email: string };

type AuthState = {
  user: SessionUser | null;
  hydrated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  hydrateRemote: () => () => void;
};

function localUid(email: string): string {
  return `local_${email.trim().toLowerCase()}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      error: null,
      signIn: async (email, password) => {
        const e = validateEmail(email) ?? validatePassword(password);
        if (e) {
          set({ error: e });
          return false;
        }
        try {
          if (firebaseEnabled()) {
            const user = await firebaseSignIn(email.trim(), password);
            set({ user, error: null });
            return true;
          }
          const existing = get().user;
          if (existing && existing.email === email.trim().toLowerCase()) {
            set({ error: null });
            return true;
          }
          set({
            user: { uid: localUid(email), email: email.trim().toLowerCase() },
            error: null,
          });
          return true;
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Sign in failed" });
          return false;
        }
      },
      signUp: async (email, password) => {
        const e = validateEmail(email) ?? validatePassword(password);
        if (e) {
          set({ error: e });
          return false;
        }
        try {
          if (firebaseEnabled()) {
            const user = await firebaseSignUp(email.trim(), password);
            set({ user, error: null });
            return true;
          }
          set({
            user: { uid: localUid(email), email: email.trim().toLowerCase() },
            error: null,
          });
          return true;
        } catch (err) {
          set({ error: err instanceof Error ? err.message : "Sign up failed" });
          return false;
        }
      },
      signOut: async () => {
        await firebaseSignOutUser();
        set({ user: null, error: null });
      },
      hydrateRemote: () => {
        if (!firebaseEnabled()) {
          set({ hydrated: true });
          return () => undefined;
        }
        return listenFirebaseUser((user) => {
          set({ user, hydrated: true });
        });
      },
    }),
    {
      name: "fpf-auth",
      storage: persistStorage(),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
