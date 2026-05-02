import {
  addUserReceipt,
  normalizeUploadedReceipt,
} from "@/lib/adminReceiptsRepository";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<{
      userId: string;
      amount: number;
      receiptBase64: string;
      receiptUri: string;
      mimeType: string;
    }>;

    if (!body.userId) {
      return Response.json({ error: "userId is required" }, { status: 400 });
    }

    const receiptUri = normalizeUploadedReceipt({
      receiptBase64: body.receiptBase64,
      receiptUri: body.receiptUri,
      mimeType: body.mimeType,
    });

    if (!receiptUri) {
      return Response.json(
        { error: "receiptBase64 or receiptUri is required" },
        { status: 400 },
      );
    }

    const receipt = await addUserReceipt({
      userId: body.userId,
      amount: body.amount,
      receiptUri,
      mimeType: body.mimeType,
    });

    if (!receipt) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({ receipt }, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to upload receipt";
    return Response.json({ error: message }, { status: 500 });
  }
}
