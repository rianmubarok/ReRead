"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Book } from "@/types/book";
import { RiArrowRightSLine } from "@remixicon/react";

interface ChatBookCardProps {
  book: Book;
}

export default function ChatBookCard({ book }: ChatBookCardProps) {
  const router = useRouter();

  return (
    <div className="w-full bg-white rounded-3xl p-4 shadow-sm mb-6 flex gap-4 items-start">
      {/* Book Cover */}
      <div className="relative w-24 aspect-[2/3] rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={book.image || "/assets/books/placeholder.png"}
          alt={book.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            (
              e.target as HTMLImageElement
            ).src = `https://placehold.co/96x144/e0e0e0/333333?text=${book.title.charAt(
              0
            )}`;
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 py-1">
        <h3 className="font-bold text-lg text-brand-black leading-tight mb-1">
          {book.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-1">{book.author}</p>

        <button
          onClick={() => router.push(`/book/${book.id}`)}
          className="flex items-center text-brand-black font-medium text-sm hover:underline group"
        >
          Lihat Buku
          <RiArrowRightSLine className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
