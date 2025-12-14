"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/onboarding/SplashScreen";
import Walkthrough from "@/components/onboarding/Walkthrough";
import SignInForm from "@/components/onboarding/SignInForm";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { setVisible } = useNav();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  // Initialize state - will be controlled by useEffect based on auth status
  const [showSplash, setShowSplash] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // Wait for auth check to complete
    if (isAuthLoading) {
      return;
    }

    // If authenticated, skip everything immediately
    if (isAuthenticated && user?.onboardingCompleted) {
      setShowSplash(false);
      setShowWalkthrough(false);
      setShowSignIn(false);
      setVisible(true); // Show nav
      return;
    }

    // If not authenticated, start onboarding flow
    if (!isAuthenticated) {
      // Only start splash if we haven't started onboarding yet
      if (!showSplash && !showWalkthrough && !showSignIn) {
        setShowSplash(true);
      }
    }

    // Control nav visibility
    if (showSplash || showWalkthrough || showSignIn) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [showSplash, showWalkthrough, showSignIn, setVisible, isAuthenticated, isAuthLoading, user?.onboardingCompleted]);

  const handleSplashFinish = () => {
    if (isAuthenticated) return; // Should be handled by effect, but safety
    setShowSplash(false);
    setShowWalkthrough(true);
  };

  const handleWalkthroughFinish = () => {
    setShowWalkthrough(false);
    setShowSignIn(true);
  };

  const handleSignInFinish = () => {
    setShowSignIn(false);
  }

  // Early return: if authenticated, skip all onboarding
  if (!isAuthLoading && isAuthenticated && user?.onboardingCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans animate-fade-in-up">
        <h1 className="text-4xl font-bold">ReRead Project</h1>
        {/* Main Home Content will go here */}
      </div>
    );
  }

  // Show loading state while checking auth
  if (isAuthLoading) {
    return null; // Or a loading spinner
  }

  // Show onboarding flow for unauthenticated users
  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!showSplash && showWalkthrough && (
        <Walkthrough onFinish={handleWalkthroughFinish} />
      )}

      {!showSplash && !showWalkthrough && showSignIn && (
        <SignInForm onFinish={handleSignInFinish} />
      )}

      {!showSplash && !showWalkthrough && !showSignIn && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans animate-fade-in-up">
          <h1 className="text-4xl font-bold">ReRead Project</h1>
          {/* Main Home Content will go here */}
        </div>
      )}
    </>
  );
}
