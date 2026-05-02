import { listNotifications } from "@/lib/notificationsRepository";

export async function GET() {
  try {
    const response = await listNotifications();
    return Response.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
