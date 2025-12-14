"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
    RiSettings4Line,
    RiQuestionLine,
    RiLogoutBoxRLine,
    RiArrowRightSLine
} from "@remixicon/react";

export default function MenuOptions() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        // authService.logout already handles clearing user data via user.storage
        // For dev mode, we can optionally clear all storage if needed
        await logout();
        router.push('/'); // Will trigger onboarding flow
    };

    const menuItems = [
        { icon: RiSettings4Line, label: "Pengaturan", onClick: () => { } },
        { icon: RiQuestionLine, label: "Bantuan & Dukungan", onClick: () => { } },
    ];

    return (
        <div className="space-y-2">
            {menuItems.map((item, index) => (
                <button
                    key={index}
                    onClick={item.onClick}
                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                    <div className="flex items-center gap-3 text-brand-black">
                        <item.icon className="w-5 h-5 text-brand-gray group-hover:text-brand-black transition-colors" />
                        <span className="font-medium">{item.label}</span>
                    </div>
                    <RiArrowRightSLine className="w-5 h-5 text-gray-300 group-hover:text-brand-black transition-colors" />
                </button>
            ))}

            <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group mt-6"
            >
                <div className="flex items-center gap-3 text-brand-red">
                    <RiLogoutBoxRLine className="w-5 h-5" />
                    <span className="font-bold">Keluar</span>
                </div>
            </button>
        </div>
    );
}
