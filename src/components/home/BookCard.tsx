"use client";

import React from "react";
import Image from "next/image";
import { RiMapPinLine } from "@remixicon/react";
import { Book } from "@/data/mockBooks";
import Link from "next/link";

interface BookCardProps {
    book: Book;
    variant?: "nearby" | "trending";
}

export default function BookCard({ book, variant = "nearby" }: BookCardProps) {
    return (
        <Link
            href={`/book/${book.id}`}
            className="flex-shrink-0 flex flex-col gap-3 group cursor-pointer active:scale-95 transition-transform w-36"
        >
            {/* Cover Image */}
            <div className="relative rounded-xl overflow-hidden shadow-sm aspect-[2/3] bg-gray-200 flex items-center justify-center">
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

            {/* Info */}
            <div className="space-y-1">
                <h3 className="font-bold text-brand-black line-clamp-1">
                    {book.title}
                </h3>

                {variant === "nearby" && book.location ? (
                    <div className="flex items-start gap-1 text-xs text-brand-gray">
                        <RiMapPinLine className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{book.location}</span>
                    </div>
                ) : (
                    <p className="text-xs text-brand-gray line-clamp-1">{book.author}</p>
                )}
            </div>
        </Link>
    );
}
