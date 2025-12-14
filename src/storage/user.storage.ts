import { User } from "@/types/user";
import { getStorageItem, setStorageItem, removeStorageItem } from "@/utils/storage";

const KEY = "reread_user";

/**
 * Get user from localStorage
 * @returns User object or null if not found
 */
export const getUser = (): User | null => {
  return getStorageItem<User>(KEY);
};

/**
 * Save user to localStorage
 * @param user User object to save
 */
export const setUser = (user: User): void => {
  setStorageItem(KEY, user);
};

/**
 * Clear user from localStorage
 */
export const clearUser = (): void => {
  removeStorageItem(KEY);
};
