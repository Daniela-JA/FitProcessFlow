import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import "../global.css";
import { colors } from "../src/ui/theme";
import { useAuthStore } from "../src/stores/authStore";

export default function RootLayout() {
  const hydrateRemote = useAuthStore((s) => s.hydrateRemote);

  useEffect(() => {
    const unsub = hydrateRemote();
    return unsub;
  }, [hydrateRemote]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="session/[id]" options={{ gestureEnabled: false }} />
        <Stack.Screen name="template/[id]" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="measure" />
        <Stack.Screen name="photo" />
        <Stack.Screen name="cardio" />
        <Stack.Screen name="recipe/[id]" />
        <Stack.Screen name="barcode" />
      </Stack>
    </>
  );
}
