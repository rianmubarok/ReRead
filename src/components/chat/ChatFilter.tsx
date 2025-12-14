"use client";

import React from "react";

interface ChatFilterProps {
    filter: "all" | "unread";
    onFilterChange: (filter: "all" | "unread") => void;
}

export default function ChatFilter({ filter, onFilterChange }: ChatFilterProps) {
    return (
        <div className="flex gap-3 mb-6">
            <button
                onClick={() => onFilterChange("all")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
          ${filter === "all"
                        ? "bg-brand-red text-white"
                        : "bg-gray-100 text-brand-black hover:bg-gray-200"}
        `}
            >
                Semua
            </button>
            <button
                onClick={() => onFilterChange("unread")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors
          ${filter === "unread"
                        ? "bg-brand-red text-white"
                        : "bg-gray-100 text-brand-black hover:bg-gray-200"}
        `}
            >
                Belum Dibaca
            </button>
        </div>
    );
}
