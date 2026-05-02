import { useDarkMode } from "./darkModeContext";

export const darkPalette = {
  bg: "#020a2b",
  bgSoft: "#071544",
  card: "rgba(10, 32, 82, 0.88)",
  cardBorder: "rgba(117, 151, 221, 0.36)",
  panel: "rgba(7, 21, 68, 0.9)",
  panelSoft: "rgba(5, 17, 55, 0.95)",
  sidebar: "rgba(5, 17, 55, 0.93)",
  rowBorder: "rgba(157,178,223,0.22)",
  inputBorder: "rgba(157,178,223,0.35)",
  text: "#f3f6ff",
  textMuted: "#9db2df",
  accent: "#f4bf24",
  accentSoft: "rgba(244, 191, 36, 0.2)",
  cyan: "#12c6ff",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export const lightPalette = {
  bg: "#edf6ff",
  bgSoft: "#dceeff",
  card: "rgba(255, 255, 255, 0.88)",
  cardBorder: "rgba(62, 103, 148, 0.22)",
  panel: "rgba(255, 255, 255, 0.9)",
  panelSoft: "rgba(246, 251, 255, 0.96)",
  sidebar: "rgba(255, 255, 255, 0.9)",
  rowBorder: "rgba(62, 103, 148, 0.18)",
  inputBorder: "rgba(62, 103, 148, 0.28)",
  text: "#11213b",
  textMuted: "#52657f",
  accent: "#e0a817",
  accentSoft: "rgba(224, 168, 23, 0.17)",
  cyan: "#087fb1",
  success: "#15803d",
  warning: "#b77904",
  danger: "#dc2626",
};

export type AppPalette = typeof darkPalette;

export const palette = darkPalette;

export function getPalette(isDarkMode: boolean): AppPalette {
  return isDarkMode ? darkPalette : lightPalette;
}

export function useThemePalette() {
  const { isDarkMode } = useDarkMode();
  return getPalette(isDarkMode);
}
