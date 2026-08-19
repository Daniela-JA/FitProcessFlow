import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, space } from "./theme";

export function Screen({
  children,
  tone = "train",
}: {
  children: ReactNode;
  tone?: "train" | "olive";
}) {
  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: tone === "olive" ? colors.bgOlive : colors.bg }]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.inner}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.sm },
});
