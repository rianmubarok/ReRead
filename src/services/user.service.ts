import { User } from "@/types/user";
// import { supabase } from "@/lib/supabase"; // Uncomment when Supabase is ready

// Mock delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dev Mode: Simulate user operations with localStorage
const DEV_MODE = true; // Set to false when Supabase is ready

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

    // Dev Mode: Read from localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          if (userData.uid === uid) {
            return {
              id: userData.uid,
              uid: userData.uid,
              name: userData.name || "User",
              email: userData.email,
              avatar: userData.avatar,
              address: userData.address,
              onboardingCompleted: userData.onboardingCompleted ?? true,
            };
          }
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }

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

    // Dev Mode: Update localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          const updated = { ...userData, ...updates };
          localStorage.setItem("auth_user", JSON.stringify(updated));

          return {
            id: updated.uid,
            uid: updated.uid,
            name: updated.name || "User",
            email: updated.email,
            avatar: updated.avatar,
            address: updated.address,
            onboardingCompleted: updated.onboardingCompleted ?? true,
          };
        } catch (error) {
          console.error("Error updating user:", error);
          throw error;
        }
      }
    }

    throw new Error("User not found");
  },

  /**
   * Create user profile in Supabase
   * TODO: Implement Supabase insert when ready
   */
  createUserProfile: async (user: User): Promise<User> => {
    await delay(500);

    // Dev Mode: Save to localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
          address: user.address,
          onboardingCompleted: user.onboardingCompleted,
        })
      );
    }

    return user;
  },
};
