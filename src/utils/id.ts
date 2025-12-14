/**
 * Utility functions for generating unique IDs
 */

/**
 * Generate a random ID string
 * Format: prefix-timestamp-randomstring
 * @param prefix Optional prefix for the ID
 * @returns Unique ID string
 */
export const generateId = (prefix: string = "id"): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate a simple random string
 * Useful for short IDs without timestamp
 * @param length Length of the random string (default: 9)
 * @returns Random string
 */
export const generateRandomString = (length: number = 9): string => {
  return Math.random().toString(36).substring(2, 2 + length);
};

