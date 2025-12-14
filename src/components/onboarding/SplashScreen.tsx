import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Trigger entry animation
    setTimeout(() => setMounted(true), 100);

    // Start fading out
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 2000);

    // Finish
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`absolute inset-0 z-[200] flex flex-col items-center justify-center bg-brand-red transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`relative w-20 h-20 transition-all duration-1000 ease-out transform ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <Image
          src="/assets/logo/logo.svg"
          alt="ReRead Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1
        className={`text-brand-white text-xl font-sans font-medium transition-all duration-1000 delay-300 ease-out transform ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        ReRead
      </h1>
    </div>
  );
}

