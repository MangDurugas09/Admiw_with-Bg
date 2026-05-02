import { useMemo, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import { useThemePalette } from "@/lib/theme";
import { useAdminUsers } from "@/lib/useAdminUsers";

export default function BillsPage() {
  const palette = useThemePalette();
  const { users } = useAdminUsers();
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      users.filter((user) =>
        `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())
      ),
    [users, query]
  );

  return (
    <AdminShell
      title="Billing Management"
      subtitle="Paid/Unpaid is automatically based on receipt approval status"
    >
      <View style={panel(palette)}>
        <TextInput
          placeholder="Search users"
          placeholderTextColor="#7f95c5"
          value={query}
          onChangeText={setQuery}
          style={input(palette)}
        />

        {rows.map((user) => (
          <View key={user._id} style={[row(palette), { flexWrap: "wrap" }]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: palette.text, fontWeight: "800" }}>{user.name}</Text>
              <Text style={{ color: palette.textMuted }}>{user.email}</Text>
              <Text style={{ color: palette.textMuted }}>Amount Due: PHP {user.amountDue.toLocaleString()}</Text>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: user.paymentStatus === "Paid" ? palette.success : palette.warning,
                backgroundColor:
                  user.paymentStatus === "Paid"
                    ? "rgba(34,197,94,0.2)"
                    : "rgba(245,158,11,0.2)",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
              }}
            >
              <Text style={{ color: palette.text, fontWeight: "700" }}>{user.paymentStatus}</Text>
            </View>
          </View>
        ))}
      </View>
    </AdminShell>
  );
}

const panel = (palette: ReturnType<typeof useThemePalette>) => ({
  borderWidth: 1,
  borderColor: palette.cardBorder,
  borderRadius: 14,
  backgroundColor: palette.panel,
  padding: 14,
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

const row = (palette: ReturnType<typeof useThemePalette>) => ({
  marginTop: 10,
  borderWidth: 1,
  borderColor: palette.rowBorder,
  borderRadius: 10,
  padding: 10,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  flexWrap: "wrap" as const,
  gap: 10,
});
