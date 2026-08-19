import { Pressable, StyleSheet, Text } from "react-native";

import { colors, space } from "./theme";

export function Button({
  label,
  onPress,
  disabled,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "ghost" | "danger";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "primary" ? styles.labelOnCream : styles.labelCream,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: space.lg,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
  },
  primary: { backgroundColor: colors.cream },
  ghost: { backgroundColor: "transparent", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.line },
  danger: { backgroundColor: "transparent", borderWidth: StyleSheet.hairlineWidth, borderColor: colors.danger },
  pressed: { opacity: 0.72 },
  disabled: { opacity: 0.35 },
  label: {
    fontSize: 15,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  labelOnCream: { color: colors.bg },
  labelCream: { color: colors.cream },
});
