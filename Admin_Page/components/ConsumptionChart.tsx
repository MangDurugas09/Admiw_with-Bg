import { useThemePalette } from "@/lib/theme";
import { Text, View } from "react-native";

export interface ConsumptionData {
  name: string;
  usage: number;
  maxUsage?: number;
}

interface ConsumptionChartProps {
  data: ConsumptionData[];
  height?: number;
  showLabels?: boolean;
  barColor?: string;
}

export function ConsumptionChart({
  data,
  height = 200,
  showLabels = true,
  barColor,
}: ConsumptionChartProps) {
  const palette = useThemePalette();
  const activeBarColor = barColor || palette.accent;

  if (!data || data.length === 0) {
    return (
      <View
        style={{
          height,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: palette.panelSoft,
          borderWidth: 1,
          borderColor: "rgba(157,178,223,0.35)",
        }}
      >
        <Text style={{ color: palette.textMuted }}>No data available</Text>
      </View>
    );
  }

  const maxUsage = Math.max(...data.map((d) => d.maxUsage || d.usage));
  const chartHeight = height - (showLabels ? 40 : 20);
  const barWidth = Math.max(30, 100 / data.length);

  return (
    <View
      style={{
        backgroundColor: palette.panelSoft,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(157,178,223,0.35)",
        padding: 12,
      }}
    >
      {/* Chart */}
      <View
        style={{
          height: chartHeight,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "space-around",
          gap: 8,
          marginBottom: showLabels ? 12 : 0,
        }}
      >
        {data.map((item, index) => {
          const barHeight = (item.usage / maxUsage) * chartHeight;
          return (
            <View key={index} style={{ alignItems: "center", gap: 4 }}>
              <View
                style={{
                  width: barWidth,
                  height: barHeight,
                  backgroundColor: activeBarColor,
                  borderRadius: 4,
                  opacity: 0.85,
                }}
              />
              {/* Value Label */}
              <Text
                style={{
                  color: palette.accent,
                  fontSize: 10,
                  fontWeight: "700",
                }}
              >
                {item.usage.toFixed(0)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* X-axis Labels */}
      {showLabels && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: "rgba(157,178,223,0.22)",
            paddingTop: 8,
          }}
        >
          {data.map((item, index) => (
            <Text
              key={index}
              numberOfLines={1}
              style={{
                color: palette.textMuted,
                fontSize: 9,
                maxWidth: barWidth + 10,
                textAlign: "center",
              }}
            >
              {item.name}
            </Text>
          ))}
        </View>
      )}

      {/* Legend */}
      <View
        style={{
          marginTop: 12,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: "rgba(157,178,223,0.22)",
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        }}
      >
        <View
          style={{
            width: 12,
            height: 12,
            backgroundColor: activeBarColor,
            borderRadius: 2,
          }}
        />
        <Text style={{ color: palette.textMuted, fontSize: 12 }}>
          Consumption (kWh)
        </Text>
      </View>
    </View>
  );
}
