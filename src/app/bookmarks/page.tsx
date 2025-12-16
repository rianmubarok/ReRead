"use client";

import React, { useState } from "react";
import BookCard from "@/components/home/BookCard";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { RiBookmarkFill } from "@remixicon/react";
import BookmarksHeader from "@/components/bookmarks/BookmarksHeader";
import toast from "react-hot-toast";

export default function BookmarksPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarks, setBookmarks] = useState(MOCK_BOOKS.slice(0, 6));

    const handleRemoveBookmark = (id: string) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== id));
        toast.success("Buku dihapus dari simpanan");
    };

    // Filter based on search
    const filteredBooks = bookmarks.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <BookmarksHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="min-h-screen bg-brand-white pb-24 animate-fade-in pt-28">
                <div className="px-6">

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {filteredBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                fullWidth
                                actionOverlay={
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleRemoveBookmark(book.id);
                                        }}
                                        className="p-2 backdrop-blur-sm rounded-full text-brand-red hover:bg-gray-100 transition-colors"
                                    >
                                        <RiBookmarkFill className="w-5 h-5" />
                                    </button>
                                }
                            />
                        ))}
                    </div>

                    {/* Empty State (Hidden if has items) */}
                    {filteredBooks.length === 0 && (
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
