import { PortalBackground } from "@/components/PortalBackground";
import { useAuth } from "@/lib/auth";
import { useThemePalette } from "@/lib/theme";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Index() {
  const palette = useThemePalette();
  const { signIn } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSignIn() {
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your admin username/email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn(identifier, password);
      router.replace("/dashboard");
    } catch (authError) {
      const message =
        authError instanceof Error ? authError.message : "Unable to sign in right now";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PortalBackground>
      <View style={{ flex: 1, padding: 24 }}>
        <View
          style={{
            maxWidth: 460,
            width: "100%",
            alignSelf: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: palette.cardBorder,
              backgroundColor: palette.card,
              borderRadius: 28,
              padding: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.28,
              shadowRadius: 24,
              elevation: 10,
              gap: 18,
            }}
          >
            <View
              style={{
                alignItems: "center",
                gap: 12,
              }}
            >
              <Image
                source={require("../assets/images/Electripay-final-logo-transparent.png")}
                style={{ width: 68, height: 68 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: palette.text,
                  fontSize: 38,
                  fontFamily: "ElectricFormula",
                  letterSpacing: 0.6,
                }}
              >
                ELECTRIPAY
              </Text>
              <Text style={{ color: palette.textMuted, fontSize: 14, textAlign: "center" }}>
                Admin login page
              </Text>
            </View>

            <View
              style={{
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.15)",
                padding: 22,
                backgroundColor: palette.panel,
                gap: 12,
              }}
            >
              <Text style={{ color: palette.text, fontSize: 20, fontWeight: "800" }}>
                Admin Sign In
              </Text>
              <Text style={{ color: palette.textMuted, lineHeight: 20 }}>
                Sign in to manage users, billing, receipts, and system settings.
              </Text>
              <TextInput
                placeholder="Admin email or username"
                placeholderTextColor="#7186ba"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                style={fieldStyle(palette)}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor="#7186ba"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={fieldStyle(palette)}
              />
              {error ? <Text style={{ color: palette.danger }}>{error}</Text> : null}
              <Pressable
                onPress={handleSignIn}
                disabled={isSubmitting}
                style={{
                  marginTop: 6,
                  borderRadius: 12,
                  paddingVertical: 13,
                  backgroundColor: isSubmitting ? "#42a9cd" : palette.cyan,
                  alignItems: "center",
                }}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#03203a" />
                ) : (
                  <Text style={{ color: "#03203a", fontWeight: "800" }}>Log In</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </PortalBackground>
  );
}

const fieldStyle = (palette: ReturnType<typeof useThemePalette>) => ({
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  backgroundColor: palette.panelSoft,
  color: palette.text,
  borderWidth: 1,
  borderColor: palette.inputBorder,
});
