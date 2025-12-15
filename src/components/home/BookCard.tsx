"use client";

import React from "react";
import Image from "next/image";
import { RiMapPinLine } from "@remixicon/react";
import { Book } from "@/data/mockBooks";
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
            displayLocation = book.owner.location;
        }
    } else {
        const distanceKm = haversineDistance(user?.coordinates, book.owner.coordinates);
        displayLocation = distanceKm !== null
            ? formatDistance(distanceKm)
            : (book.location || book.distance || "Lokasi tidak diketahui");
    }

    return (
        <Link
            href={`/book/${book.id}`}
            className={`flex-shrink-0 flex flex-col gap-3 group cursor-pointer active:scale-95 transition-transform ${fullWidth ? "w-full" : "w-36"} ${className || ""}`}
        >
            {/* Cover Image */}
            {/* Cover Image */}
            <div className="relative aspect-[2/3]">
                <div className="absolute inset-0 rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center">
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

                {/* Action Overlay */}
                {actionOverlay && (
                    <div
                        className="absolute top-2 right-2 z-10"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {actionOverlay}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="space-y-1">
                <h3 className="font-bold text-brand-black line-clamp-1">
                    {book.title}
                </h3>

                <div className="flex items-start gap-1 text-xs text-brand-gray">
                    <RiMapPinLine className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{displayLocation}</span>
                </div>
            </div>
        </Link>
    );
}
