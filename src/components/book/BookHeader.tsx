"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";

export default function BookHeader() {
    const router = useRouter();
    const [isBookmarked, setIsBookmarked] = useState(false);

    return (
        <div className="flex justify-between items-center py-4">
            <button
                onClick={() => router.back()}
                className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors"
            >
                <RiArrowLeftLine className="w-6 h-6" />
            </button>

            <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 -mr-2 rounded-full transition-colors ${isBookmarked ? 'text-brand-red' : 'text-brand-red hover:bg-red-50'}`}
            >
                {isBookmarked ? (
                    <RiBookmarkFill className="w-6 h-6" />
                ) : (
                    <RiBookmarkLine className="w-6 h-6" />
                )}
            </button>
        </div>
    );
}
