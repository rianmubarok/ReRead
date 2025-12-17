"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiMore2Fill, RiMapPinLine } from "@remixicon/react";
import BookCard from "@/components/home/BookCard";
import { supabase } from "@/lib/supabase";
import { getBookRepository } from "@/repositories/book.repository";
import { User, Address } from "@/types/user";
import { Book } from "@/types/book";
import { getTransactionRepository } from "@/repositories/transaction.repository";

// Helper to format date
const formatDate = (dateString?: string) => {
    if (!dateString) return "Baru saja";
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"books" | "details">("books");

    // State for Real Data
    const [user, setUser] = useState<User | null>(null);
    const [userBooks, setUserBooks] = useState<Book[]>([]);
    const [exchangeCount, setExchangeCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch User Data
                let fetchedUser: User | null = null;

                if (supabase) {
                    // Try to fetch by 'id' (UUID) or 'uid' (Firebase Text ID)
                    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

                    const query = supabase.from('users').select('*');
                    if (isUuid) {
                        query.eq('id', id);
                    } else {
                        query.eq('uid', id);
                    }

                    const { data, error } = await query.single();

                    if (data && !error) {
                        fetchedUser = {
                            id: data.id,
                            uid: data.uid,
                            name: data.name,
                            email: data.email,
                            avatar: data.avatar,
                            address: data.address,
                            coordinates: data.coordinates,
                            onboardingCompleted: data.onboarding_completed,
                            bio: data.bio, // Ensure User type has bio, otherwise ignore
                            joinDate: data.created_at, // Map created_at
                        } as User;
                    }
                }

                if (fetchedUser) {
                    setUser(fetchedUser);

                    // 2. Fetch User Books
                    const books = await getBookRepository().getBooksByOwner(fetchedUser.id);
                    setUserBooks(books.filter(b => !b.status || b.status === "Available"));

                    // 3. Fetch Exchange Count
                    const tx = await getTransactionRepository().getTransactionsByUserId(fetchedUser.uid);
                    setExchangeCount(tx.length);
                }
            } catch (error) {
                console.error("Failed to fetch profile:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);


    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-brand-gray">Pengguna tidak ditemukan</div>;
    }

    // Format location
    const locationString = user.address
        ? `${user.address.district}, ${user.address.regency}`
        : "Lokasi tidak tersedia";

    return (
        <div className="min-h-screen bg-brand-white pb-24 animate-fade-in relative">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto z-50 px-6 py-4 flex items-center justify-between bg-brand-white/80 backdrop-blur-sm">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors"
                >
                    <RiArrowLeftLine className="w-6 h-6" />
                </button>
                <button className="p-2 -mr-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors">
                    <RiMore2Fill className="w-6 h-6" />
                </button>
            </div>

            <div className="pt-20 px-6">
                {/* Profile Info */}
                <div className="flex flex-col mb-6">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4">
                        {user.avatar ? (
                            <Image
                                src={user.avatar.startsWith('http') ? user.avatar : `/assets/avatar/${user.avatar}`}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-2xl text-gray-400">
                                {user.name.charAt(0)}
                            </div>
                        )}

                    </div>
                    <h1 className="text-xl font-bold text-brand-black mb-1">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
                        <RiMapPinLine className="w-4 h-4" />
                        <span>{locationString}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mb-6">
                        <div>
                            <span className="text-xl font-bold text-brand-black block">{userBooks.length}</span>
                            <span className="text-xs text-gray-500 leading-tight block">Buku<br />Tersedia</span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div>
                            <span className="text-xl font-bold text-brand-black block">{exchangeCount}</span>
                            <span className="text-xs text-gray-500 leading-tight block">Pertukaran<br />Sukses</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-4">
                        <button
                            onClick={() => setActiveTab("books")}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex-1 ${activeTab === "books"
                                ? "bg-brand-red text-white"
                                : "bg-gray-100 text-brand-black hover:bg-gray-200"
                                }`}
                        >
                            Buku yang Diunggah
                        </button>
                        <button
                            onClick={() => setActiveTab("details")}
                            className={`px-6 py-2.5 rounded-full text-sm font-medium transition-colors flex-1 ${activeTab === "details"
                                ? "bg-brand-red text-white"
                                : "bg-gray-100 text-brand-black hover:bg-gray-200"
                                }`}
                        >
                            Detail Profil
                        </button>
                    </div>
                </div>

                {/* Content */}
                {activeTab === "books" ? (
                    <div className="grid grid-cols-2 gap-4 pb-20">
                        {userBooks.map((book) => (
                            <BookCard key={book.id} book={book} fullWidth />
                        ))}
                        {userBooks.length === 0 && (
                            <div className="col-span-2 text-center py-10 text-gray-400">
                                Belum ada buku yang diunggah.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm py-4 space-y-4">
                        <div>
                            <p className="leading-relaxed">{(user as any).bio || "Pengguna ini belum menambahkan bio."}</p>
                        </div>
                        <div className="h-[1px] bg-gray-100 my-2" />
                        <div>
                            <p>Bergabung Sejak {formatDate((user as any).joinDate)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pb-8 max-w-md mx-auto pointer-events-none">
                <div className="pointer-events-auto">
                    <button
                        onClick={() => router.push(`/chat/${user.uid}`)}
                        className="w-full bg-brand-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                    >
                        Kirim Pesan
                    </button>
                </div>
            </div>
        </div>
    );
}
