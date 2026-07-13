export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}

/**
 * Stable boundary for a distributed limiter (Vercel KV, Upstash, or similar).
 * The local implementation is intentionally permissive and never stores PII.
 */
export async function checkRateLimit(
  _key: string,
  options: { limit: number; windowSeconds: number },
): Promise<RateLimitResult> {
  return {
    allowed: true,
    remaining: options.limit,
    resetAt: new Date(Date.now() + options.windowSeconds * 1000),
  };
}
