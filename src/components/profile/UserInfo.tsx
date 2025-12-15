"use client";

import React from "react";
import Image from "next/image";
import { User } from "@/types/user";
import { RiMapPinLine, RiPencilLine } from "@remixicon/react";

interface UserInfoProps {
    user: User | null;
}

export default function UserInfo({ user }: UserInfoProps) {
    if (!user) return null;

    return (
        <div className="flex flex-col items-center py-8">
            {/* Avatar */}
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg mb-4 bg-gray-200">
                {user.avatar && user.avatar !== 'google' ? (
                    <Image
                        src={`/assets/avatar/${user.avatar}`}
                        alt={user.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                        {user.name.charAt(0)}
                    </div>
                )}
            </div>

            {/* Name & Address */}
            <h2 className="text-xl font-bold text-brand-black mb-1">{user.name}</h2>
            {user.address && (
                <div className="flex items-center gap-1 text-sm text-brand-gray mb-4">
                    <RiMapPinLine className="w-4 h-4" />
                    <span>{user.address.district}, {user.address.regency}, {user.address.province}</span>
                </div>
            )}

            {/* Edit Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-brand-black hover:bg-gray-200 transition-colors">
                <RiPencilLine className="w-4 h-4" />
                Edit Profil
            </button>
        </div>
    );
}
