"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiSearchLine, RiMicLine } from "@remixicon/react";

export default function SearchBar() {
    const router = useRouter();
    const [query, setQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray">
                <RiSearchLine className="w-5 h-5" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari buku..."
                className="w-full bg-gray-100 rounded-full py-3.5 pl-12 pr-12 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50 transition-shadow"
            />
            <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors"
                onClick={() => { }} // Placeholder for voice search
            >
                <RiMicLine className="w-5 h-5" />
            </button>
        </form>
    );
}
