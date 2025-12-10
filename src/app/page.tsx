"use client";

import { useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 font-sans">
      <h1 className="text-4xl font-bold">ReRead Project</h1>
    </div>
  );
}
