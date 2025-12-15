"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { MOCK_BOOKS, Book } from "@/data/mockBooks";
import BookCard from "@/components/home/BookCard";
import CategoryFilter from "@/components/home/CategoryFilter";

// Map types to titles and filter logic
const PAGE_CONFIG = {
    nearby: {
        title: "Buku Terdekat",
        filter: (books: Book[]) => books, // Show all
    },
    recent: {
        title: "Baru Ditambahkan",
        // Logic: Show all books
        filter: (books: Book[]) => books,
    },
    free: {
        title: "Siap Dipinjam / Gratis",
        filter: (books: Book[]) => books.filter(b => !b.price || b.price === 0),
    }
} as const;

export default function ViewAllPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);
    const router = useRouter();
    const [category, setCategory] = useState("Semua");

    const config = PAGE_CONFIG[type as keyof typeof PAGE_CONFIG];

    if (!config) {
        return (
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <p>Halaman tidak ditemukan</p>
            </div>
        );
    }

    const books = config.filter(MOCK_BOOKS).filter(b => category === "Semua" || b.category === category);

    return (
        <div className="min-h-screen bg-brand-white pb-32 animate-fade-in pt-36">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 z-50 border-b border-gray-100">
                <div className="flex items-center gap-4 py-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <RiArrowLeftLine className="w-6 h-6" />
                    </button>
                    <div className="flex-1 font-bold text-lg text-brand-black">
                        {config.title}
                    </div>
                </div>
                <div className="pb-2">
                    <CategoryFilter selectedCategory={category} onSelectCategory={setCategory} />
                </div>
            </div>

            <div className="px-6">
                <div className="grid grid-cols-2 gap-4">
                    {books.map((book) => (
                        <BookCard key={book.id} book={book} fullWidth />
                    ))}
                </div>
                {books.length === 0 && (
                    <div className="text-center py-20 text-brand-gray">
                        Tidak ada buku ditemukan.
                    </div>
                )}
            </div>
        </div>
    )
}
