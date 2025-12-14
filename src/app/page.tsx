"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Walkthrough from "@/components/Walkthrough";
import SignInForm from "@/components/SignInForm";
import { useNav } from "@/context/NavContext";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const [showSignIn, setShowSignIn] = useState(false);
  const { setVisible } = useNav();

  useEffect(() => {
    // Hide nav during splash, walkthrough, or sign in
    if (showSplash || showWalkthrough || showSignIn) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [showSplash, showWalkthrough, showSignIn, setVisible]);

  const handleSplashFinish = () => {
    setShowSplash(false);
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
