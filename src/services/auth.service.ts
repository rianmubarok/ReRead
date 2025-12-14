import { User } from "@/types/user";
import { getUser, setUser, clearUser } from "@/storage/user.storage";
import { delay, DEV_MODE } from "@/utils/constants";
import { generateId } from "@/utils/id";
import { getStorageItem, removeStorageItem } from "@/utils/storage";

/**
 * Migrate old localStorage key to new key (one-time migration)
 */
const migrateOldUserData = (): void => {
  const oldKey = "auth_user";
  const oldData = getStorageItem<any>(oldKey);

  if (oldData && !getUser()) {
    // Migrate old data to new storage
    const migratedUser: User = {
      id: oldData.uid || oldData.id,
      uid: oldData.uid || oldData.id,
      name: oldData.name || "User",
      email: oldData.email,
      avatar: oldData.avatar,
      address: oldData.address,
      onboardingCompleted: oldData.onboardingCompleted ?? true,
    };
    setUser(migratedUser);
    removeStorageItem(oldKey); // Clean up old key
  }
};

export const authService = {
  /**
   * Login user (Dev Mode: saves to localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  login: async (
    name: string,
    avatar: string,
    address: any,
    email?: string
  ): Promise<User> => {
    await delay(1000); // Simulate network latency

    const uid = generateId("dev-user");
    const userData: User = {
      id: uid, // Keep id for backward compatibility
      uid: uid, // Firebase/Supabase-compatible uid
      name,
      email: email || `test@mail.com`,
      avatar,
      address,
      onboardingCompleted: true,
    };

    // Dev Mode: Save to localStorage via user.storage
    if (DEV_MODE) {
      setUser(userData);
    }

    return userData;
  },

  /**
   * Logout user (Dev Mode: clears localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  logout: async (): Promise<void> => {
    await delay(500);

    // Dev Mode: Clear localStorage via user.storage
    if (DEV_MODE) {
      clearUser();
    }
  },

  /**
   * Check current session (Dev Mode: reads from localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  checkSession: async (): Promise<User | null> => {
    await delay(500);

    // Migrate old data if exists
    migrateOldUserData();

    // Dev Mode: Read from localStorage via user.storage
    if (DEV_MODE) {
      return getUser();
    }

    return null;
  },
};
