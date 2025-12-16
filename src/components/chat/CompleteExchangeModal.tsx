"use client";

import React, { useState } from "react";
import Image from "next/image";
import { RiCloseLine, RiCheckLine } from "@remixicon/react";
import { Book } from "@/types/book";

interface CompleteExchangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (book: Book, note: string) => void;
    availableBooks: Book[];
}

export default function CompleteExchangeModal({
    isOpen,
    onClose,
    onSubmit,
    availableBooks
}: CompleteExchangeModalProps) {
    const [selectedBookId, setSelectedBookId] = useState<string>("");
    const [note, setNote] = useState("");

    if (!isOpen) return null;

    const selectedBook = availableBooks.find(b => b.id === selectedBookId);

    const handleSubmit = () => {
        if (selectedBook) {
            onSubmit(selectedBook, note);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-scale-up">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-lg text-brand-black">Selesaikan Pertukaran</h3>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <RiCloseLine className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Book Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-brand-black">Pilih Buku</label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                            {availableBooks.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => setSelectedBookId(book.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedBookId === book.id
                                            ? "border-brand-black bg-gray-50 ring-1 ring-brand-black"
                                            : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="relative w-12 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                        {book.image ? (
                                            <Image
                                                src={book.image}
                                                alt={book.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                                {book.title.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-brand-black line-clamp-1">{book.title}</h4>
                                        <p className="text-xs text-gray-500">{book.author}</p>
                                    </div>
                                    {selectedBookId === book.id && (
                                        <div className="w-6 h-6 bg-brand-black rounded-full flex items-center justify-center text-white">
                                            <RiCheckLine className="w-4 h-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-brand-black">Catatan (Opsional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tambahkan catatan, misalnya: Buku sudah diterima dengan baik..."
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-black/20 focus:border-brand-black text-sm min-h-[80px]"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedBookId}
                        className="px-4 py-2.5 text-sm font-bold text-white bg-brand-black rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-black/20"
                    >
                        Ajukan Selesai
                    </button>
                </div>
            </div>
        </div>
    );
}
