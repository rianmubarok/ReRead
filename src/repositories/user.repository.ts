import { User } from "@/types/user";
import { DEV_MODE, maybeDelay } from "@/utils/constants";
import { getUser, setUser } from "@/storage/user.storage";
import { supabase } from "@/lib/supabase";

export interface UserRepository {
  getUserProfile(uid: string): Promise<User | null>;
  updateUserProfile(uid: string, updates: Partial<User>): Promise<User>;
  createUserProfile(user: User): Promise<User>;
}

class MockUserRepository implements UserRepository {
  async getUserProfile(uid: string): Promise<User | null> {
    await maybeDelay(200);
    const user = getUser();
    if (user && user.uid === uid) return user;
    return null;
  }

  async updateUserProfile(uid: string, updates: Partial<User>): Promise<User> {
    await maybeDelay(200);
    const user = getUser();
    if (user && user.uid === uid) {
      const updated = { ...user, ...updates };
      setUser(updated);
      return updated;
    }
    throw new Error("User not found");
  }

  async createUserProfile(user: User): Promise<User> {
    await maybeDelay(200);
    setUser(user);
    return user;
  }
}

class SupabaseUserRepository implements UserRepository {
  async getUserProfile(_uid: string): Promise<User | null> {
    if (!supabase) return null;
    // TODO: implement Supabase query
    return null;
  }
  async updateUserProfile(_uid: string, _updates: Partial<User>): Promise<User> {
    if (!supabase) throw new Error("Supabase not configured");
    throw new Error("Supabase user update not implemented");
  }
  async createUserProfile(_user: User): Promise<User> {
    if (!supabase) throw new Error("Supabase not configured");
    throw new Error("Supabase user insert not implemented");
  }
}

export const getUserRepository = (): UserRepository => {
  if (!DEV_MODE && supabase) {
    return new SupabaseUserRepository();
  }
  return new MockUserRepository();
};

