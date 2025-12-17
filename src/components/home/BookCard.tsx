"use client";

import React from "react";
import Image from "next/image";
import { RiMapPinLine } from "@remixicon/react";
import { Book } from "@/types/book";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { haversineDistance, formatDistance } from "@/utils/distance";

interface BookCardProps {
    book: Book;
    variant?: "nearby" | "trending";
    className?: string;
    fullWidth?: boolean;
    actionOverlay?: React.ReactNode;
}

export default function BookCard({ book, variant = "nearby", className, fullWidth = false, actionOverlay }: BookCardProps) {
    const { user } = useAuth();

    // Calculate dynamic distance if coordinates available
    const isOwner = user?.id === book.owner.id;

    // Calculate dynamic distance or show static address
    let displayLocation: string;

    if (isOwner) {
        if (book.owner.address) {
            displayLocation = `${book.owner.address.district}, ${book.owner.address.regency}, ${book.owner.address.province}`;
        } else {
            displayLocation = book.owner.locationLabel || "Lokasi tidak diketahui";
        }
    } else {
        const distanceKm = haversineDistance(user?.coordinates, book.owner.coordinates);
        displayLocation = distanceKm !== null
            ? formatDistance(distanceKm)
            : (book.locationLabel || book.distanceLabel || "Lokasi tidak diketahui");
    }

    return (
        <div className={`flex-shrink-0 flex flex-col gap-3 group cursor-pointer transition-transform ${fullWidth ? "w-full" : "w-36"} ${className || ""}`}>
            {/* Cover Image Container */}
            <div className="relative aspect-[2/3]">
                {/* Main Link Area */}
                <Link href={`/book/${book.id}`} className="absolute inset-0 z-0 block w-full h-full active:scale-95 transition-transform duration-200">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center relative">
                        {book.image ? (
                            <Image
                                src={book.image}
                                alt={book.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 768px) 150px, 200px"
                            />
                        ) : (
                            <div className="p-2 text-center">
                                <span className="text-2xl font-bold text-gray-400 block mb-1">
                                    {book.title.charAt(0)}
                                </span>
                            </div>
                        )}
                    </div>
                </Link>

                {/* Status Overlay */}
                {book.status && book.status !== 'Available' && (
                    <div className="absolute inset-0 bg-brand-black/50 rounded-xl flex items-center justify-center z-10 pointer-events-none">
                        <span className="text-white font-bold text-xs px-3 py-1.5 bg-black/40 rounded-full backdrop-blur-md border border-white/20 whitespace-normal text-center mx-2">
                            {book.status === 'Archived' ? 'Diarsipkan' :
                                book.status === 'Exchanged' ? 'Sudah Ditukar' : book.status}
                        </span>
                    </div>
                )}

                {/* Action Overlay (Outside Link) */}
                {actionOverlay && (
                    <div className="absolute top-2 right-2 z-10">
                        {actionOverlay}
                    </div>
                )}
            </div>

            {/* Info Section */}
            <Link href={`/book/${book.id}`} className="space-y-1 block active:scale-95 transition-transform duration-200">
                <h3 className="font-bold text-brand-black line-clamp-1">
                    {book.title}
                </h3>

                <div className="flex items-start gap-1 text-xs text-brand-gray">
                    <RiMapPinLine className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{displayLocation}</span>
                </div>
            </Link>
        </div>
    );
}
