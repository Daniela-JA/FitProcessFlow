import { Redirect, Stack } from "expo-router";

import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/ui/theme";

export const unstable_settings = {
  initialRouteName: "sign-in",
};

export default function AuthLayout() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return null;
  if (user) return <Redirect href="/(tabs)" />;
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    />
  );
}
