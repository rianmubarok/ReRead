"use client";

import React, { useEffect } from "react";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

interface CategoryFilterProps {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
    selectedCategory,
    onSelectCategory,
}: CategoryFilterProps) {
    const { ref, events, isDragging } = useDraggableScroll();
    const categories = ["Semua", "Fiksi", "Non-Fiksi", "Pendidikan", "Komik", "Sastra"];

    // Ensure scroll starts from left (scrollLeft = 0) on mount
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollLeft = 0;
        }
    }, []);

    return (
        <div
            {...events}
            ref={ref}
            className={`flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
        >
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`flex-shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
            ${selectedCategory === cat
                            ? "bg-brand-red text-white"
                            : "bg-gray-100 text-brand-black hover:bg-gray-200"
                        }
          `}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
