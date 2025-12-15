"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    RiArrowLeftLine,
    RiExchangeDollarLine,
    RiCheckDoubleLine
} from "@remixicon/react";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { MOCK_USERS } from "@/data/mockUsers";

// Mock history data since we don't have a backend yet
const MOCK_HISTORY = [
    {
        id: "h1",
        date: "12 Des 2025",
        status: "Selesai",
        type: "Barter",
        book: MOCK_BOOKS[0], // Sapiens
        partner: MOCK_USERS[1], // Jiddan
        note: "Bertemu di Alun-alun Jepara"
    },
    {
        id: "h2",
        date: "10 Nov 2025",
        status: "Selesai",
        type: "Beli",
        price: 50000,
        book: MOCK_BOOKS[5], // Madilog
        partner: MOCK_USERS[2], // Arvel
        note: "COD di Indomaret Tahunan"
    },
    {
        id: "h3",
        date: "25 Okt 2025",
        status: "Selesai",
        type: "Barter",
        book: MOCK_BOOKS[8], // Filosofi Teras
        partner: MOCK_USERS[4], // Dilla
        note: "Tukar dengan buku Novel"
    }
];

export default function StatsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-brand-white pb-24 animate-fade-in">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-brand-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="px-6 py-4 pt-8 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <RiArrowLeftLine className="w-6 h-6 text-brand-black" />
                    </button>
                    <h1 className="text-lg font-bold text-brand-black">Riwayat Pertukaran</h1>
                </div>
            </div>

            <div className="px-6 py-6">

                {/* Stats Summary Card */}
                <div className="bg-brand-black text-white rounded-2xl p-6 mb-8 shadow-lg shadow-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <RiExchangeDollarLine className="w-6 h-6" />
                        </div>
                        <span className="font-medium text-white/80">Total Pertukaran</span>
                    </div>

                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold">{MOCK_HISTORY.length}</span>
                        <span className="text-sm text-white/60 mb-1.5">buku berhasil ditukar/dijual</span>
                    </div>
                </div>

                {/* History List */}
                <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2">
                    <RiCheckDoubleLine className="w-5 h-5 text-green-600" />
                    Selesai
                </h3>

                <div className="space-y-4">
                    {MOCK_HISTORY.map((item) => (
                        <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                            {/* Book Image */}
                            <div className="relative w-16 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                                {item.book.image ? (
                                    <Image
                                        src={item.book.image}
                                        alt={item.book.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                        {item.book.title.charAt(0)}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-brand-black line-clamp-1">{item.book.title}</h4>
                                    <span className="text-xs text-brand-gray whitespace-nowrap">{item.date}</span>
                                </div>

                                <p className="text-xs text-brand-gray mb-2">
                                    {item.type === "Beli" ? "Dijual ke" : "Dibarter dengan"} <span className="text-brand-black font-medium">{item.partner.name}</span>
                                </p>

                                <div className="flex items-center gap-2 mt-2">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                                        ${item.type === 'Barter' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
                                    `}>
                                        {item.type}
                                    </span>
                                    {item.price && (
                                        <span className="text-xs font-bold text-brand-black">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>

                                {item.note && (
                                    <p className="text-xs text-gray-400 mt-2 italic line-clamp-1">
                                        "{item.note}"
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
