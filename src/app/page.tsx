"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Walkthrough from "@/components/Walkthrough";
import { useNav } from "@/context/NavContext";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(true);
  const { setVisible } = useNav();

  useEffect(() => {
    // Hide nav during splash or walkthrough
    if (showSplash || showWalkthrough) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [showSplash, showWalkthrough, setVisible]);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const handleWalkthroughFinish = () => {
    setShowWalkthrough(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {showWalkthrough ? (
        <Walkthrough onFinish={handleWalkthroughFinish} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans animate-fade-in-up">
          <h1 className="text-4xl font-bold">ReRead Project</h1>
          {/* Main Home Content will go here */}
        </div>
      )}
    </>
  );
}
