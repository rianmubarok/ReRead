"use client";

import React, { use, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MOCK_BOOKS } from "@/data/mockBooks";
import BookHeader from "@/components/book/BookHeader";
import OwnerInfo from "@/components/book/OwnerInfo";
import ActionButtons from "@/components/book/ActionButtons";
import { useNav } from "@/context/NavContext";
import HideOnScroll from "@/components/ui/HideOnScroll";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { setVisible } = useNav();
    const book = MOCK_BOOKS.find((b) => b.id === id);

    useEffect(() => {
        setVisible(false);
        return () => setVisible(true);
    }, [setVisible]);

    if (!book) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-brand-white pb-32 animate-fade-in">
            <div className="px-6 relative">
                <HideOnScroll>
                    <BookHeader />
                </HideOnScroll>

                {/* Book Cover */}
                <div className="w-full aspect-[2/3] relative rounded-2xl overflow-hidden mb-6 bg-gray-100 flex items-center justify-center max-w-[240px] mx-auto">
                    {book.image ? (
                        <Image
                            src={book.image}
                            alt={book.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="text-center p-4">
                            <h2 className="text-4xl font-bold text-gray-300">{book.title.charAt(0)}</h2>
                            <p className="text-gray-400 text-sm">No Image</p>
                        </div>
                    )}
                </div>

                {/* Title & Author */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-brand-black mb-1 leading-tight">{book.title}</h1>
                    <p className="text-brand-gray">{book.author}</p>
                </div>

                {/* Owner Info */}
                <OwnerInfo owner={book.owner} />

                {/* Condition & Description */}
                <div className="py-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-black text-sm">Kategori :</span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-brand-black">
                            {book.category}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-brand-black text-sm">Kondisi Buku :</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                 ${book.condition === 'Baru' ? 'bg-green-100 text-green-700' :
                                book.condition === 'Baik' ? 'bg-green-100 text-green-700' :
                                    'bg-yellow-100 text-yellow-700'
                            }
               `}>
                            {book.condition}
                        </span>
                    </div>

                    {book.exchangeMethods && book.exchangeMethods.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-brand-black text-sm">Metode :</span>
                            <div className="flex flex-wrap gap-1">
                                {book.exchangeMethods.map((method) => (
                                    <span key={method} className="px-3 py-1 rounded-full text-xs font-medium bg-brand-black text-brand-white">
                                        {method}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}



                    <div className="text-sm text-brand-gray leading-relaxed whitespace-pre-line">
                        {book.description}
                    </div>
                </div>
            </div>

            <ActionButtons bookId={book.id} ownerId={book.owner.id} />
        </div>
    );
}
