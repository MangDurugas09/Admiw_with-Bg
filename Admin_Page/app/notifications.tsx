import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { AdminShell } from "@/components/AdminShell";
import {
  createAdminNotification,
  fetchAdminNotifications,
  type AdminNotificationRecord,
} from "@/lib/adminApi";
import { useThemePalette } from "@/lib/theme";

export default function NotificationsPage() {
  const palette = useThemePalette();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("ElectriPay Notice");
  const [feed, setFeed] = useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetchAdminNotifications();
        setFeed(response.notifications);
        setStatus(
          response.notifications.length > 0
            ? `Loaded from ${response.source}`
            : `No notifications yet (${response.source})`
        );
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to load notifications");
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, []);

  return (
    <AdminShell title="Notifications" subtitle="Send announcements and unpaid bill reminders">
      <View style={panel(palette)}>
        <Text style={{ color: palette.textMuted, marginBottom: 8 }}>Notification title</Text>
        <TextInput
          placeholder="Notification title"
          placeholderTextColor="#7f95c5"
          value={title}
          onChangeText={setTitle}
          style={input(palette)}
        />
        <Text style={{ color: palette.textMuted, marginTop: 10, marginBottom: 8 }}>
          Announcement message for all users
        </Text>
        <TextInput
          placeholder="Type message"
          placeholderTextColor="#7f95c5"
          value={message}
          onChangeText={setMessage}
          multiline
          style={[input(palette), { minHeight: 110, textAlignVertical: "top" as const }]}
        />
        <Pressable
          onPress={async () => {
            if (!message.trim()) {
              setStatus("Notification message is required.");
              return;
            }

            setSending(true);
            setStatus("");

            try {
              const response = await createAdminNotification({
                title: title.trim() || "ElectriPay Notice",
                message: message.trim(),
                audience: "all",
              });

              setFeed((prev) => [response.notification, ...prev]);
              setMessage("");
              setStatus(`Notification saved to ${response.source}`);
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Unable to send notification");
            } finally {
              setSending(false);
            }
          }}
          disabled={sending}
          style={[primaryBtn(palette), sending ? { opacity: 0.7 } : null]}
        >
          <Text style={{ color: "#1b1e2f", fontWeight: "800" }}>
            {sending ? "Sending..." : "Send Notification"}
          </Text>
        </Pressable>
        {status ? <Text style={{ color: palette.textMuted, marginTop: 10 }}>{status}</Text> : null}
      </View>

      <View style={panel(palette)}>
        <Text style={{ color: palette.text, fontWeight: "800", marginBottom: 8 }}>Recent Sent</Text>
        {loading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator color={palette.cyan} />
          </View>
        ) : feed.length === 0 ? (
          <Text style={{ color: palette.textMuted }}>No announcements sent yet.</Text>
        ) : (
          feed.map((item) => (
            <View
              key={item.id}
              style={{
                marginBottom: 10,
                borderWidth: 1,
                borderColor: palette.rowBorder,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Text style={{ color: palette.text, fontWeight: "800" }}>{item.title}</Text>
              <Text style={{ color: palette.textMuted, marginTop: 4 }}>{item.message}</Text>
              <Text style={{ color: palette.textMuted, marginTop: 6, fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          ))
        )}
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

const primaryBtn = (palette: ReturnType<typeof useThemePalette>) => ({
  borderRadius: 10,
  backgroundColor: palette.accent,
  paddingHorizontal: 14,
  paddingVertical: 10,
  marginTop: 10,
  alignSelf: "flex-start" as const,
});
