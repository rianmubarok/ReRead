"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { RiArrowLeftLine, RiCheckLine, RiBookOpenLine, RiSearchLine } from "@remixicon/react";
import Image from "next/image";
import { MOCK_BOOKS, Book } from "@/data/mockBooks";
import { MOCK_CHATS } from "@/data/mockChats";
import { useAuth } from "@/context/AuthContext";
import { chatService } from "@/services/chat.service";
import toast from "react-hot-toast";
import { ChatMessage } from "@/types/chat";
import { useChatStore } from "@/stores/chat.store";

export default function CompleteExchangePage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useAuth();
    const chatId = params?.id as string;

    // Find the current chat to identify the partner
    const currentChat = MOCK_CHATS.find(c => c.id === chatId);
    const partnerId = currentChat?.user.id; // The user in the chat object is the partner

    const [selectedBookId, setSelectedBookId] = useState<string>("");
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const chatStore = useChatStore();

    // Filter books:
    // 1. Must be owned by the chat partner (the 'opponent' in chat)
    // 2. Must match search query
    const availableBooks = MOCK_BOOKS.filter(book => {
        const matchesOwner = partnerId ? book.owner.id === partnerId : true;
        const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesOwner && matchesSearch;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBookId) {
            toast.error("Silakan pilih buku yang ingin diselesaikan.");
            return;
        }

        if (!user) return;

        setIsLoading(true);

        const selectedBook = availableBooks.find(b => b.id === selectedBookId);

        if (selectedBook) {
            const newMessage: ChatMessage = {
                id: `msg-${Date.now()}`,
                text: note,
                senderId: user.id,
                timestamp: new Date(),
                messageType: 'exchange_request',
                exchangeRequest: {
                    bookId: selectedBook.id,
                    bookTitle: selectedBook.title,
                    bookImage: selectedBook.image || "",
                    status: 'pending'
                }
            };

            chatStore.addMessage(chatId, newMessage);

            await new Promise(resolve => setTimeout(resolve, 500));

            toast.success("Pengajuan berhasil dikirim!");
            router.back();
        } else {
            setIsLoading(false);
            toast.error("Buku tidak ditemukan.");
        }
    };

    return (
        <div className="min-h-screen bg-brand-white pb-32">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 z-50">
                <div className="flex items-center gap-4 py-6 pt-8 border-b border-gray-100">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <RiArrowLeftLine className="w-6 h-6" />
                    </button>
                    <div className="flex-1 font-bold text-lg text-brand-black">
                        Selesaikan Pertukaran
                    </div>
                </div>
            </div>

            <div className="pt-24 px-6 max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Book Selection */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-brand-black flex items-center gap-2">
                            <RiBookOpenLine className="w-4 h-4" />
                            Pilih Buku
                        </label>

                        {/* Search Input */}
                        <div className="relative">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul buku..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-brand-black placeholder:text-gray-400"
                            />
                        </div>

                        {/* Book List with hidden scrollbar */}
                        <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                            {availableBooks.length === 0 ? (
                                <div className="text-center py-12 text-gray-400 text-sm bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    <p className="font-medium">Tidak ada buku ditemukan</p>
                                    <p className="text-xs mt-1 opacity-70">Coba kata kunci lain atau pastikan lawan chat memiliki buku.</p>
                                </div>
                            ) : (
                                availableBooks.map((book) => (
                                    <div
                                        key={book.id}
                                        onClick={() => setSelectedBookId(book.id)}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selectedBookId === book.id
                                                ? "border-brand-black bg-gray-50 ring-1 ring-brand-black shadow-sm"
                                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                                            }`}
                                    >
                                        <div className="relative w-16 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                                            {book.image ? (
                                                <Image
                                                    src={book.image}
                                                    alt={book.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-gray-100">
                                                    {book.title.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-brand-black line-clamp-2 leading-tight mb-1 from-neutral-800">{book.title}</h4>
                                            <p className="text-sm text-gray-500 mb-1">{book.author}</p>
                                            <p className="text-xs text-brand-black/60 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                                {book.owner.name}
                                            </p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${selectedBookId === book.id
                                                ? "bg-brand-black border-brand-black text-white"
                                                : "border-gray-300 bg-white"
                                            }`}>
                                            {selectedBookId === book.id && <RiCheckLine className="w-4 h-4" />}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Note Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Catatan (Opsional)</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Tambahkan catatan untuk penerima..."
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none min-h-[100px]"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading || !selectedBookId}
                            className={`w-full bg-brand-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-lg shadow-brand-black/10
                                ${isLoading || !selectedBookId ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
                        >
                            {isLoading ? "Mengirim..." : "Ajukan Selesai"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
