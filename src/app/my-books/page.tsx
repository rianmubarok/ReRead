"use client";

import React from "react";
import BookCard from "@/components/home/BookCard";
// TODO: Replace with real data store or API
import { MOCK_BOOKS } from "@/data/mockBooks";
import { useAuth } from "@/context/AuthContext";
import MyBooksHeader from "@/components/my-books/MyBooksHeader";
import { RiAddLine, RiBookOpenLine } from "@remixicon/react";
import Link from "next/link";

export default function MyBooksPage() {
    const { user } = useAuth();

    // Filter books owned by the current user
    // Note: In a real app, this would be an API call like /api/books/my-books
    // For now, we filter mock data based on user ID match if mock user IDs align, 
    // or just show a subset if IDs don't match perfectly in this mock setup.
    // Let's assume MOCK_USERS[0].id is what we use if user is not found or mock match.
    // Actually, let's try to match by name or just show all for demo if ID auth is mock.

    // Logic: If user is logged in, show books where owner.id === user.id
    // If no user, show empty or redirect (protected route logic usually handles this)

    const myBooks = React.useMemo(() => {
        if (!user) return [];
        return MOCK_BOOKS.filter(book => book.owner.id === user.id);
    }, [user]);

    // Fallback for demo: if myBooks is empty, show a few random ones locally so the user sees something
    // (Only for this prototype since newly created users won't have books in MOCK_BOOKS)
    const displayBooks = myBooks.length > 0 ? myBooks : [];

    return (
        <>
            <MyBooksHeader />
            <div className="min-h-screen bg-brand-white pb-24 animate-fade-in pt-24">
                <div className="px-6">

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {displayBooks.map((book) => (
                            <BookCard key={book.id} book={book} fullWidth />
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayBooks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-brand-gray">
                                <RiBookOpenLine className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-black">Belum ada buku</h3>
                                <p className="text-sm text-brand-gray mt-1 max-w-[200px] mx-auto">
                                    Kamu belum menambahkan koleksi buku untuk ditukar atau dijual.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) for Adding Book */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-40">
                <Link
                    href="/my-books/add"
                    className="absolute bottom-28 right-6 w-14 h-14 bg-brand-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors pointer-events-auto active:scale-95"
                >
                    <RiAddLine className="w-8 h-8" />
                </Link>
            </div>
        </>
    );
}
