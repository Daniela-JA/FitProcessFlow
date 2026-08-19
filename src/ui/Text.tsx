import { Platform, StyleSheet, Text, type TextProps } from "react-native";

import { colors } from "./theme";

type Tone = "cream" | "muted" | "olive";
type Variant = "display" | "title" | "body" | "meta" | "tabular";

export function AppText({
  children,
  variant = "body",
  tone = "cream",
  style,
  ...rest
}: TextProps & { variant?: Variant; tone?: Tone }) {
  return (
    <Text
      {...rest}
      style={[
        styles.base,
        variant === "display" && styles.display,
        variant === "title" && styles.title,
        variant === "body" && styles.body,
        variant === "meta" && styles.meta,
        variant === "tabular" && styles.tabular,
        tone === "cream" && { color: colors.cream },
        tone === "muted" && { color: colors.creamMuted },
        tone === "olive" && { color: colors.olive },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: { color: colors.cream },
  display: {
    fontFamily: Platform.select({ ios: "Georgia", default: undefined }),
    fontSize: 48,
    lineHeight: 52,
    fontVariant: ["tabular-nums"],
  },
  title: {
    fontFamily: Platform.select({ ios: "Georgia", default: undefined }),
    fontSize: 28,
    lineHeight: 34,
  },
  body: { fontSize: 16, lineHeight: 22 },
  meta: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  tabular: {
    fontSize: 22,
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.4,
  },
});
