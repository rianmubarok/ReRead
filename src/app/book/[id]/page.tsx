"use client";

import React, { use, useEffect } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import BookHeader from "@/components/book/BookHeader";
import OwnerInfo from "@/components/book/OwnerInfo";
import ActionButtons from "@/components/book/ActionButtons";
import { useNav } from "@/context/NavContext";
import HideOnScroll from "@/components/ui/HideOnScroll";
import { useAuth } from "@/context/AuthContext";
import { getBookRepository } from "@/repositories/book.repository";
import { Book } from "@/types/book";

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { setVisible } = useNav();
    const { user } = useAuth();

    // State for book data
    const [book, setBook] = React.useState<Book | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    useEffect(() => {
        setVisible(false);
        return () => setVisible(true);
    }, [setVisible]);

    // Fetch book data
    useEffect(() => {
        const fetchBook = async () => {
            setIsLoading(true);
            try {
                const data = await getBookRepository().getBookById(id);
                setBook(data);
            } catch (error) {
                console.error("Failed to fetch book:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id]);


    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!book) {
        notFound();
    }

    const isOwner = user?.id === book.owner.id;

    return (
        <div className="min-h-screen bg-brand-white pb-32 animate-fade-in">
            <div className="px-6 relative">
                <HideOnScroll>
                    <BookHeader isOwner={isOwner} bookId={book.id} />
                </HideOnScroll>

                {/* Book Cover */}
                <div className="w-full aspect-[2/3] relative rounded-2xl overflow-hidden mb-6 bg-gray-100 flex items-center justify-center max-w-[240px] mx-auto mt-4">
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

                    {/* Status Badge if Archived */}
                    {book.status === 'Archived' && (
                        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Diarsipkan
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

            <ActionButtons bookId={book.id} ownerUid={book.owner.uid} />
        </div>
    );
}
