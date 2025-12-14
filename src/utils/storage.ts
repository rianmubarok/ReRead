/**
 * Utility functions for localStorage operations
 * Provides consistent error handling and SSR safety
 */

/**
 * Safely get item from localStorage
 * @param key Storage key
 * @returns Parsed value or null if not found/error
 */
export const getStorageItem = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const parsed = JSON.parse(stored);
    return parsed as T;
  } catch (error) {
    console.error(`Error parsing stored ${key}:`, error);
    return null;
  }
};

/**
 * Safely set item to localStorage
 * @param key Storage key
 * @param value Value to store (will be JSON stringified)
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

/**
 * Safely remove item from localStorage
 * @param key Storage key
 */
export const removeStorageItem = (key: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
  }
};

/**
 * Safely clear all localStorage
 * Use with caution - only for dev mode or logout
 */
export const clearStorage = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.clear();
  } catch (error) {
    console.error("Failed to clear localStorage:", error);
  }
};
