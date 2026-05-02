import { AdminShell } from "@/components/AdminShell";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useThemePalette } from "@/lib/theme";
import { useReceipts } from "@/lib/useReceipts";
import { FontAwesome6 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Modal,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ReceiptsPage() {
  const palette = useThemePalette();
  const { receipts, loading, error, updateStatus, deleteReceipt } =
    useReceipts();
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () =>
      receipts.filter((receipt) =>
        `${receipt.userName} ${receipt.userEmail} ${receipt.status}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [receipts, query],
  );

  const grouped = useMemo(() => {
    return {
      pending: rows.filter((item) => item.status === "Pending Verification"),
      approved: rows.filter((item) => item.status === "Approved"),
      rejected: rows.filter((item) => item.status === "Rejected"),
    };
  }, [rows]);

  return (
    <AdminShell
      title="Receipts"
      subtitle="Review receipt submissions and verify if clients already paid"
    >
      <View style={panel(palette)}>
        <TextInput
          placeholder="Search receipts"
          placeholderTextColor="#7f95c5"
          value={query}
          onChangeText={setQuery}
          style={input(palette)}
        />

        {loading ? (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator color={palette.cyan} />
          </View>
        ) : null}

        {error ? (
          <Text style={{ color: palette.danger, marginTop: 10 }}>{error}</Text>
        ) : null}

        <SectionTitle
          title="Pending Verification"
          count={grouped.pending.length}
        />
        {grouped.pending.map((receipt) => (
          <ReceiptRow
            key={receipt.id}
            receipt={receipt}
            updateStatus={updateStatus}
            deleteReceipt={deleteReceipt}
          />
        ))}

        <SectionTitle title="Approved" count={grouped.approved.length} />
        {grouped.approved.map((receipt) => (
          <ReceiptRow
            key={receipt.id}
            receipt={receipt}
            updateStatus={updateStatus}
            deleteReceipt={deleteReceipt}
          />
        ))}

        <SectionTitle title="Rejected" count={grouped.rejected.length} />
        {grouped.rejected.map((receipt) => (
          <ReceiptRow
            key={receipt.id}
            receipt={receipt}
            updateStatus={updateStatus}
            deleteReceipt={deleteReceipt}
          />
        ))}

        {!loading && rows.length === 0 ? (
          <Text style={{ color: palette.textMuted, marginTop: 10 }}>
            No receipt submissions found.
          </Text>
        ) : null}
      </View>
    </AdminShell>
  );
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  const palette = useThemePalette();

  return (
    <Text style={{ color: palette.text, fontWeight: "800", marginTop: 12 }}>
      {title} ({count})
    </Text>
  );
}

function ReceiptRow({
  receipt,
  updateStatus,
  deleteReceipt,
}: {
  receipt: {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    submittedAt: string;
    status: "Pending Verification" | "Approved" | "Rejected";
    receiptUri: string;
  };
  updateStatus: (
    receiptId: string,
    userId: string,
    status: "Approved" | "Rejected" | "Pending Verification",
  ) => Promise<void>;
  deleteReceipt: (receiptId: string) => Promise<void>;
}) {
  const palette = useThemePalette();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [confirm, setConfirm] = useState<{
    visible: boolean;
    action?: "Approved" | "Rejected" | "Revoke" | "Delete";
  }>({ visible: false });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActionClick = (
    action: "Approved" | "Rejected" | "Revoke" | "Delete",
  ) => {
    setConfirm({ visible: true, action });
  };

  const receiptPreview = getReceiptPreview(receipt.receiptUri);

  const openReceiptExternal = async () => {
    if (!receiptPreview.openUri) {
      return;
    }

    await Linking.openURL(receiptPreview.openUri);
  };

  const handleConfirmAction = async () => {
    if (!confirm.action) return;
    setIsProcessing(true);
    try {
      if (confirm.action === "Revoke") {
        await updateStatus(receipt.id, receipt.userId, "Pending Verification");
      } else if (confirm.action === "Delete") {
        await deleteReceipt(receipt.id);
      } else if (
        confirm.action === "Approved" ||
        confirm.action === "Rejected"
      ) {
        await updateStatus(receipt.id, receipt.userId, confirm.action);
      }
      setConfirm({ visible: false });
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionMessage = () => {
    switch (confirm.action) {
      case "Revoke":
        return `Revoke "${receipt.userName}'s" receipt approval? It will return to pending status.`;
      case "Delete":
        return `Delete "${receipt.userName}'s" receipt permanently? This action cannot be undone.`;
      case "Approved":
        return `Mark "${receipt.userName}'s" receipt as approved? They will be notified.`;
      case "Rejected":
        return `Mark "${receipt.userName}'s" receipt as rejected? They will be notified.`;
      default:
        return "";
    }
  };

  const renderActionButtons = () => {
    switch (receipt.status) {
      case "Pending Verification":
        return (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => handleActionClick("Approved")}
              style={approveBtn}
              accessibilityLabel="Approve receipt"
            >
              <FontAwesome6 name="check" size={14} color="#dcfce7" />
            </Pressable>
            <Pressable
              onPress={() => handleActionClick("Rejected")}
              style={rejectBtn}
              accessibilityLabel="Reject receipt"
            >
              <FontAwesome6 name="xmark" size={14} color="#fecaca" />
            </Pressable>
            <Pressable
              onPress={() => handleActionClick("Delete")}
              style={deleteBtn}
              accessibilityLabel="Delete receipt"
            >
              <FontAwesome6 name="trash" size={14} color="#fecaca" />
            </Pressable>
          </View>
        );
      case "Approved":
        return (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => handleActionClick("Revoke")}
              style={revokeBtn}
              accessibilityLabel="Revoke receipt approval"
            >
              <FontAwesome6 name="rotate-left" size={14} color="#fbbf24" />
            </Pressable>
            <Pressable
              onPress={() => handleActionClick("Delete")}
              style={deleteBtn}
              accessibilityLabel="Delete receipt"
            >
              <FontAwesome6 name="trash" size={14} color="#fecaca" />
            </Pressable>
          </View>
        );
      case "Rejected":
        return (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => handleActionClick("Delete")}
              style={deleteBtn}
              accessibilityLabel="Delete receipt"
            >
              <FontAwesome6 name="trash" size={14} color="#fecaca" />
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <View style={row(palette)}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: palette.text, fontWeight: "800" }}>
            {receipt.userName}
          </Text>
          <Text style={{ color: palette.textMuted }}>{receipt.userEmail}</Text>
          <Text style={{ color: palette.textMuted }}>
            Submitted: {receipt.submittedAt}
          </Text>
          <Text style={{ color: palette.textMuted }}>
            Amount: PHP {receipt.amount.toLocaleString()}
          </Text>
          {receipt.receiptUri ? (
            <View style={{ gap: 8, marginTop: 8 }}>
              <Text
                numberOfLines={1}
                style={{ color: palette.cyan, maxWidth: 460 }}
              >
                Receipt: {receipt.receiptUri}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Pressable
                  onPress={() => {
                    setPreviewFailed(false);
                    setPreviewVisible(true);
                  }}
                  style={viewReceiptBtn(palette)}
                  accessibilityLabel="View attached receipt"
                >
                  <FontAwesome6 name="eye" size={13} color={palette.cyan} />
                  <Text style={{ color: palette.cyan, fontWeight: "800" }}>
                    View Receipt
                  </Text>
                </Pressable>
                <Pressable
                  onPress={openReceiptExternal}
                  style={viewReceiptBtn(palette)}
                  accessibilityLabel="Open receipt full size"
                  disabled={!receiptPreview.openUri}
                >
                  <FontAwesome6
                    name="up-right-from-square"
                    size={12}
                    color={palette.cyan}
                  />
                  <Text style={{ color: palette.cyan, fontWeight: "800" }}>
                    Full View
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <Text style={{ color: palette.warning }}>
              No receipt URL attached
            </Text>
          )}
        </View>
        <View
          style={{
            alignItems: "flex-end",
            gap: 8,
            width: "100%",
            maxWidth: 220,
          }}
        >
          <View
            style={{
              borderRadius: 20,
              borderWidth: 1,
              borderColor:
                receipt.status === "Approved"
                  ? palette.success
                  : receipt.status === "Rejected"
                    ? palette.danger
                    : palette.warning,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: palette.text }}>{receipt.status}</Text>
          </View>
          {renderActionButtons()}
        </View>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={confirm.visible}
        title={`${confirm.action} Receipt`}
        message={getActionMessage()}
        confirmText={confirm.action}
        cancelText="Cancel"
        isDangerous={
          confirm.action === "Rejected" || confirm.action === "Delete"
        }
        isLoading={isProcessing}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm({ visible: false })}
      />
      <Modal
        visible={previewVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View style={previewBackdrop}>
          <View style={previewPanel(palette)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: palette.text,
                    fontSize: 18,
                    fontWeight: "900",
                  }}
                >
                  {`${receipt.userName}'s Receipt`}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ color: palette.textMuted, marginTop: 3 }}
                >
                  {receipt.receiptUri}
                </Text>
              </View>
              <Pressable
                onPress={() => setPreviewVisible(false)}
                style={closePreviewBtn(palette)}
                accessibilityLabel="Close receipt preview"
              >
                <FontAwesome6 name="xmark" size={18} color={palette.text} />
              </Pressable>
            </View>

            <View style={receiptPreviewFrame(palette)}>
              {receipt.receiptUri && receiptPreview.imageUri && !previewFailed ? (
                <Image
                  source={{ uri: receiptPreview.imageUri }}
                  resizeMode="contain"
                  style={{ width: "100%", height: "100%" }}
                  onError={() => setPreviewFailed(true)}
                />
              ) : (
                <View style={{ padding: 20, alignItems: "center", gap: 10 }}>
                  <FontAwesome6
                    name="image"
                    size={30}
                    color={palette.textMuted}
                  />
                  <Text
                    style={{
                      color: palette.text,
                      fontWeight: "800",
                      textAlign: "center",
                    }}
                  >
                    Receipt preview is not available
                  </Text>
                  <Text
                    style={{
                      color: palette.textMuted,
                      textAlign: "center",
                      lineHeight: 20,
                    }}
                  >
                    {receiptPreview.message}
                  </Text>
                </View>
              )}
              {!receipt.receiptUri ? (
                <Text style={{ color: palette.textMuted }}>No receipt attached.</Text>
              ) : null}
            </View>

            <Pressable
              onPress={openReceiptExternal}
              disabled={!receiptPreview.openUri}
              style={[
                openFullBtn(palette),
                !receiptPreview.openUri ? { opacity: 0.5 } : null,
              ]}
            >
              <FontAwesome6
                name="up-right-from-square"
                size={13}
                color="#1b1e2f"
              />
              <Text style={{ color: "#1b1e2f", fontWeight: "900" }}>
                Open Full Receipt
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function getReceiptPreview(rawUri: string) {
  const trimmed = (rawUri || "").trim();

  if (!trimmed) {
    return {
      imageUri: "",
      openUri: "",
      message: "No receipt attachment was saved for this payment.",
    };
  }

  if (/^(file|content|blob):/i.test(trimmed)) {
    return {
      imageUri: "",
      openUri: "",
      message:
        "This receipt was saved as a device-local path. Upload it to server storage or save it as a public URL/base64 image so the admin panel can load it.",
    };
  }

  if (/^data:image\//i.test(trimmed)) {
    return {
      imageUri: trimmed,
      openUri: trimmed,
      message: "",
    };
  }

  if (/^data:application\/pdf/i.test(trimmed)) {
    return {
      imageUri: "",
      openUri: trimmed,
      message: "This receipt is a PDF. Use Full View to open it.",
    };
  }

  if (looksLikeBase64Image(trimmed)) {
    const imageUri = `data:image/jpeg;base64,${trimmed}`;
    return {
      imageUri,
      openUri: imageUri,
      message: "",
    };
  }

  const normalized = normalizeReceiptUrl(trimmed);
  return {
    imageUri: normalized,
    openUri: normalized,
    message:
      "The attachment is not a direct image URL, or the host blocks embedded previews. Try Full View, or store receiptUri as a direct image link.",
  };
}

function normalizeReceiptUrl(value: string) {
  if (value.startsWith("//")) {
    return `https:${value}`;
  }

  const googleDriveMatch = value.match(/drive\.google\.com\/file\/d\/([^/]+)/i);
  if (googleDriveMatch?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${googleDriveMatch[1]}`;
  }

  if (/dropbox\.com/i.test(value)) {
    return value.replace(/[?&]dl=0/i, "?raw=1").replace(/[?&]dl=1/i, "?raw=1");
  }

  if (/^https?:\/\//i.test(value) || value.startsWith("/")) {
    return encodeURI(value);
  }

  return encodeURI(`/${value}`);
}

function looksLikeBase64Image(value: string) {
  return (
    value.length > 120 &&
    /^[A-Za-z0-9+/=\r\n]+$/.test(value)
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
  alignItems: "flex-start" as const,
  flexWrap: "wrap" as const,
  gap: 12,
});

const viewReceiptBtn = (palette: ReturnType<typeof useThemePalette>) => ({
  borderWidth: 1,
  borderColor: palette.inputBorder,
  backgroundColor: palette.panelSoft,
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 7,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 7,
});

const previewBackdrop = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.78)",
  justifyContent: "center" as const,
  alignItems: "center" as const,
  padding: 16,
};

const previewPanel = (palette: ReturnType<typeof useThemePalette>) => ({
  width: "100%" as const,
  maxWidth: 920,
  maxHeight: "92%" as const,
  borderWidth: 1,
  borderColor: palette.cardBorder,
  borderRadius: 14,
  backgroundColor: palette.card,
  padding: 14,
  gap: 12,
});

const receiptPreviewFrame = (palette: ReturnType<typeof useThemePalette>) => ({
  height: 560,
  maxHeight: "78%" as const,
  borderWidth: 1,
  borderColor: palette.rowBorder,
  borderRadius: 10,
  backgroundColor: palette.panelSoft,
  overflow: "hidden" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
});

const closePreviewBtn = (palette: ReturnType<typeof useThemePalette>) => ({
  width: 38,
  height: 38,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: palette.inputBorder,
  backgroundColor: palette.panelSoft,
  alignItems: "center" as const,
  justifyContent: "center" as const,
});

const openFullBtn = (palette: ReturnType<typeof useThemePalette>) => ({
  borderRadius: 10,
  backgroundColor: palette.accent,
  paddingHorizontal: 14,
  paddingVertical: 10,
  alignSelf: "flex-start" as const,
  flexDirection: "row" as const,
  alignItems: "center" as const,
  gap: 8,
});

const approveBtn = {
  borderWidth: 1,
  borderColor: "rgba(34,197,94,0.6)",
  backgroundColor: "rgba(34,197,94,0.16)",
  borderRadius: 8,
  width: 34,
  height: 34,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const rejectBtn = {
  borderWidth: 1,
  borderColor: "rgba(239,68,68,0.5)",
  backgroundColor: "rgba(239,68,68,0.16)",
  borderRadius: 8,
  width: 34,
  height: 34,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const revokeBtn = {
  borderWidth: 1,
  borderColor: "rgba(245,158,11,0.6)",
  backgroundColor: "rgba(245,158,11,0.16)",
  borderRadius: 8,
  paddingHorizontal: 10,
  paddingVertical: 7,
};

const deleteBtn = {
  borderWidth: 1,
  borderColor: "rgba(239,68,68,0.5)",
  backgroundColor: "rgba(239,68,68,0.16)",
  borderRadius: 8,
  width: 34,
  height: 34,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
