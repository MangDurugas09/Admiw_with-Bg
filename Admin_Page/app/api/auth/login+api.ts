import { authenticateAdmin, hasAdminRole } from "@/lib/adminRepository";
import { checkRateLimit, resetRateLimit } from "@/lib/rateLimiter";
import { createAdminToken } from "@/lib/serverAuth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      identifier?: string;
      password?: string;
    };

    const identifier = body.identifier?.trim() || "";
    const password = body.password || "";

    if (!identifier || !password) {
      return Response.json(
        { error: "Identifier and password are required" },
        { status: 400 },
      );
    }

    // Check rate limit
    const rateLimitCheck = checkRateLimit(identifier);
    if (!rateLimitCheck.allowed) {
      const secondsUntilReset = Math.ceil(
        (rateLimitCheck.resetTime! - Date.now()) / 1000,
      );
      return Response.json(
        {
          error: `Too many login attempts. Please try again in ${secondsUntilReset} seconds.`,
          retryAfter: secondsUntilReset,
        },
        { status: 429 },
      );
    }

    const session = await authenticateAdmin(identifier, password);

    if (!session) {
      return Response.json(
        {
          error: "Invalid credentials",
          attemptsLeft: rateLimitCheck.attemptsLeft,
        },
        { status: 401 },
      );
    }

    if (!hasAdminRole(session.role)) {
      return Response.json(
        { error: "Access denied: role is not admin" },
        { status: 403 },
      );
    }

    // Successful login - reset rate limit for this identifier
    resetRateLimit(identifier);

    const token = createAdminToken({
      id: session.id,
      email: session.email,
      role: session.role,
    });

    return Response.json({ session: { ...session, token } }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected auth error";
    return Response.json({ error: message }, { status: 500 });
  }
}
