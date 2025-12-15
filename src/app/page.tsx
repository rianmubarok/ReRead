"use client";

import { useState, useEffect } from "react";
import SplashScreen from "@/components/onboarding/SplashScreen";
import Walkthrough from "@/components/onboarding/Walkthrough";
import SignInForm from "@/components/onboarding/SignInForm";
import { useNav } from "@/context/NavContext";
import { useAuth } from "@/context/AuthContext";
import HomeHeader from "@/components/home/HomeHeader";
import SearchBar from "@/components/home/SearchBar";
import CategoryFilter from "@/components/home/CategoryFilter";
import BookSection from "@/components/home/BookSection";
import { MOCK_BOOKS } from "@/data/mockBooks";
import HomeWelcome from "@/components/home/HomeWelcome";

export default function Home() {
  const { setVisible } = useNav();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  const [category, setCategory] = useState("Semua");

  // Initialize state - will be set based on auth status
  const [showSplash, setShowSplash] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  useEffect(() => {
    // Immediately hide nav while checking auth to prevent flash
    if (isAuthLoading) {
      setVisible(false);
      return;
    }

    // Mark as initialized after first auth check
    if (!isInitialized) {
      setIsInitialized(true);

      // If authenticated, skip everything immediately
      if (isAuthenticated && user?.onboardingCompleted) {
        setShowSplash(false);
        setShowWalkthrough(false);
        setShowSignIn(false);
        setVisible(true); // Show nav
        return;
      }

      // If not authenticated, start onboarding with splash
      if (!isAuthenticated) {
        setShowSplash(true);
        setVisible(false);
        return;
      }
    }

    // Control nav visibility for subsequent updates
    if (showSplash || showWalkthrough || showSignIn) {
      setVisible(false);
    } else {
      setVisible(true);
    }
  }, [
    showSplash,
    showWalkthrough,
    showSignIn,
    setVisible,
    isAuthenticated,
    isAuthLoading,
    user?.onboardingCompleted,
    isInitialized,
  ]);

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
    // Start transition animation
    setIsTransitioning(true);
    setJustLoggedIn(true); // Enable exit animation for next screen

    // Wait for fade out animation to complete before hiding SignInForm
    setTimeout(() => {
      setShowSignIn(false);
      setIsTransitioning(false);
      // Show nav after transition
      setVisible(true);
    }, 400); // Match animation duration
  };

  // Handle justLoggedIn state cleanup
  useEffect(() => {
    if (justLoggedIn) {
      const timer = setTimeout(() => {
        setJustLoggedIn(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [justLoggedIn]);

  // Show loading state while checking auth - prevent flash of content
  // Don't render ANYTHING until auth check is complete
  if (isAuthLoading || !isInitialized) {
    return null;
  }

  // Main Home Page Content - only show if authenticated
  if (isAuthenticated && user?.onboardingCompleted) {
    // Use complex animation only when coming from signin
    const useComplexAnimation = justLoggedIn;
    // Always use fade-in like other pages, unless we're doing the complex login animation
    const useSimpleAnimation = !justLoggedIn;

    return (
      <>
        <HomeHeader user={user} />
        <div
          className={`min-h-screen bg-brand-white pb-24 overflow-x-hidden pt-24 ${useComplexAnimation ? "animate-fade-in-up" : useSimpleAnimation ? "animate-fade-in" : ""
            }`}
        >
          <div className="px-6">

          <div className={useComplexAnimation ? "animate-slide-up" : ""}>
            <HomeWelcome user={user} />
          </div>

          <div
            className={useComplexAnimation ? "animate-slide-up animate-delay-100" : ""}
          >
            <SearchBar />
          </div>

          <div
            className={useComplexAnimation ? "animate-slide-up animate-delay-200" : ""}
          >
            <CategoryFilter
              selectedCategory={category}
              onSelectCategory={setCategory}
            />
          </div>

          <div
            className={useComplexAnimation ? "animate-slide-up animate-delay-300" : ""}
          >
            <BookSection
              title="Terdekat"
              books={MOCK_BOOKS.slice(0, 5)}
              variant="nearby"
            />
          </div>

          <div
            className={useComplexAnimation ? "animate-slide-up animate-delay-400" : ""}
          >
            <BookSection
              title="Trending"
              books={MOCK_BOOKS.slice(5, 10)}
              variant="trending"
            />
          </div>
        </div>
        </div>
      </>
    );
  }

  // Show onboarding flow for unauthenticated users
  // This should only render after isInitialized is true and user is not authenticated
  // Ensure at least splash screen is shown
  if (!showSplash && !showWalkthrough && !showSignIn) {
    // This should not happen, but force show splash as fallback
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <>
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}

      {!showSplash && showWalkthrough && (
        <Walkthrough onFinish={handleWalkthroughFinish} />
      )}

      {!showSplash && !showWalkthrough && showSignIn && (
        <div className={isTransitioning ? "animate-fade-out" : ""}>
          <SignInForm onFinish={handleSignInFinish} />
        </div>
      )}
    </>
  );
}
