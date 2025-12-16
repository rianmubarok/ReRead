"use client";

import React, { useEffect } from "react";
import { Book } from "@/types/book";
import BookCard from "./BookCard";
import { RiArrowRightSLine } from "@remixicon/react";
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

import Link from "next/link";

interface BookSectionProps {
    title: string;
    books: Book[];
    variant?: "nearby" | "trending";
    href?: string;
}

export default function BookSection({ title, books, variant = "nearby", href }: BookSectionProps) {
    const { ref, events, isDragging } = useDraggableScroll();

    // Ensure scroll starts from left (scrollLeft = 0) on mount
    useEffect(() => {
        if (ref.current) {
            ref.current.scrollLeft = 0;
        }
    }, []);

    return (
        <div className="mb-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-brand-black">{title}</h2>
                {href && (
                    <Link href={href} className="text-xs text-brand-black flex items-center gap-1 hover:opacity-70 transition-opacity">
                        Lihat Semua
                        <RiArrowRightSLine className="w-4 h-4" />
                    </Link>
                )}
            </div>

            {/* Grid/List */}
            <div
                {...events}
                ref={ref}
                className={`flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar
                    ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
                `}
            >
                {books.map((book) => (
                    <div key={book.id} className="flex-shrink-0">
                        <BookCard book={book} variant={variant} />
                    </div>
                ))}
            </div>
        </div>
    );
}
