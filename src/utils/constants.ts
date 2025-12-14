/**
 * Shared constants and utilities for services
 */

// Dev Mode: Set to false when Supabase is ready
export const DEV_MODE = true;

/**
 * Mock delay helper to simulate network latency
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Re-export SignInForm constants for centralized access
export { AVATARS, TOTAL_STEPS } from "@/components/onboarding/SignInForm/constants";

