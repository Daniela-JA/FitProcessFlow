import { useState } from "react";
import { View } from "react-native";

import { validateEmail, validatePassword } from "../../domain/auth";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { space } from "../../ui/theme";

export function SignInForm({
  submitLabel,
  onSubmit,
  busy,
}: {
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<boolean> | boolean;
  busy?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();

  async function submit() {
    const e = validateEmail(email);
    const p = validatePassword(password);
    setEmailError(e ?? undefined);
    setPasswordError(p ?? undefined);
    if (e || p) return;
    await onSubmit(email, password);
  }

  return (
    <View style={{ gap: space.md }}>
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        error={emailError}
      />
      <Input
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={passwordError}
      />
      <Button label={submitLabel} onPress={submit} disabled={busy} />
    </View>
  );
}
