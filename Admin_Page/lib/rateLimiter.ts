/**
 * In-memory rate limiter for login attempts
 * Tracks failed attempts per identifier with 30-second window
 */

interface RateLimitRecord {
  attempts: number;
  firstAttemptTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW = 30000; // 30 seconds in milliseconds
const MAX_ATTEMPTS = 5; // Allow 5 failed attempts per window

export function checkRateLimit(identifier: string): {
  allowed: boolean;
  attemptsLeft: number;
  resetTime?: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record) {
    // First attempt
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttemptTime: now,
    });
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  const timeSinceFirstAttempt = now - record.firstAttemptTime;

  if (timeSinceFirstAttempt > RATE_LIMIT_WINDOW) {
    // Window expired, reset counter
    rateLimitStore.set(identifier, {
      attempts: 1,
      firstAttemptTime: now,
    });
    return { allowed: true, attemptsLeft: MAX_ATTEMPTS - 1 };
  }

  // Still within the window
  if (record.attempts >= MAX_ATTEMPTS) {
    const resetTime = record.firstAttemptTime + RATE_LIMIT_WINDOW;
    return {
      allowed: false,
      attemptsLeft: 0,
      resetTime,
    };
  }

  record.attempts++;
  return {
    allowed: true,
    attemptsLeft: MAX_ATTEMPTS - record.attempts,
  };
}

export function recordFailedAttempt(identifier: string): void {
  // The attempt is already recorded in checkRateLimit
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}
