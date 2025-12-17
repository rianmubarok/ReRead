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
import HomeWelcome from "@/components/home/HomeWelcome";
import { haversineDistance } from "@/utils/distance";
import { getBookRepository } from "@/repositories/book.repository";
import { Book } from "@/types/book";

export default function Home() {
  const { setVisible } = useNav();
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();

  const [category, setCategory] = useState("Semua");
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);

  // Initialize state - will be set based on auth status
  const [showSplash, setShowSplash] = useState(false);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // Fetch real books
  useEffect(() => {
    const fetchBooks = async () => {
      if (isAuthenticated && isInitialized) {
        setIsLoadingBooks(true);
        try {
          let allBooks = await getBookRepository().getAllBooks();
          // Filter out archived books globally for home page
          allBooks = allBooks.filter(b => (!b.status || b.status === "Available"));

          // Filter out books owned by the current user
          if (user) {
            allBooks = allBooks.filter((b) => b.owner.uid !== user.uid && b.owner.id !== user.uid);
          }

          // Sort by newest
          allBooks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setBooks(allBooks);
        } catch (error) {
          console.error("Failed to fetch books", error);
        } finally {
          setIsLoadingBooks(false);
        }
      }
    };

    fetchBooks();
  }, [isAuthenticated, isInitialized]);

  useEffect(() => {
    // Immediately hide nav while checking auth to prevent flash
    if (isAuthLoading) {
      setVisible(false);
      return;
    }

    // Mark as initialized after first auth check
    if (!isInitialized) {
      setIsInitialized(true);

      // 1. Authenticated AND Onboarding Completed -> Go to Home
      if (isAuthenticated && user?.onboardingCompleted) {
        setShowSplash(false);
        setShowWalkthrough(false);
        setShowSignIn(false);
        setVisible(true); // Show nav
        return;
      }

      // 2. Authenticated BUT Onboarding NOT Completed (e.g. New Google User) -> Go to Sign In Form
      if (isAuthenticated && !user?.onboardingCompleted) {
        setShowSplash(false);
        setShowWalkthrough(false);
        setShowSignIn(true);
        setVisible(false);
        return;
      }

      // 3. Not Authenticated -> Start Onboarding (Splash)
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

  // Block navigation to other routes during onboarding
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && !user?.onboardingCompleted) {
      // User is authenticated but hasn't completed onboarding
      // This prevents them from navigating to other pages
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isAuthLoading, isAuthenticated, user?.onboardingCompleted]);

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

            {/* Loading Books Indicator */}
            {isLoadingBooks && (
              <div className="flex justify-center py-10">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
              </div>
            )}

            {!isLoadingBooks && (
              <>
                <div
                  className={useComplexAnimation ? "animate-slide-up animate-delay-300" : ""}
                >
                  <BookSection
                    title="Terdekat"
                    books={(category === "Semua" ? books : books.filter(b => b.category === category))
                      .filter(b => b.owner.id !== user?.id)
                      .sort((a, b) => {
                        const distA = haversineDistance(user?.coordinates, a.owner.coordinates) ?? Infinity;
                        const distB = haversineDistance(user?.coordinates, b.owner.coordinates) ?? Infinity;
                        return distA - distB;
                      })
                      .slice(0, 8)}
                    variant="nearby"
                    href="/books/nearby"
                  />
                </div>

                <div
                  className={useComplexAnimation ? "animate-slide-up animate-delay-400" : ""}
                >
                  <BookSection
                    title="Baru Ditambahkan"
                    books={(category === "Semua" ? books : books.filter(b => b.category === category))
                      .filter(b => b.owner.id !== user?.id)
                      .slice(0, 8)} // Already sorted by created_at in repo logic? Need to verify repo default sort.
                    variant="trending"
                    href="/books/recent"
                  />
                </div>

                <div
                  className={useComplexAnimation ? "animate-slide-up animate-delay-500" : ""}
                >
                  <BookSection
                    title="Siap Dipinjam / Gratis"
                    books={books.filter(b =>
                      (!b.exchangeMethods?.length || b.exchangeMethods.includes("Gratis / Dipinjamkan")) && // Check based on new schema
                      (category === "Semua" || b.category === category) &&
                      b.owner.id !== user?.id
                    ).slice(0, 8)}
                    href="/books/free"
                  />
                </div>
              </>
            )}

          </div>
        </div>
      </>
    );
  }

  // Show onboarding flow for unauthenticated users
  if (!showSplash && !showWalkthrough && !showSignIn) {
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
