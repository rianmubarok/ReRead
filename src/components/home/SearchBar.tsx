"use client";

import React from "react";
import { RiSearchLine, RiMicLine } from "@remixicon/react";

export default function SearchBar() {
    return (
        <div className="relative mb-6">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray">
                <RiSearchLine className="w-5 h-5" />
            </div>
            <input
                type="text"
                placeholder="Cari"
                className="w-full bg-gray-100 rounded-full py-3.5 pl-12 pr-12 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50 transition-shadow"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-brand-black transition-colors">
                <RiMicLine className="w-5 h-5" />
            </button>
        </div>
    );
}
