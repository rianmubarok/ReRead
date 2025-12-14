"use client";

import React from "react";

interface BottomContainerProps {
  children: React.ReactNode;
  variant?: "fixed" | "absolute";
  withGradient?: boolean;
  className?: string;
}

/**
 * Shared Bottom Container Component
 * 
 * Provides consistent styling for bottom action bars across the app.
 * Used in: ActionButtons, SignInForm, and other bottom action areas.
 * 
 * @param variant - "fixed" for persistent bottom bar, "absolute" for relative positioning
 * @param withGradient - Adds gradient background (used in onboarding flows)
 * @param className - Additional classes for customization
 */
export default function BottomContainer({
  children,
  variant = "fixed",
  withGradient = false,
  className = "",
}: BottomContainerProps) {
  const positionClass = variant === "fixed" ? "fixed" : "absolute";
  const gradientClass = withGradient
    ? "bg-gradient-to-t from-white via-white to-transparent"
    : "bg-white border-t border-gray-100";

  return (
    <div
      className={`${positionClass} bottom-0 left-0 right-0 ${gradientClass} px-8 pt-8 pb-8 flex items-center max-w-md mx-auto z-50 w-full ${className}`}
    >
      {children}
    </div>
  );
}

