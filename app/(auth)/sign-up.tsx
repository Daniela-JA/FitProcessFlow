import { Link } from "expo-router";
import { View } from "react-native";

import { SignInForm } from "../../src/features/auth/SignInForm";
import { useAuthStore } from "../../src/stores/authStore";
import { Screen } from "../../src/ui/Screen";
import { AppText } from "../../src/ui/Text";
import { space } from "../../src/ui/theme";

export default function SignUpScreen() {
  const signUp = useAuthStore((s) => s.signUp);
  const error = useAuthStore((s) => s.error);

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", gap: space.lg }}>
        <AppText variant="meta" tone="muted">
          FitProcessFlow
        </AppText>
        <AppText variant="title">Create account</AppText>
        <SignInForm submitLabel="Create" onSubmit={signUp} />
        {error ? <AppText tone="muted">{error}</AppText> : null}
        <Link href="/(auth)/sign-in">
          <AppText variant="meta" tone="olive">
            Have an account
          </AppText>
        </Link>
      </View>
    </Screen>
  );
}
