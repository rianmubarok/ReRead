"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import UserInfo from "@/components/profile/UserInfo";
import MenuOptions from "@/components/profile/MenuOptions";

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated && !user) return null; // Or meaningful loading/redirect

    return (
        <div className="min-h-screen bg-brand-white pb-24 animate-fade-in">
            <div className="px-6 pt-12">
                <h1 className="text-2xl font-bold text-brand-black mb-2">Profil Saya</h1>

                <UserInfo user={user} />

                <div className="mt-8">
                    <MenuOptions />
                </div>

                <div className="mt-8 text-center text-xs text-gray-300">
                    Versi 1.0.0 (Dev Mode)
                </div>
            </div>
        </div>
    );
}
