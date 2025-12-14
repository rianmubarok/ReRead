"use client";

import React from "react";
import Image from "next/image";
import { RiMore2Fill, RiMapPinLine } from "@remixicon/react";
import { Book } from "@/data/mockBooks";

interface OwnerInfoProps {
    owner: Book['owner'];
}

export default function OwnerInfo({ owner }: OwnerInfoProps) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                    {/* Mock Avatar for now, utilizing 'name' if no image */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold text-lg">
                        {owner.name.charAt(0)}
                    </div>
                </div>

                {/* Info */}
                <div>
                    <h4 className="font-bold text-brand-black text-sm">{owner.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-brand-gray">
                        <RiMapPinLine className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">{owner.location}</span>
                    </div>
                </div>
            </div>

            <button className="text-brand-black p-2 hover:bg-gray-100 rounded-full">
                <RiMore2Fill className="w-5 h-5" />
            </button>
        </div>
    );
}
