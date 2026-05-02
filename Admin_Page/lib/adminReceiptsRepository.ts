import { ObjectId } from "mongodb";
import { getDatabaseName, getMongoClient } from "./mongodb";

const USERS_COLLECTION = "users";

type PaymentHistoryItem = {
  id?: string;
  date?: string;
  amount?: number;
  status?: string;
  method?: string;
  receiptUri?: string;
  receiptUrl?: string;
  receiptURL?: string;
  receiptImage?: string;
  imageUri?: string;
  imageUrl?: string;
  proofOfPayment?: string;
  attachmentUrl?: string;
  url?: string;
};

type UserDoc = {
  _id: ObjectId | string;
  name?: string;
  username?: string;
  email?: string;
  paymentStatus?: string;
  amountDue?: number;
  payments?: {
    latestReceipt?: string | null;
    currentBill?: {
      amount?: number;
      status?: string;
    };
    history?: PaymentHistoryItem[];
  };
};

export type AdminReceiptRecord = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  submittedAt: string;
  status: "Pending Verification" | "Approved" | "Rejected";
  receiptUri: string;
};

function idQuery(id: string) {
  if (ObjectId.isValid(id) && String(new ObjectId(id)) === id) {
    return { _id: new ObjectId(id) };
  }

  return { _id: id };
}

function mapReceiptStatus(value?: string): AdminReceiptRecord["status"] {
  const normalized = (value || "").toLowerCase();
  if (["approved", "completed", "paid", "verified"].includes(normalized)) {
    return "Approved";
  }

  if (["rejected", "declined", "failed"].includes(normalized)) {
    return "Rejected";
  }

  return "Pending Verification";
}

function shouldIncludeHistoryAsReceipt(item: PaymentHistoryItem) {
  const status = (item.status || "").toLowerCase();
  const method = (item.method || "").toLowerCase();

  if (getReceiptUri(item)) {
    return true;
  }

  if (method.includes("receipt")) {
    return true;
  }

  if (
    [
      "pending verification",
      "pending",
      "completed",
      "approved",
      "paid",
      "verified",
      "rejected",
      "declined",
      "failed",
    ].includes(status)
  ) {
    return true;
  }

  return false;
}

function getReceiptUri(item: PaymentHistoryItem) {
  return (
    item.receiptUri ||
    item.receiptUrl ||
    item.receiptURL ||
    item.receiptImage ||
    item.imageUri ||
    item.imageUrl ||
    item.proofOfPayment ||
    item.attachmentUrl ||
    item.url ||
    ""
  ).toString();
}

export async function listAdminReceipts() {
  const mongo = await getMongoClient();
  if (!mongo) {
    return [] as AdminReceiptRecord[];
  }

  const users = await mongo
    .db(getDatabaseName())
    .collection<UserDoc>(USERS_COLLECTION)
    .find({})
    .toArray();

  const receipts: AdminReceiptRecord[] = [];

  for (const user of users) {
    const userId = user._id.toString();
    const userName = user.name || user.username || "Unknown User";
    const userEmail = user.email || "";
    const history = user.payments?.history || [];

    for (const item of history) {
      if (!shouldIncludeHistoryAsReceipt(item)) {
        continue;
      }

      receipts.push({
        id: item.id || `${userId}-${item.date || Date.now()}`,
        userId,
        userName,
        userEmail,
        amount: Number(item.amount || user.payments?.currentBill?.amount || 0),
        submittedAt: item.date || new Date().toISOString(),
        status: mapReceiptStatus(item.status),
        receiptUri: getReceiptUri(item) || user.payments?.latestReceipt || "",
      });
    }

    if (
      user.payments?.latestReceipt &&
      !history.some(
        (entry) => getReceiptUri(entry) === user.payments?.latestReceipt,
      )
    ) {
      receipts.push({
        id: `${userId}-latest-receipt`,
        userId,
        userName,
        userEmail,
        amount: Number(user.payments?.currentBill?.amount || 0),
        submittedAt: new Date().toISOString(),
        status: "Pending Verification",
        receiptUri: user.payments.latestReceipt,
      });
    }

    if (
      (user.payments?.currentBill?.status || "")
        .toLowerCase()
        .includes("pending") &&
      !history.length &&
      user.payments?.latestReceipt
    ) {
      receipts.push({
        id: `${userId}-current-bill-pending`,
        userId,
        userName,
        userEmail,
        amount: Number(user.payments?.currentBill?.amount || 0),
        submittedAt: new Date().toISOString(),
        status: "Pending Verification",
        receiptUri: user.payments.latestReceipt,
      });
    }
  }

  return receipts.sort(
    (a, b) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export async function addUserReceipt(input: {
  userId: string;
  amount?: number;
  receiptUri: string;
  mimeType?: string;
}) {
  const mongo = await getMongoClient();
  if (!mongo) {
    throw new Error("MongoDB is unavailable");
  }

  const db = mongo.db(getDatabaseName());
  const users = db.collection<UserDoc>(USERS_COLLECTION);
  const now = new Date().toISOString();
  const receiptId = `receipt-${Date.now()}`;

  const result = await users.findOneAndUpdate(
    idQuery(input.userId),
    {
      $set: {
        paymentStatus: "Unpaid",
        "payments.currentBill.status": "Pending Verification",
        "payments.latestReceipt": input.receiptUri,
        updatedAt: now,
      },
      $push: {
        "payments.history": {
          id: receiptId,
          date: now,
          amount: Number(input.amount || 0),
          status: "Pending Verification",
          method: "Receipt Upload",
          receiptUri: input.receiptUri,
          mimeType: input.mimeType || "image/jpeg",
        },
      },
    } as never,
    { returnDocument: "after" },
  );

  if (!result) {
    return null;
  }

  return {
    id: receiptId,
    userId: input.userId,
    receiptUri: input.receiptUri,
    submittedAt: now,
  };
}

export function normalizeUploadedReceipt(input: {
  receiptBase64?: string;
  receiptUri?: string;
  mimeType?: string;
}) {
  const rawReceipt = (input.receiptBase64 || input.receiptUri || "").trim();
  const mimeType = input.mimeType || "image/jpeg";

  if (!rawReceipt) {
    return "";
  }

  if (/^data:image\//i.test(rawReceipt) || /^https?:\/\//i.test(rawReceipt)) {
    return rawReceipt;
  }

  if (/^(file|content|blob):/i.test(rawReceipt)) {
    throw new Error(
      "Receipt must be uploaded as base64 or a public image URL, not a device-local path.",
    );
  }

  return `data:${mimeType};base64,${rawReceipt}`;
}

export async function updateReceiptStatus(input: {
  userId: string;
  receiptId: string;
  status: "Approved" | "Rejected";
}) {
  const mongo = await getMongoClient();
  if (!mongo) {
    throw new Error("MongoDB is unavailable");
  }

  const db = mongo.db(getDatabaseName());
  const users = db.collection<UserDoc>(USERS_COLLECTION);

  const user = await users.findOne(idQuery(input.userId));
  if (!user) {
    return null;
  }

  const history = user.payments?.history || [];
  const nextHistory = history.map((item) => {
    const entryId = item.id || `${user._id.toString()}-${item.date || ""}`;
    if (entryId !== input.receiptId) {
      return item;
    }

    return {
      ...item,
      status: input.status === "Approved" ? "Completed" : "Rejected",
    };
  });

  const nextCurrentBillStatus = input.status === "Approved" ? "Paid" : "Unpaid";

  await users.updateOne(idQuery(input.userId), {
    $set: {
      paymentStatus: nextCurrentBillStatus,
      "payments.currentBill.status": nextCurrentBillStatus,
      "payments.history": nextHistory,
      updatedAt: new Date().toISOString(),
    },
  });

  return {
    userId: input.userId,
    receiptId: input.receiptId,
    status: input.status,
  };
}

export async function deleteReceipt(receiptId: string) {
  const mongo = await getMongoClient();
  if (!mongo) {
    throw new Error("MongoDB is unavailable");
  }

  const db = mongo.db(getDatabaseName());
  const users = db.collection<UserDoc>(USERS_COLLECTION);

  // Find the user that has this receipt in their history
  const user = await users.findOne({
    "payments.history": {
      $elemMatch: {
        $or: [
          { id: receiptId },
          { receiptUri: receiptId },
          { receiptUrl: receiptId },
          { receiptURL: receiptId },
          { receiptImage: receiptId },
          { imageUri: receiptId },
          { imageUrl: receiptId },
          { proofOfPayment: receiptId },
          { attachmentUrl: receiptId },
          { url: receiptId },
        ],
      },
    },
  });

  if (!user) {
    return null;
  }

  // Remove the receipt from the history array
  const history = user.payments?.history || [];
  const nextHistory = history.filter((item) => {
    const entryId = item.id || `${user._id.toString()}-${item.date || ""}`;
    return entryId !== receiptId && getReceiptUri(item) !== receiptId;
  });

  await users.updateOne(idQuery(user._id.toString()), {
    $set: {
      "payments.history": nextHistory,
      updatedAt: new Date().toISOString(),
    },
  });

  return true;
}
