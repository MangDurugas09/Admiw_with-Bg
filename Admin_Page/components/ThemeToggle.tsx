import { useDarkMode } from "@/lib/darkModeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const knobPosition = useRef(new Animated.Value(isDarkMode ? 36 : 6)).current;

  useEffect(() => {
    Animated.timing(knobPosition, {
      toValue: isDarkMode ? 32 : 6,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [isDarkMode, knobPosition]);

  return (
    <Pressable
      onPress={toggleDarkMode}
      accessibilityRole="switch"
      accessibilityState={{ checked: isDarkMode }}
      accessibilityLabel="Toggle dark mode"
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
      })}
    >
      {({ pressed }) => (
        <View
          style={{
            width: 62,
            height: 34,
            borderRadius: 999,
            padding: 3,
            backgroundColor: isDarkMode
              ? "rgba(16, 24, 56, 0.95)"
              : "rgba(248, 250, 252, 0.95)",
            borderWidth: 1,
            borderColor: isDarkMode
              ? "rgba(92, 112, 152, 0.45)"
              : "rgba(204, 214, 223, 0.65)",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDarkMode ? 0.14 : 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          {isDarkMode ? (
            <>
              <Text
                style={{
                  color: "#e2e8f0",
                  fontSize: 14,
                  opacity: 1,
                }}
              >
                ☾
              </Text>

              <Animated.View
                style={{
                  position: "absolute",
                  left: knobPosition,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: "#f4bf24",
                  borderWidth: 1,
                  borderColor: "rgba(255, 215, 0, 0.35)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.16,
                  shadowRadius: 10,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }}
              />

              <Text
                style={{
                  color: "#9db2df",
                  fontSize: 14,
                  opacity: 0,
                }}
              >
                ☀
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: "#94a3b8",
                  fontSize: 14,
                  opacity: 0,
                }}
              >
                ☾
              </Text>

              <Animated.View
                style={{
                  position: "absolute",
                  left: knobPosition,
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  backgroundColor: "#ffffff",
                  borderWidth: 1,
                  borderColor: "rgba(15, 23, 42, 0.08)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.16,
                  shadowRadius: 10,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                }}
              />

              <Text
                style={{
                  color: "#718096",
                  fontSize: 14,
                  opacity: 1,
                }}
              >
                ☀
              </Text>
            </>
          )}
        </View>
      )}
    </Pressable>
  );
}
