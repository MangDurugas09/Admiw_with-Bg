import { ObjectId } from "mongodb";
import { addMemoryNotification, getMemoryNotifications } from "./dataStore";
import { getDatabaseName, getMongoClient } from "./mongodb";

const NOTIFICATIONS_COLLECTION = "notifications";

type NotificationDoc = {
  _id: ObjectId | string;
  title?: string;
  message?: string;
  audience?: "all";
  createdAt?: string;
  updatedAt?: string;
};

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  audience: "all";
  createdAt: string;
};

function mapNotification(doc: NotificationDoc): NotificationRecord {
  return {
    id: doc._id.toString(),
    title: (doc.title || "ElectriPay Notice").toString(),
    message: (doc.message || "").toString(),
    audience: "all",
    createdAt: doc.createdAt || new Date().toISOString(),
  };
}

export async function listNotifications(limit = 20) {
  const mongo = await getMongoClient();

  if (!mongo) {
    return {
      notifications: getMemoryNotifications().slice(0, limit),
      source: "memory" as const,
    };
  }

  const db = mongo.db(getDatabaseName());
  const docs = await db
    .collection<NotificationDoc>(NOTIFICATIONS_COLLECTION)
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit)
    .toArray();

  return {
    notifications: docs.map(mapNotification),
    source: "mongodb" as const,
  };
}

export async function createNotification(input: {
  title?: string;
  message: string;
  audience?: "all";
}) {
  const title = (input.title || "ElectriPay Notice").trim();
  const message = input.message.trim();
  const audience = input.audience || "all";

  const mongo = await getMongoClient();

  if (!mongo) {
    return {
      notification: addMemoryNotification({ title, message, audience }),
      source: "memory" as const,
    };
  }

  const db = mongo.db(getDatabaseName());
  const now = new Date().toISOString();
  const doc: Omit<NotificationDoc, "_id"> = {
    title,
    message,
    audience,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection<NotificationDoc>(NOTIFICATIONS_COLLECTION).insertOne(doc);

  return {
    notification: mapNotification({
      _id: result.insertedId,
      ...doc,
    }),
    source: "mongodb" as const,
  };
}
