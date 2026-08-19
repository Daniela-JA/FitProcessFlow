import type { ReactNode } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

import { colors, space } from "./theme";

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
    padding: space.md,
    gap: space.sm,
  },
  title: {
    color: colors.cream,
    fontSize: 18,
    fontFamily: Platform.select({ ios: "Georgia", default: undefined }),
  },
});
