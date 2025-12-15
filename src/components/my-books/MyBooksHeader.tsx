"use client";

import React from "react";
import { RiSearchLine, RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MyBooksHeader() {
    const router = useRouter();

    return (
        <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 z-50">
            <div className="flex items-center gap-4 py-6 pt-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                >
                    <RiArrowLeftLine className="w-6 h-6" />
                </button>

                {/* Title / Search */}
                <div className="flex-1 font-bold text-lg text-brand-black">
                    Buku Saya
                </div>
            </div>
        </div>
    );
}
