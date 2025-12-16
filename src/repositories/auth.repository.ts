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
    email?: string
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
    email?: string
  ): Promise<User> {
    await maybeDelay(300);
    const uid = generateId("dev-user");
    const district = address?.district;
    const coordinates =
      district && DISTRICT_COORDS[district]
        ? DISTRICT_COORDS[district]
        : { lat: -6.5818, lng: 110.6684 };

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
    _name: string,
    _avatar: string,
    _address: Address,
    _email?: string
  ): Promise<User> {
    if (!supabase) throw new Error("Supabase not configured");
    throw new Error("Supabase auth not implemented");
  }
  async logout(): Promise<void> {
    if (!supabase) return;
    // TODO: supabase.auth.signOut();
  }
  async checkSession(): Promise<User | null> {
    if (!supabase) return null;
    // TODO: use supabase.auth.getUser()
    return null;
  }
  async updateProfile(_updates: Partial<User>): Promise<User | null> {
    if (!supabase) return null;
    throw new Error("Supabase profile update not implemented");
  }
}

export const getAuthRepository = (): AuthRepository => {
  if (!DEV_MODE && supabase) {
    return new SupabaseAuthRepository();
  }
  return new MockAuthRepository();
};
