/**
 * Shared constants and utilities for services
 */

// Dev Mode: controlled via env. Default true if not specified.
export const DEV_MODE =
  typeof process !== "undefined" &&
  process.env.NEXT_PUBLIC_DEV_MODE !== "false";

/**
 * Mock delay helper to simulate network latency
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Delay only in dev mode. In production it resolves immediately.
 */
export const maybeDelay = (ms: number): Promise<void> => {
  if (DEV_MODE) {
    return delay(ms);
  }
  return Promise.resolve();
};

// Re-export SignInForm constants for centralized access
export { AVATARS, TOTAL_STEPS } from "@/components/onboarding/SignInForm/constants";

