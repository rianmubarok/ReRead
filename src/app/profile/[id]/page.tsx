"use client";

import React, { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiMore2Fill, RiMapPinLine } from "@remixicon/react";
import { MOCK_USERS } from "@/data/mockUsers";
import { MOCK_BOOKS } from "@/data/mockBooks";
import BookCard from "@/components/home/BookCard";

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"books" | "details">("books");

    const user = MOCK_USERS.find(u => u.id === id);
    const userBooks = MOCK_BOOKS.filter(b => b.owner.id === id);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">User not found</div>;
    }

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
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#F5E6CA] mb-4">
                        <Image
                            src={`/assets/avatar/${user.avatar}`}
                            alt={user.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <h1 className="text-xl font-bold text-brand-black mb-1">{user.name}</h1>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mb-6">
                        <RiMapPinLine className="w-4 h-4" />
                        <span>{user.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-8 mb-6">
                        <div>
                            <span className="text-xl font-bold text-brand-black block">{userBooks.length}</span>
                            <span className="text-xs text-gray-500 leading-tight block">Buku<br />Tersedia</span>
                        </div>
                        <div className="w-[1px] h-8 bg-gray-200"></div>
                        <div>
                            <span className="text-xl font-bold text-brand-black block">5</span>
                            <span className="text-xs text-gray-500 leading-tight block">Pertukaran<br />Sukses</span>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-6">
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
                            <p className="leading-relaxed">{user.bio || "Pengguna ini belum menambahkan bio."}</p>
                        </div>
                        <div className="h-[1px] bg-gray-100 my-2" />
                        <div>
                            <p>Bergabung Sejak {user.joinDate}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pb-8 max-w-md mx-auto">
                <button
                    onClick={() => router.push(`/chat?userId=${user.id}`)}
                    className="w-full bg-brand-black text-white py-4 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
                >
                    Kirim Pesan
                </button>
            </div>
        </div>
    );
}
