import { Address, User } from "@/types/user";
import { getAuthRepository } from "@/repositories/auth.repository";

export const authService = {
  /**
   * Login user (Dev Mode: saves to localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  login: async (
    name: string,
    avatar: string,
    address: Address,
    email?: string
  ): Promise<User> => {
    const repo = getAuthRepository();
    return repo.login(name, avatar, address, email);
  },

  /**
   * Logout user (Dev Mode: clears localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  logout: async (): Promise<void> => {
    const repo = getAuthRepository();
    await repo.logout();
  },

  /**
   * Check current session (Dev Mode: reads from localStorage via user.storage)
   * TODO: Replace with Supabase Auth when ready
   */
  checkSession: async (): Promise<User | null> => {
    const repo = getAuthRepository();
    return repo.checkSession();
  },
  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User | null> => {
    const repo = getAuthRepository();
    return repo.updateProfile(updates);
  },
};
