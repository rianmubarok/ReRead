"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiBookmarkLine, RiBookmarkFill } from "@remixicon/react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { getBookRepository } from "@/repositories/book.repository";

interface BookHeaderProps {
    isOwner?: boolean;
    bookId?: string;
}

export default function BookHeader({ isOwner, bookId }: BookHeaderProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const checkBookmark = async () => {
            if (user?.uid && bookId) {
                try {
                    const status = await getBookRepository().isBookmarked(bookId, user.uid);
                    setIsBookmarked(status);
                } catch (e) {
                    console.error("Failed to check bookmark status", e);
                }
            }
        };
        checkBookmark();
    }, [user, bookId]);

    const handleToggleBookmark = async () => {
        if (!user) {
            toast.error("Silakan login untuk menyimpan buku");
            return;
        }
        if (!bookId) return;

        // Optimistic update
        const previousState = isBookmarked;
        const newState = !isBookmarked;
        setIsBookmarked(newState);

        try {
            // Using user.uid consistent with repository implementation
            await getBookRepository().toggleBookmark(bookId, user.uid);

            if (newState) {
                toast.success("Buku berhasil disimpan");
            } else {
                toast.success("Buku dihapus dari simpanan");
            }
        } catch (error) {
            setIsBookmarked(previousState);
            toast.error("Gagal mengubah status simpanan");
            console.error(error);
        }
    };

    return (
        <div className="flex justify-between items-center py-4 pt-6 bg-brand-white">
            <button
                onClick={() => router.back()}
                className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors"
            >
                <RiArrowLeftLine className="w-6 h-6" />
            </button>

            {!isOwner && (
                <button
                    onClick={handleToggleBookmark}
                    disabled={isLoading}
                    className={`p-2 -mr-2 rounded-full transition-colors ${isBookmarked ? 'text-brand-red' : 'text-brand-red hover:bg-red-50'}`}
                >
                    {isBookmarked ? (
                        <RiBookmarkFill className="w-6 h-6" />
                    ) : (
                        <RiBookmarkLine className="w-6 h-6" />
                    )}
                </button>
            )}
        </div>
    );
}
