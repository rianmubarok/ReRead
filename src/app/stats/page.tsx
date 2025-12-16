"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  RiArrowLeftLine,
  RiExchangeDollarLine,
  RiCheckDoubleLine,
} from "@remixicon/react";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { MOCK_USERS } from "@/data/mockUsers";
import {
  getExchangeHistory,
  ExchangeHistoryItem,
} from "@/storage/exchange.storage";

interface HistoryWithRelations extends ExchangeHistoryItem {
  bookTitle: string;
  bookImage: string;
  partnerName: string;
}

export default function StatsPage() {
  const router = useRouter();
  const [items, setItems] = useState<HistoryWithRelations[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const raw = getExchangeHistory();

    const mapped: HistoryWithRelations[] = raw
      .map((item) => {
        const book = MOCK_BOOKS.find((b) => b.id === item.bookId);
        const partner = MOCK_USERS.find((u) => u.id === item.partnerId);
        if (!book || !partner) return null;

        return {
          ...item,
          bookTitle: book.title,
          bookImage: book.image,
          partnerName: partner.name,
        };
      })
      .filter((v): v is HistoryWithRelations => v !== null)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setItems(mapped);
  }, []);

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
          <h1 className="text-lg font-bold text-brand-black">
            Riwayat Pertukaran
          </h1>
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
            <span className="text-4xl font-bold">{items.length}</span>
            <span className="text-sm text-white/60 mb-1.5">
              buku berhasil ditukar/dijual
            </span>
          </div>
        </div>

        {/* History List */}
        <h3 className="font-bold text-brand-black mb-4 flex items-center gap-2">
          <RiCheckDoubleLine className="w-5 h-5 text-green-600" />
          Selesai
        </h3>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
            Belum ada riwayat pertukaran.
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setExpandedId((prev) => (prev === item.id ? null : item.id))
                }
                className="w-full text-left bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 hover:border-gray-200 active:scale-[0.99] transition"
              >
                {/* Book Image */}
                <div className="relative w-16 h-24 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                  {item.bookImage ? (
                    <Image
                      src={item.bookImage}
                      alt={item.bookTitle}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                      {item.bookTitle.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-brand-black line-clamp-1">
                      {item.bookTitle}
                    </h4>
                    <span className="text-xs text-brand-gray whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-brand-gray mb-2">
                    Buku dari{" "}
                    <span className="text-brand-black font-medium">
                      {item.partnerName}
                    </span>
                  </p>

                  {expandedId === item.id && (
                    <div className="mt-2 space-y-1 text-xs text-brand-gray">
                      <p>
                        <span className="font-semibold text-brand-black">
                          Buku:
                        </span>{" "}
                        {item.bookTitle}
                      </p>
                      <p>
                        <span className="font-semibold text-brand-black">
                          Pihak pemilik buku:
                        </span>{" "}
                        {item.partnerName}
                      </p>
                      {item.note && (
                        <p>
                          <span className="font-semibold text-brand-black">
                            Catatan:
                          </span>{" "}
                          {item.note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
