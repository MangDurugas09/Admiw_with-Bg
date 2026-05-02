import { AdminShell } from "@/components/AdminShell";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { fetchSettings, saveSettings } from "@/lib/adminApi";
import { useThemePalette } from "@/lib/theme";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function SettingsPage() {
  const palette = useThemePalette();
  const [electricityRate, setElectricityRate] = useState("12.5");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "weekly">(
    "monthly",
  );
  const [latePenaltyPercent, setLatePenaltyPercent] = useState("5");
  const [message, setMessage] = useState("");
  const [saveConfirm, setSaveConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((response) => {
        setElectricityRate(String(response.settings.electricityRate));
        setBillingCycle(response.settings.billingCycle);
        setLatePenaltyPercent(String(response.settings.latePenaltyPercent));
      })
      .catch((error) =>
        setMessage(
          error instanceof Error ? error.message : "Unable to load settings",
        ),
      );
  }, []);

  return (
    <AdminShell
      title="System Settings"
      subtitle="Control rates, billing cycles, and late penalties"
    >
      <View style={panel(palette)}>
        <Text style={label(palette)}>Electricity Rate (PHP per kWh)</Text>
        <TextInput
          value={electricityRate}
          onChangeText={setElectricityRate}
          style={input(palette)}
        />

        <Text style={[label(palette), { marginTop: 12 }]}>Billing Cycle</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {(["monthly", "weekly"] as const).map((item) => (
            <Pressable
              key={item}
              onPress={() => setBillingCycle(item)}
              style={{
                borderRadius: 10,
                borderWidth: 1,
                borderColor:
                  billingCycle === item
                    ? palette.accent
                    : "rgba(157,178,223,0.35)",
                backgroundColor:
                  billingCycle === item
                    ? "rgba(244,191,36,0.14)"
                    : "transparent",
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text
                style={{
                  color:
                    billingCycle === item ? palette.accent : palette.textMuted,
                }}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={[label(palette), { marginTop: 12 }]}>Late Penalty (%)</Text>
        <TextInput
          value={latePenaltyPercent}
          onChangeText={setLatePenaltyPercent}
          style={input(palette)}
        />

        <Pressable onPress={() => setSaveConfirm(true)} style={primaryBtn(palette)}>
          <Text style={{ color: "#1b1e2f", fontWeight: "800" }}>
            Save Settings
          </Text>
        </Pressable>

        {message ? (
          <Text style={{ color: palette.textMuted, marginTop: 10 }}>
            {message}
          </Text>
        ) : null}
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={saveConfirm}
        title="Save Settings"
        message={`Are you sure you want to save these system settings? This will affect billing calculations for all users.`}
        confirmText="Save"
        cancelText="Cancel"
        isDangerous={false}
        isLoading={isSaving}
        onConfirm={async () => {
          setIsSaving(true);
          try {
            const response = await saveSettings({
              electricityRate: Number(electricityRate || 0),
              billingCycle,
              latePenaltyPercent: Number(latePenaltyPercent || 0),
            });
            setMessage(`Settings saved (${response.source})`);
            setSaveConfirm(false);
          } catch (error) {
            setMessage(
              error instanceof Error
                ? error.message
                : "Failed to save settings",
            );
          } finally {
            setIsSaving(false);
          }
        }}
        onCancel={() => setSaveConfirm(false)}
      />
    </AdminShell>
  );
}

const panel = (palette: ReturnType<typeof useThemePalette>) => ({
  borderWidth: 1,
  borderColor: palette.cardBorder,
  borderRadius: 14,
  backgroundColor: palette.panel,
  padding: 14,
  maxWidth: 560,
});

const label = (palette: ReturnType<typeof useThemePalette>) => ({
  color: palette.textMuted,
  marginBottom: 6,
});

const input = (palette: ReturnType<typeof useThemePalette>) => ({
  borderWidth: 1,
  borderColor: palette.inputBorder,
  borderRadius: 10,
  backgroundColor: palette.panelSoft,
  color: palette.text,
  paddingHorizontal: 12,
  paddingVertical: 10,
});

const primaryBtn = (palette: ReturnType<typeof useThemePalette>) => ({
  borderRadius: 10,
  backgroundColor: palette.accent,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginTop: 16,
  alignSelf: "flex-start" as const,
});
