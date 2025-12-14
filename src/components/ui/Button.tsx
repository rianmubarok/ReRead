"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Shared Button Component
 * 
 * Provides consistent button styling across the app.
 * Used in: ActionButtons, SignInForm, Walkthrough, and other action areas.
 * 
 * @param variant - "primary" (red), "secondary" (black), "outline" (red outline)
 * @param fullWidth - Makes button take full width of container
 * @param className - Additional classes for customization
 */
export default function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-semibold text-sm py-4 rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: "bg-brand-red text-white",
    secondary: "bg-brand-black text-white",
    outline: "bg-brand-red/15 text-brand-red",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

