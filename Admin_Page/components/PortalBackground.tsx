import { useDarkMode } from "@/lib/darkModeContext";
import { getPalette } from "@/lib/theme";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

const dayBackground = require("../assets/images/day_bg.png");
const darkBackground = require("../assets/images/electripay-bg.jpg");

export function PortalBackground({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode();
  const theme = getPalette(isDarkMode);
  const sweep = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;
  const backgroundFade = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const sweepLoop = Animated.loop(
      Animated.timing(sweep, {
        toValue: 1,
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }),
    );
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );

    sweepLoop.start();
    pulseLoop.start();

    return () => {
      sweepLoop.stop();
      pulseLoop.stop();
    };
  }, [pulse, sweep]);

  useEffect(() => {
    Animated.timing(backgroundFade, {
      toValue: isDarkMode ? 1 : 0,
      duration: 650,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [backgroundFade, isDarkMode]);

  const travel = Math.max(width, height) + 360;
  const sweepTranslate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [-travel, travel],
  });
  const reverseSweepTranslate = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [travel * 0.75, -travel * 0.75],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.08, 0.2],
  });
  const dayOpacity = backgroundFade.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const darkOpacity = backgroundFade;

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: theme.bg,
        overflow: "hidden",
      }}
    >
      <Animated.Image
        source={dayBackground}
        resizeMode="cover"
        style={[styles.backgroundImage, { opacity: dayOpacity }]}
      />
      <Animated.Image
        source={darkBackground}
        resizeMode="cover"
        style={[styles.backgroundImage, { opacity: darkOpacity }]}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: isDarkMode
            ? "rgba(2, 10, 43, 0.36)"
            : "rgba(235, 248, 255, 0.16)",
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -height * 0.2,
          left: width * 0.2,
          width: 90,
          height: height * 1.45,
          borderRadius: 999,
          backgroundColor: isDarkMode
            ? "rgba(18, 198, 255, 0.2)"
            : "rgba(255, 255, 255, 0.34)",
          opacity: pulseOpacity,
          transform: [{ rotate: "28deg" }, { translateX: sweepTranslate }],
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: -height * 0.25,
          left: width * 0.55,
          width: 46,
          height: height * 1.55,
          borderRadius: 999,
          backgroundColor: isDarkMode
            ? "rgba(244, 191, 36, 0.18)"
            : "rgba(8, 127, 177, 0.18)",
          opacity: 0.22,
          transform: [{ rotate: "28deg" }, { translateX: reverseSweepTranslate }],
        }}
      />
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: "100%",
          height: 240,
          top: 0,
          backgroundColor: isDarkMode
            ? "rgba(7, 21, 68, 0.62)"
            : "rgba(255, 255, 255, 0.34)",
          opacity: pulse.interpolate({
            inputRange: [0, 1],
            outputRange: [0.88, 1],
          }),
        }}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
});
