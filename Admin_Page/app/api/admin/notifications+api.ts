import { createNotification, listNotifications } from "@/lib/notificationsRepository";
import { requireAdmin } from "@/lib/serverAuth";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const response = await listNotifications();
    return Response.json(response, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const body = (await request.json()) as Partial<{
      title: string;
      message: string;
      audience: "all";
    }>;

    if (!body.message?.trim()) {
      return Response.json({ error: "Notification message is required" }, { status: 400 });
    }

    const response = await createNotification({
      title: body.title,
      message: body.message,
      audience: body.audience || "all",
    });

    return Response.json(response, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
