import { Address, Coordinates, User } from "@/types/user";
import { getUser, setUser, clearUser } from "@/storage/user.storage";
import { generateId } from "@/utils/id";
import { getStorageItem, removeStorageItem } from "@/utils/storage";
import { DEV_MODE, maybeDelay } from "@/utils/constants";
import { supabase } from "@/lib/supabase";

const DISTRICT_COORDS: Record<string, Coordinates> = {
  Panggang: { lat: -6.59, lng: 110.67 },
  Tahunan: { lat: -6.62, lng: 110.68 },
  Mlonggo: { lat: -6.53, lng: 110.7 },
  Batealit: { lat: -6.63, lng: 110.72 },
  Mayong: { lat: -6.74, lng: 110.75 },
  Pecangaan: { lat: -6.7, lng: 110.7 },
  Welahan: { lat: -6.77, lng: 110.65 },
  Keling: { lat: -6.46, lng: 110.85 },
  Kembang: { lat: -6.5, lng: 110.8 },
  Karimunjawa: { lat: -5.85, lng: 110.43 },
};

const migrateOldUserData = (): void => {
  const oldKey = "auth_user";
  const oldData = getStorageItem<any>(oldKey);
  if (oldData && !getUser()) {
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
    removeStorageItem(oldKey);
  }
};

export interface AuthRepository {
  login(
    name: string,
    avatar: string,
    address: Address,
    email?: string,
    uid?: string
  ): Promise<User>;
  logout(): Promise<void>;
  checkSession(): Promise<User | null>;
  updateProfile(updates: Partial<User>): Promise<User | null>;
}

class MockAuthRepository implements AuthRepository {
  async login(
    name: string,
    avatar: string,
    address: Address,
    email?: string,
    existingUid?: string
  ): Promise<User> {
    await maybeDelay(300);
    const uid = existingUid || generateId("dev-user");

    // Try to get real GPS coordinates from localStorage first
    let coordinates: Coordinates;
    try {
      const savedCoords = localStorage.getItem("user_coordinates");
      if (savedCoords) {
        coordinates = JSON.parse(savedCoords);
        console.log("Using real GPS coordinates:", coordinates);
      } else {
        // Fallback to district-based coordinates
        const district = address?.district;
        coordinates =
          district && DISTRICT_COORDS[district]
            ? DISTRICT_COORDS[district]
            : { lat: -6.5818, lng: 110.6684 };
        console.log("Using district-based coordinates:", coordinates);
      }
    } catch (error) {
      console.error("Error reading coordinates from localStorage:", error);
      // Fallback to district-based coordinates
      const district = address?.district;
      coordinates =
        district && DISTRICT_COORDS[district]
          ? DISTRICT_COORDS[district]
          : { lat: -6.5818, lng: 110.6684 };
    }

    const userData: User = {
      id: uid,
      uid,
      name,
      email: email || `test@mail.com`,
      avatar,
      address,
      coordinates,
      onboardingCompleted: true,
    };
    if (DEV_MODE) {
      setUser(userData);
    }
    return userData;
  }

  async logout(): Promise<void> {
    await maybeDelay(200);
    if (DEV_MODE) {
      clearUser();
    }
  }

  async checkSession(): Promise<User | null> {
    await maybeDelay(200);
    migrateOldUserData();
    const user = getUser();
    if (user && !user.coordinates) {
      const district = user.address?.district;
      const coordinates =
        district && DISTRICT_COORDS[district]
          ? DISTRICT_COORDS[district]
          : { lat: -6.5818, lng: 110.6684 };
      const updatedUser = { ...user, coordinates };
      setUser(updatedUser);
      return updatedUser;
    }
    return user;
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const currentUser = getUser();
    if (!currentUser) return null;
    const updated = { ...currentUser, ...updates };
    setUser(updated);
    return updated;
  }
}

class SupabaseAuthRepository implements AuthRepository {
  async login(
    name: string,
    avatar: string,
    address: Address,
    email?: string,
    uid?: string
  ): Promise<User> {
    if (!supabase) throw new Error("Supabase not configured");

    const userId = uid || generateId("user");

    // Try to get real GPS coordinates from localStorage first
    let coordinates: Coordinates;
    try {
      const savedCoords = localStorage.getItem("user_coordinates");
      if (savedCoords) {
        coordinates = JSON.parse(savedCoords);
        console.log("Using real GPS coordinates for Supabase:", coordinates);
      } else {
        // Fallback to district-based coordinates
        const district = address?.district;
        coordinates =
          district && DISTRICT_COORDS[district]
            ? DISTRICT_COORDS[district]
            : { lat: -6.5818, lng: 110.6684 };
        console.log("Using district-based coordinates for Supabase:", coordinates);
      }
    } catch (error) {
      console.error("Error reading coordinates from localStorage:", error);
      // Fallback to district-based coordinates
      const district = address?.district;
      coordinates =
        district && DISTRICT_COORDS[district]
          ? DISTRICT_COORDS[district]
          : { lat: -6.5818, lng: 110.6684 };
    }

    const updates = {
      uid: userId, // store in uid col to match firebase
      name,
      email,
      avatar,
      address,       // storing specific fields as json is fine or separate cols
      coordinates,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    // Upsert into users table
    const { data, error } = await supabase
      .from("users")
      .upsert(updates, { onConflict: "uid" })
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert user error:", JSON.stringify(error, null, 2));
      // Fallback to local
      if (DEV_MODE) console.warn("Fallback to local due to Supabase error");
    }

    // Return the user object in our app's format
    const userData: User = {
      id: data?.id || userId, // db id
      uid: userId,
      name,
      email,
      avatar,
      address,
      coordinates,
      onboardingCompleted: true,
    };

    // Cache locally for performance
    setUser(userData);

    return userData;
  }

  async logout(): Promise<void> {
    if (!supabase) return;
    await supabase.auth.signOut();
    clearUser();
  }

  async checkSession(): Promise<User | null> {
    if (!supabase) return null;

    // 1. Get the locally cached user to find the UID (from previous Firebase login)
    const localUser = getUser();

    // 2. If we have a UID, verify and fetch the LATEST data from Supabase
    // This allows syncing data if it changed elsewhere (e.g. verified status)
    if (localUser?.uid) {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("uid", localUser.uid)
          .single();

        if (data && !error) {
          // Remap DB fields back to App User Type
          // The DB uses snake_case (onboarding_completed), app uses camelCase
          const freshUser: User = {
            id: data.id,
            uid: data.uid,
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            address: data.address, // jsonb
            coordinates: data.coordinates, // jsonb
            onboardingCompleted: data.onboarding_completed, // map snake_case to camelCase
            bio: data.bio,
            joinDate: data.created_at, // Map created_at to joinDate
          };

          // Update local cache with fresh data
          setUser(freshUser);
          return freshUser;
        }
      } catch (err) {
        console.warn("Failed to sync session with Supabase:", err);
      }
    }

    // Fallback: If Supabase sync fails or no internet, return local cache
    return localUser;
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!supabase) return null;
    const localUser = getUser();
    if (!localUser?.uid) return null;

    const dbUpdates: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Map specific fields casing if needed (e.g. onboardingCompleted -> onboarding_completed)
    if (updates.onboardingCompleted !== undefined) {
      dbUpdates.onboarding_completed = updates.onboardingCompleted;
      delete dbUpdates.onboardingCompleted;
    }

    const { data, error } = await supabase
      .from("users")
      .update(dbUpdates)
      .eq('uid', localUser.uid)
      .select()
      .single();

    if (error) {
      console.error("Supabase update profile error:", error);
      return null;
    }

    const updatedUser = { ...localUser, ...updates };
    setUser(updatedUser);
    return updatedUser;
  }
}

export const getAuthRepository = (): AuthRepository => {
  // Prefer Supabase if configured, even in DEV_MODE, because the User specifically synced it.
  // Or stick to strict DEV_MODE flag. 
  // Given user request "datanya masih belum diunggah", we force Supabase if available.
  if (supabase) {
    return new SupabaseAuthRepository();
  }
  return new MockAuthRepository();
};
