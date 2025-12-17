"use client";

import React from "react";
import Image from "next/image";
import { RiMapPinLine, RiMore2Fill } from "@remixicon/react";
import { Book } from "@/types/book";
import { useAuth } from "@/context/AuthContext";

import Link from "next/link";

interface OwnerInfoProps {
    owner: Book['owner'];
}

export default function OwnerInfo({ owner }: OwnerInfoProps) {
    const { user } = useAuth();

    // Fallback logic: if this is the logged-in user, trust the auth context address first if available, 
    // otherwise fallback to owner prop. 
    // Uses owner.address if locationLabel is missing.
    const isMe = user?.id === owner.id;

    const displayLocation = (isMe && user?.address)
        ? `${user.address.district}, ${user.address.regency}`
        : (owner.locationLabel || (owner.address ? `${owner.address.district}, ${owner.address.regency}` : "Lokasi tidak diketahui"));

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100 group-hover:border-gray-300 transition-colors">
                    {owner.avatar && owner.avatar !== 'google' ? (
                        <Image
                            src={owner.avatar.startsWith('http') ? owner.avatar : `/assets/avatar/${owner.avatar}`}
                            alt={owner.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold text-lg">
                            {owner.name.charAt(0)}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <h4 className="font-bold text-brand-black text-sm">{owner.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-brand-gray">
                        <RiMapPinLine className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{displayLocation}</span>
                    </div>
                </div>
            </div>

            <button className="text-brand-black p-2 hover:bg-gray-100 rounded-full">
                <RiMore2Fill className="w-5 h-5" />
            </button>
        </div>
    );
}
