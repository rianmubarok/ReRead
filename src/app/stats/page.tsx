"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  RiArrowLeftLine,
  RiExchangeDollarLine,
  RiCheckDoubleLine,
} from "@remixicon/react";
import { useAuth } from "@/context/AuthContext";
import { getTransactionRepository, ExchangeTransaction } from "@/repositories/transaction.repository";
import { getBookRepository } from "@/repositories/book.repository";
import { supabase } from "@/lib/supabase";

interface HistoryWithRelations extends ExchangeTransaction {
  bookTitle: string;
  bookImage?: string;
  partnerName: string;
  note?: string; // Add note if transaction has it, though current SQL doesn't store note prominently yet.
}

export default function StatsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryWithRelations[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const transactions = await getTransactionRepository().getTransactionsByUserId(user.uid);

        // Enrich data
        const enriched = await Promise.all(transactions.map(async (t) => {
          // 1. Get Book
          const book = await getBookRepository().getBookById(t.bookId);

          // 2. Get Partner
          const partnerId = t.requesterId === user.uid ? t.responderId : t.requesterId;

          // Fetch simple name
          let partnerName = "Pengguna";
          if (supabase) {
            const { data: u } = await supabase.from('users').select('name').eq('uid', partnerId).single();
            if (u) partnerName = u.name;
          }

          return {
            ...t,
            bookTitle: book?.title || "Buku Tidak Dikenal",
            bookImage: book?.image,
            partnerName: partnerName,
          } as HistoryWithRelations;
        }));

        setItems(enriched);
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchHistory();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
      </div>
    );
  }

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
                className="w-full text-left bg-white p-4 rounded-xl border border-gray-100 flex gap-4 hover:border-gray-200 active:scale-[0.99] transition"
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
                    {user?.uid === item.requesterId ? "Ditukar dengan " : "Buku dari "}
                    <span className="text-brand-black font-medium">
                      {item.partnerName}
                    </span>
                  </p>

                  {expandedId === item.id && (
                    <div className="mt-2 space-y-1 text-xs text-brand-gray animate-fade-in">
                      <p>
                        <span className="font-semibold text-brand-black">
                          ID Transaksi:
                        </span>{" "}
                        {item.id.slice(0, 8)}...
                      </p>
                      <p>
                        <span className="font-semibold text-brand-black">
                          Status:
                        </span>{" "}
                        <span className="capitalize">{item.status}</span>
                      </p>

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
