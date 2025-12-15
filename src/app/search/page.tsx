"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RiArrowLeftLine, RiSearchLine, RiCloseCircleFill, RiFilter3Line } from "@remixicon/react";
import { MOCK_BOOKS } from "@/data/mockBooks";
import BookCard from "@/components/home/BookCard";

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";
    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const filteredBooks = query.trim() === ""
        ? []
        : MOCK_BOOKS.filter(book =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase())
        );

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const clearSearch = () => {
        setQuery("");
        router.push("/search");
    };

    return (
        <div className="min-h-screen bg-brand-white pb-32 animate-fade-in pt-28">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 z-50 border-b border-gray-100">
                <div className="flex items-center gap-3 py-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <RiArrowLeftLine className="w-6 h-6" />
                    </button>

                    <form onSubmit={handleSearch} className="flex-1 relative">
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Cari judul atau penulis..."
                            className="w-full bg-gray-100 rounded-full py-3 pl-10 pr-10 text-brand-black focus:outline-none focus:ring-1 focus:ring-brand-red/50 text-sm"
                        />
                        <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {query && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <RiCloseCircleFill className="w-5 h-5" />
                            </button>
                        )}
                    </form>
                    <button className="p-2 -mr-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <RiFilter3Line className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="px-6">
                {query.trim() === "" ? (
                    <div className="text-center py-20 text-gray-400">
                        <RiSearchLine className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>Ketik untuk mencari buku</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <div className="mb-4 text-sm text-gray-500">
                            Ditemukan {filteredBooks.length} hasil untuk "{query}"
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {filteredBooks.map((book) => (
                                <BookCard key={book.id} book={book} fullWidth />
                            ))}
                        </div>
                        {filteredBooks.length === 0 && (
                            <div className="text-center py-20 text-brand-gray">
                                Tidak ada buku ditemukan.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-brand-white" />}>
            <SearchContent />
        </Suspense>
    );
}
