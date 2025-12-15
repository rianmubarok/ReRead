"use client";

import React from "react";
import BookCard from "@/components/home/BookCard";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { RiBookmarkFill } from "@remixicon/react";
import BookmarksHeader from "@/components/bookmarks/BookmarksHeader";

export default function BookmarksPage() {
    // Simulating bookmarked items (just taking a slice of mock data)
    const bookmarkedBooks = MOCK_BOOKS.slice(0, 6);

    return (
        <>
            <BookmarksHeader />
            <div className="min-h-screen bg-brand-white pb-24 animate-fade-in pt-28">
                <div className="px-6">

                {/* Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {bookmarkedBooks.map((book) => (
                        <BookCard key={book.id} book={book} fullWidth />
                    ))}
                </div>

                {/* Empty State (Hidden if has items) */}
                {bookmarkedBooks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-brand-gray">
                            <RiBookmarkFill className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-brand-black">Belum ada simpanan</h3>
                            <p className="text-sm text-brand-gray mt-1">
                                Buku yang kamu simpan akan muncul di sini.
                            </p>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </>
    );
}
