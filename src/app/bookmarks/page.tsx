"use client";

import React from "react";
import BookCard from "@/components/home/BookCard";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { RiBookmarkFill, RiSearchLine, RiMore2Fill } from "@remixicon/react";

export default function BookmarksPage() {
    // Simulating bookmarked items (just taking a slice of mock data)
    const bookmarkedBooks = MOCK_BOOKS.slice(0, 6);

    return (
        <div className="min-h-screen bg-brand-white pb-24 animate-fade-in">
            <div className="px-6">
                {/* Header - Similar to Chat */}
                <div className="flex items-center gap-4 py-6 pt-12">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari simpanan"
                            className="w-full bg-gray-100 text-brand-black rounded-full pl-11 pr-4 py-3.5 placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50 transition-shadow"
                        />
                    </div>

                    {/* Menu Button */}
                    <button className="p-2 -mr-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <RiMore2Fill className="w-6 h-6" />
                    </button>
                </div>

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
    );
}
