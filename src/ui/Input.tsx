import { StyleSheet, Text, TextInput, View } from "react-native";

import { colors, space } from "./theme";

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = "none",
  error,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "decimal-pad";
  autoCapitalize?: "none" | "sentences";
  error?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.creamMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        style={styles.field}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs, marginBottom: space.md },
  label: {
    color: colors.creamMuted,
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  field: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
    color: colors.cream,
    fontSize: 18,
    paddingVertical: 10,
  },
  error: { color: colors.danger, fontSize: 12 },
});
