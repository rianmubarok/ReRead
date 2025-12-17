"use client";

import React, { useState, useEffect } from "react";
import BookCard from "@/components/home/BookCard";
import { RiBookmarkFill } from "@remixicon/react";
import BookmarksHeader from "@/components/bookmarks/BookmarksHeader";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getBookRepository } from "@/repositories/book.repository";
import { Book } from "@/types/book";

export default function BookmarksPage() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [bookmarks, setBookmarks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBookmarks = async () => {
            if (user?.uid) {
                setIsLoading(true);
                try {
                    const data = await getBookRepository().getBookmarks(user.uid);
                    setBookmarks(data);
                } catch (e) {
                    console.error("Failed to fetch bookmarks", e);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchBookmarks();
    }, [user]);

    const handleRemoveBookmark = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user?.uid) return;

        // Optimistic UI update
        const previousBookmarks = [...bookmarks];
        setBookmarks((prev) => prev.filter((b) => b.id !== id));

        try {
            await getBookRepository().toggleBookmark(id, user.uid);
            toast.success("Buku dihapus dari simpanan");
        } catch (error) {
            setBookmarks(previousBookmarks);
            toast.error("Gagal menghapus bookmark");
        }
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

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <>
                            {/* Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {filteredBooks.map((book) => (
                                    <BookCard
                                        key={book.id}
                                        book={book}
                                        fullWidth
                                        actionOverlay={
                                            <button
                                                onClick={(e) => handleRemoveBookmark(book.id, e)}
                                                className="p-2 backdrop-blur-sm rounded-full text-brand-red hover:bg-gray-100 transition-colors bg-white/50"
                                            >
                                                <RiBookmarkFill className="w-5 h-5" />
                                            </button>
                                        }
                                    />
                                ))}
                            </div>

                            {/* Empty State */}
                            {filteredBooks.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-brand-gray">
                                        <RiBookmarkFill className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-brand-black">Belum ada simpanan</h3>
                                        <p className="text-sm text-brand-gray mt-1">
                                            {searchQuery ? "Tidak ditemukan buku yang cocok." : "Buku yang kamu simpan akan muncul di sini."}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
