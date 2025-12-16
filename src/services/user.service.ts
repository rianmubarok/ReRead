import { getUserRepository } from "@/repositories/user.repository";
import { User } from "@/types/user";

export const userService = {
  /**
   * Get user profile from Supabase
   * TODO: Implement Supabase query when ready
   *
   * Example:
   * const { data, error } = await supabase
   *   .from('users')
   *   .select('*')
   *   .eq('uid', uid)
   *   .single();
   */
  getUserProfile: async (uid: string): Promise<User | null> => {
    const repo = getUserRepository();
    return repo.getUserProfile(uid);
  },

  /**
   * Update user profile in Supabase
   * TODO: Implement Supabase update when ready
   *
   * Example:
   * const { data, error } = await supabase
   *   .from('users')
   *   .update(updates)
   *   .eq('uid', uid)
   *   .select()
   *   .single();
   */
  updateUserProfile: async (
    uid: string,
    updates: Partial<User>
  ): Promise<User> => {
    const repo = getUserRepository();
    return repo.updateUserProfile(uid, updates);
  },

  /**
   * Create user profile in Supabase
   * TODO: Implement Supabase insert when ready
   */
  createUserProfile: async (user: User): Promise<User> => {
    const repo = getUserRepository();
    return repo.createUserProfile(user);
  },
};
