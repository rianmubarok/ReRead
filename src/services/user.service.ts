import { User } from "@/types/user";
import { getUser, setUser } from "@/storage/user.storage";
import { delay, DEV_MODE } from "@/utils/constants";
// import { supabase } from "@/lib/supabase"; // Uncomment when Supabase is ready

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
    await delay(500);

    // Dev Mode: Read from user.storage
    if (DEV_MODE) {
      const user = getUser();
      if (user && user.uid === uid) {
        return user;
      }
    }

    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from('users')
    //   .select('*')
    //   .eq('uid', uid)
    //   .single();
    // return data;

    return null;
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
    await delay(500);

    // Dev Mode: Update via user.storage
    if (DEV_MODE) {
      const user = getUser();
      if (user && user.uid === uid) {
        const updated = { ...user, ...updates };
        setUser(updated);
        return updated;
      }
      throw new Error("User not found");
    }

    // TODO: Replace with Supabase update
    // const { data, error } = await supabase
    //   .from('users')
    //   .update(updates)
    //   .eq('uid', uid)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    throw new Error("User not found");
  },

  /**
   * Create user profile in Supabase
   * TODO: Implement Supabase insert when ready
   */
  createUserProfile: async (user: User): Promise<User> => {
    await delay(500);

    // Dev Mode: Save via user.storage
    if (DEV_MODE) {
      setUser(user);
    }

    // TODO: Replace with Supabase insert
    // const { data, error } = await supabase
    //   .from('users')
    //   .insert(user)
    //   .select()
    //   .single();
    // if (error) throw error;
    // return data;

    return user;
  },
};
