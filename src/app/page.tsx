"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/onboarding/SplashScreen";
import Walkthrough from "@/components/onboarding/Walkthrough";
import SignInForm from "@/components/onboarding/SignInForm";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { setVisible } = useNav();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  useEffect(() => {
    // If authenticated, skip everything
    if (!isAuthLoading && isAuthenticated) {
      setShowSplash(false);
      setShowWalkthrough(false);
      setShowSignIn(false);
      setVisible(true); // Show nav
      return;
    }

    if (showSplash || showWalkthrough || showSignIn) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [showSplash, showWalkthrough, showSignIn, setVisible, isAuthenticated, isAuthLoading]);

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
