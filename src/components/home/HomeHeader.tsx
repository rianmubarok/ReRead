"use client";

import React from "react";
import Image from "next/image";
import { RiMenuLine } from "@remixicon/react";
import { User } from "@/types/user";

interface HomeHeaderProps {
    user: User | null;
}

export default function HomeHeader({ user }: HomeHeaderProps) {
    // Use first name for greeting
    const firstName = user?.name.split(" ")[0] || "Teman";

    return (
        <div className="flex flex-col gap-6 pt-12 mb-6">
            <div className="flex justify-between items-center">
                {/* Hamburger Menu (Placeholder for Drawer) */}
                <button className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors">
                    <RiMenuLine className="w-6 h-6" />
                </button>

                {/* User Avatar */}
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    {user?.avatar && user.avatar !== 'google' ? (
                        <Image
                            src={`/assets/avatar/${user.avatar}`}
                            alt={user.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            {user?.name.charAt(0) || "U"}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-1">
                <p className="text-sm text-brand-gray font-medium">
                    Selamat datang kembali, {firstName}!
                </p>
                <h1 className="text-2xl font-bold text-brand-black leading-tight">
                    Buku apa yang ingin <br /> kamu cari hari ini?
                </h1>
            </div>
        </div>
    );
}
