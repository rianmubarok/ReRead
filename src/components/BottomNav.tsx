"use client";

import React from "react";
import Link from "next/link";
import { useNav } from "@/context/NavContext";

export default function BottomNav() {
    const { isVisible } = useNav();

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50">
            <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-xs mt-1">Home</span>
            </Link>
            <Link href="/search" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-xs mt-1">Search</span>
            </Link>
            <Link href="/library" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-xs mt-1">Library</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-blue-600 transition-colors">
                <span className="text-xs mt-1">Profile</span>
            </Link>
        </div>
    );
}
