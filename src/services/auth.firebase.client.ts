"use client";

import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { firebaseApp, isFirebaseConfigured } from "@/lib/firebase";
import { setUser, getUser } from "@/storage/user.storage";
import type { User } from "@/types/user";

const auth = firebaseApp ? getAuth(firebaseApp) : null;
const provider = new GoogleAuthProvider();

import { uploadAvatarFromUrl } from "@/services/storage.service";

// ... existing imports

export async function loginWithGoogleFirebase(): Promise<User> {
  if (!isFirebaseConfigured || !auth) {
    throw new Error("Firebase belum dikonfigurasi. Pastikan env NEXT_PUBLIC_FIREBASE_* terisi.");
  }

  const result = await signInWithPopup(auth, provider);
  const fbUser = result.user;

  const uid = fbUser.uid;
  const name = fbUser.displayName || "Pengguna";
  const email = fbUser.email || undefined;

  // Default to Google URL or "google" placeholder
  let avatar = fbUser.photoURL || "google";

  // Attempt to upload to Supabase implementation
  // This ensures we have a persistent copy of the avatar in our own storage
  if (fbUser.photoURL) {
    console.log("Original Google Avatar:", fbUser.photoURL);
    try {
      const newAvatarUrl = await uploadAvatarFromUrl(uid, fbUser.photoURL);
      if (newAvatarUrl) {
        console.log("Uploaded to Supabase:", newAvatarUrl);
        avatar = newAvatarUrl;
      } else {
        console.log("Upload returned null, using original.");
      }
    } catch (err) {
      console.error("Failed to upload avatar to Supabase:", err);
      // Fallback to google url is already set
    }
  }

  // Check if we have existing data for this user to preserve address/onboarding status
  // In a real app, we would fetch this from Supabase/Database
  const existingUser = getUser();
  const isReturningUser = existingUser && existingUser.uid === uid && existingUser.onboardingCompleted;

  const userData: User = {
    id: uid,
    uid,
    name,
    email,
    avatar,
    // Preserve address and completion status if it's the same user
    address: isReturningUser ? existingUser.address : undefined,
    coordinates: isReturningUser ? existingUser.coordinates : undefined,
    // If returning user with data, completed. Else false to force data entry.
    onboardingCompleted: !!isReturningUser,
  };

  setUser(userData);
  console.log("Login flow completed successfully!", userData);
  return userData;
}


