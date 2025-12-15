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
    const [activeTab, setActiveTab] = React.useState<"active" | "archived">("active");
    const [activeBooks, setActiveBooks] = React.useState<typeof MOCK_BOOKS>([]);
    const [archivedBooks, setArchivedBooks] = React.useState<typeof MOCK_BOOKS>([]);
    const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
    const [isInitialized, setIsInitialized] = React.useState(false);

    // Initialize books based on user
    React.useEffect(() => {
        if (user && !isInitialized) {
            const userBooks = MOCK_BOOKS.filter(book => book.owner.id === user.id);
            setActiveBooks(userBooks);
            // If we had archived books in mock data we would filter them here too
            setIsInitialized(true);
        }
    }, [user, isInitialized]);

    const handleArchive = (bookId: string) => {
        const bookToArchive = activeBooks.find(b => b.id === bookId);
        if (bookToArchive) {
            setActiveBooks(prev => prev.filter(b => b.id !== bookId));
            setArchivedBooks(prev => [...prev, bookToArchive]);
            setOpenMenuId(null);
            // In a real app, call API
        }
    };

    const handleUnarchive = (bookId: string) => {
        const bookToUnarchive = archivedBooks.find(b => b.id === bookId);
        if (bookToUnarchive) {
            setArchivedBooks(prev => prev.filter(b => b.id !== bookId));
            setActiveBooks(prev => [...prev, bookToUnarchive]);
            setOpenMenuId(null);
        }
    };

    const handleDelete = (bookId: string, fromArchive = false) => {
        if (confirm("Apakah anda yakin ingin menghapus buku ini?")) {
            if (fromArchive) {
                setArchivedBooks(prev => prev.filter(b => b.id !== bookId));
            } else {
                setActiveBooks(prev => prev.filter(b => b.id !== bookId));
            }
            setOpenMenuId(null);
        }
    };

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        if (openMenuId) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => document.removeEventListener('click', handleClickOutside);
    }, [openMenuId]);

    const displayBooks = activeTab === "active" ? activeBooks : archivedBooks;

    return (
        <>
            <MyBooksHeader />
            <div className="min-h-screen bg-brand-white pb-24 animate-fade-in pt-24">
                <div className="px-6">

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-gray-100">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "active" ? "text-brand-black" : "text-brand-gray"
                                }`}
                        >
                            Aktif
                            {activeTab === "active" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-black rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab("archived")}
                            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "archived" ? "text-brand-black" : "text-brand-gray"
                                }`}
                        >
                            Arsip
                            {activeTab === "archived" && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-black rounded-full" />
                            )}
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {displayBooks.map((book) => (
                            <BookCard
                                key={book.id}
                                book={book}
                                fullWidth
                                actionOverlay={
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault(); // Extra safety
                                                // Toggle current menu, close others
                                                setOpenMenuId(openMenuId === book.id ? null : book.id);
                                            }}
                                            className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
                                            </svg>
                                        </button>

                                        {openMenuId === book.id && (
                                            <div
                                                className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-20 animate-fade-in origin-top-right"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {activeTab === "active" ? (
                                                    <button
                                                        onClick={() => handleArchive(book.id)}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 text-brand-black"
                                                    >
                                                        <span className="text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M3 10H21V22H3V10ZM4 5H20V8H4V5Z"></path></svg>
                                                        </span>
                                                        Arsipkan
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnarchive(book.id)}
                                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center gap-2 text-brand-black"
                                                    >
                                                        <span className="text-gray-500">
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM12 6V11H17V13H12V18H10V13H5V11H10V6H12Z"></path></svg>
                                                        </span>
                                                        Kembalikan
                                                    </button>
                                                )}

                                                <button
                                                    onClick={() => handleDelete(book.id, activeTab === "archived")}
                                                    className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100"
                                                >
                                                    <span className="text-red-500">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path></svg>
                                                    </span>
                                                    Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {displayBooks.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-brand-gray">
                                {activeTab === "active" ? (
                                    <RiBookOpenLine className="w-8 h-8" />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M3 10H21V22H3V10ZM4 5H20V8H4V5Z"></path></svg>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-brand-black">
                                    {activeTab === "active" ? "Belum ada buku" : "Arsip Kosong"}
                                </h3>
                                <p className="text-sm text-brand-gray mt-1 max-w-[200px] mx-auto">
                                    {activeTab === "active"
                                        ? "Kamu belum menambahkan koleksi buku untuk ditukar atau dijual."
                                        : "Kamu belum mengarsipkan buku apapun."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Action Button (FAB) for Adding Book - Only show in Active tab */}
            {activeTab === "active" && (
                <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-40">
                    <Link
                        href="/my-books/add"
                        className="absolute bottom-28 right-6 w-14 h-14 bg-brand-black text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors pointer-events-auto active:scale-95"
                    >
                        <RiAddLine className="w-8 h-8" />
                    </Link>
                </div>
            )}
        </>
    );
}
