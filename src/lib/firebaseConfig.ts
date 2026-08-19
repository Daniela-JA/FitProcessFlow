import Constants from "expo-constants";

export type FirebasePublicConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export function readFirebaseConfig(): FirebasePublicConfig | null {
  const extra = Constants.expoConfig?.extra as
    | Partial<FirebasePublicConfig>
    | undefined;
  const apiKey =
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? extra?.apiKey ?? "";
  const projectId =
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? extra?.projectId ?? "";
  if (!apiKey || !projectId) return null;
  return {
    apiKey,
    authDomain:
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? extra?.authDomain ?? "",
    projectId,
    storageBucket:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? extra?.storageBucket ?? "",
    messagingSenderId:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??
      extra?.messagingSenderId ??
      "",
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? extra?.appId ?? "",
  };
}
