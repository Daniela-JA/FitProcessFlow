import { Redirect, Tabs } from "expo-router";

import { useAuthStore } from "../../src/stores/authStore";
import { colors } from "../../src/ui/theme";

export default function TabLayout() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  if (!hydrated) return null;
  if (!user) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopColor: colors.line,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: colors.cream,
        tabBarInactiveTintColor: colors.creamMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: "uppercase",
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="train" options={{ title: "Train" }} />
      <Tabs.Screen name="food" options={{ title: "Food" }} />
      <Tabs.Screen name="insights" options={{ title: "Insights" }} />
    </Tabs>
  );
}
