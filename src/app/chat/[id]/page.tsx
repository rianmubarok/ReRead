"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatInput from "@/components/chat/ChatInput";
import BookContextPanel from "@/components/chat/BookContextPanel";
import { MOCK_CHATS } from "@/data/mockChats";
import { MOCK_BOOKS } from "@/data/mockBooks";

interface Message {
    id: string;
    text: string;
    sender: "me" | "them";
    timestamp: Date;
}

export default function ChatDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const chatId = params?.id as string;
    const bookId = searchParams?.get("bookId");

    // State
    const [user, setUser] = useState<{ name: string; avatar: string; status: string } | null>(null);
    const [book, setBook] = useState<any | null>(null);
    const [showBookContext, setShowBookContext] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initialize data
    useEffect(() => {
        // 1. Try to find existing chat by ID
        const existingChat = MOCK_CHATS.find(c => c.id === chatId);

        if (existingChat) {
            setUser({
                name: existingChat.user.name,
                avatar: existingChat.user.avatar,
                status: "Aktif" // Mock status
            });
            // Mock some existing messages
            setMessages([
                { id: "m1", text: existingChat.lastMessage, sender: "them", timestamp: new Date() }
            ]);
        } else {
            // 2. If no chat, check if we are here for a specific book owner (assuming chatId might be userId if not found in chats)
            // Or if we have a bookId, get owner from there
            if (bookId) {
                const foundBook = MOCK_BOOKS.find(b => b.id === bookId);
                if (foundBook) {
                    setBook(foundBook);
                    setShowBookContext(true);
                    // If we don't have a user yet (not an existing chat), use book owner
                    if (!existingChat) {
                        setUser({
                            name: foundBook.owner.name,
                            avatar: foundBook.owner.avatar,
                            status: "Aktif"
                        });
                    }
                }
            } else {
                // Fallback for demo if id is just a generic user id
                setUser({
                    name: "Nadia Putri",
                    avatar: "google",
                    status: "Aktif"
                });
            }
        }
    }, [chatId, bookId]);

    // Handle sending message
    const handleSendMessage = (text: string) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text,
            sender: "me",
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);

        // Hide book context after sending a message effectively? 
        // Usually it stays until closed or transaction done. I'll leave it unless manually closed.
    };

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!user) return <div className="min-h-screen bg-white" />;

    return (
        <div className="flex flex-col h-screen bg-[#F8F9FA]">
            <ChatDetailHeader
                name={user.name}
                status={user.status}
                avatar={user.avatar}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm">
                        <p>Belum ada pesan.</p>
                        <p>Mulai percakapan dengan {user.name}</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.sender === 'me'
                                    ? 'bg-brand-red text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                                }`}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Book Context Panel (Overlay/Attachment) */}
            {showBookContext && book && (
                <div className="px-0">
                    <BookContextPanel
                        book={book}
                        onClose={() => setShowBookContext(false)}
                        onSendMessage={handleSendMessage}
                    />
                </div>
            )}

            {/* Input Area */}
            <ChatInput onSendMessage={handleSendMessage} />
        </div>
    );
}
