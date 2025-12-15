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

const DISTRICT_COORDS: Record<string, { lat: number; lng: number }> = {
  "Panggang": { lat: -6.5900, lng: 110.6700 },
  "Tahunan": { lat: -6.6200, lng: 110.6800 },
  "Mlonggo": { lat: -6.5300, lng: 110.7000 },
  "Batealit": { lat: -6.6300, lng: 110.7200 },
  "Mayong": { lat: -6.7400, lng: 110.7500 },
  "Pecangaan": { lat: -6.7000, lng: 110.7000 },
  "Welahan": { lat: -6.7700, lng: 110.6500 },
  "Keling": { lat: -6.4600, lng: 110.8500 },
  "Kembang": { lat: -6.5000, lng: 110.8000 },
  "Karimunjawa": { lat: -5.8500, lng: 110.4300 },
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

    // Determine coordinates based on district
    const district = address?.district;
    const coordinates = (district && DISTRICT_COORDS[district])
      ? DISTRICT_COORDS[district]
      : { lat: -6.5818, lng: 110.6684 }; // Default Jepara Center

    const userData: User = {
      id: uid, // Keep id for backward compatibility
      uid: uid, // Firebase/Supabase-compatible uid
      name,
      email: email || `test@mail.com`,
      avatar,
      address,
      coordinates,
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
      const user = getUser();
      if (user && !user.coordinates) {
        // Polyfill missing coordinates for existing sessions
        const district = user.address?.district;
        const coordinates = (district && DISTRICT_COORDS[district])
          ? DISTRICT_COORDS[district]
          : { lat: -6.5818, lng: 110.6684 };

        const updatedUser = { ...user, coordinates };
        setUser(updatedUser); // Update storage
        return updatedUser;
      }
      return user;
    }

    return null;
  },
  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User | null> => {
    // Dev Mode: Update localStorage via user.storage
    if (DEV_MODE) {
      const currentUser = getUser();
      if (!currentUser) return null;

      const updatedUser = { ...currentUser, ...updates };
      setUser(updatedUser);
      return updatedUser;
    }
    return null;
  },
};
