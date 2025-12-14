import { User } from "@/types/user";

// Mock delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dev Mode: Simulate authentication with localStorage
const DEV_MODE = true; // Set to false when Firebase is ready

export const authService = {
  /**
   * Login user (Dev Mode: saves to localStorage)
   * TODO: Replace with Firebase Auth when ready
   */
  login: async (
    name: string,
    avatar: string,
    address: any,
    email?: string
  ): Promise<User> => {
    await delay(1000); // Simulate network latency

    const uid = `dev-user-${Math.random().toString(36).substr(2, 9)}`;
    const userData: User = {
      id: uid, // Keep id for backward compatibility
      uid: uid, // Firebase-compatible uid
      name,
      email: email || `test@mail.com`,
      avatar,
      address,
      onboardingCompleted: true,
    };

    // Dev Mode: Save to localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          name: userData.name,
          avatar: userData.avatar,
          address: userData.address,
          onboardingCompleted: userData.onboardingCompleted,
        })
      );
    }

    return userData;
  },

  /**
   * Logout user (Dev Mode: clears localStorage)
   * TODO: Replace with Firebase Auth when ready
   */
  logout: async (): Promise<void> => {
    await delay(500);

    // Dev Mode: Clear localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      localStorage.removeItem("auth_user");
    }
  },

  /**
   * Check current session (Dev Mode: reads from localStorage)
   * TODO: Replace with Firebase Auth when ready
   */
  checkSession: async (): Promise<User | null> => {
    await delay(500);

    // Dev Mode: Read from localStorage
    if (DEV_MODE && typeof window !== "undefined") {
      const stored = localStorage.getItem("auth_user");
      if (stored) {
        try {
          const userData = JSON.parse(stored);
          return {
            id: userData.uid, // Map uid to id for compatibility
            uid: userData.uid,
            name: userData.name || "User",
            email: userData.email,
            avatar: userData.avatar,
            address: userData.address,
            onboardingCompleted: userData.onboardingCompleted ?? true,
          };
        } catch (error) {
          console.error("Error parsing stored user:", error);
          return null;
        }
      }
    }

    return null;
  },
};
