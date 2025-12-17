"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine } from "@remixicon/react";
import { Book } from "@/types/book";
import BookCard from "@/components/home/BookCard";
import CategoryFilter from "@/components/home/CategoryFilter";
import { getBookRepository } from "@/repositories/book.repository";

import { useAuth } from "@/context/AuthContext";
import { haversineDistance } from "@/utils/distance";

// Map types to titles and filter logic
const PAGE_CONFIG = {
    nearby: {
        title: "Buku Terdekat",
        filter: (books: Book[]) => books, // Show all initially
    },
    recent: {
        title: "Baru Ditambahkan",
        filter: (books: Book[]) => books,
    },
    free: {
        title: "Siap Dipinjam / Gratis",
        filter: (books: Book[]) => books.filter(b => (!b.exchangeMethods?.length || b.exchangeMethods.includes("Gratis / Dipinjamkan"))),
    }
} as const;

export default function ViewAllPage({ params }: { params: Promise<{ type: string }> }) {
    const { type } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [category, setCategory] = useState("Semua");

    // State for data
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const config = PAGE_CONFIG[type as keyof typeof PAGE_CONFIG];

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const allBooks = await getBookRepository().getAllBooks();
                // Filter out archived books and my own books
                const activeBooks = allBooks.filter(b =>
                    (!b.status || b.status === "Available") &&
                    b.owner.id !== user?.id
                );

                // Apply type-specific pre-filter
                let filtered = activeBooks;
                if (config && config.filter) {
                    filtered = config.filter(activeBooks);
                }

                setBooks(filtered);
            } catch (error) {
                console.error("Failed to fetch books", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBooks();
        }
    }, [user, config]);

    if (!config) {
        return (
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <p>Halaman tidak ditemukan</p>
            </div>
        );
    }

    // 2. Filter by category
    let displayBooks = books.filter(b => category === "Semua" || b.category === category);

    // 3. Sort based on type
    if (type === "nearby" && user?.coordinates) {
        displayBooks = [...displayBooks].sort((a, b) => {
            const distA = haversineDistance(user?.coordinates, a.owner.coordinates) ?? Infinity;
            const distB = haversineDistance(user?.coordinates, b.owner.coordinates) ?? Infinity;
            return distA - distB;
        });
    } else if (type === "recent") {
        // Sort by created_at descending (newest first)
        displayBooks = [...displayBooks].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA; // Descending
        });
    }

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
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        {displayBooks.length > 0 ? (
                            <div className="grid grid-cols-2 gap-4">
                                {displayBooks.map((book) => (
                                    <BookCard key={book.id} book={book} fullWidth />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-brand-gray">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M5 2H19C19.5523 2 20 2.44772 20 3V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V3C4 2.44772 4.44772 2 5 2ZM6 4V20H18V4H6ZM11.5352 14.1213L7.29256 9.87868L8.70677 8.46447L11.5352 11.2929L15.7779 7.05025L17.1921 8.46447L11.5352 14.1213Z"></path></svg>
                                </div>
                                <div className="text-brand-gray">
                                    <p className="font-bold">Belum ada buku</p>
                                    <p className="text-sm">Tidak ada buku yang sesuai dengan filter ini.</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
