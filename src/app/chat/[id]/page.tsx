"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatInput from "@/components/chat/ChatInput";
import BookContextPanel from "@/components/chat/BookContextPanel";
import ChatBookCard from "@/components/chat/ChatBookCard";
import { MOCK_CHATS } from "@/data/mockChats";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { useNav } from "@/context/NavContext";
import { chatService, ChatMessage } from "@/services/chat.service";
import { useChatStore } from "@/stores/chat.store";
import { Book } from "@/data/mockBooks";

export default function ChatDetailPage() {
    const { setVisible } = useNav();
    const params = useParams();
    const searchParams = useSearchParams();
    const chatId = params?.id as string;
    const bookId = searchParams?.get("bookId");

    // State
    const [user, setUser] = useState<{ name: string; avatar: string; status: string } | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [showBookContext, setShowBookContext] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatStore = useChatStore();

    // Hide bottom nav on mount, show on unmount
    useEffect(() => {
        setVisible(false);
        return () => setVisible(true);
    }, [setVisible]);

    // Initialize data and load messages
    useEffect(() => {
        const initializeChat = async () => {
            setIsLoading(true);
            
            // 1. Try to find existing chat by ID
            const existingChat = MOCK_CHATS.find(c => c.id === chatId);

            if (existingChat) {
                setUser({
                    name: existingChat.user.name,
                    avatar: existingChat.user.avatar,
                    status: "Aktif"
                });
            }

            // 2. Check for book context if bookId is present
            if (bookId) {
                const foundBook = MOCK_BOOKS.find(b => b.id === bookId);
                if (foundBook) {
                    setBook(foundBook);
                    setShowBookContext(true);
                    // If we didn't find an existing chat, set the user from the book owner
                    if (!existingChat) {
                        setUser({
                            name: foundBook.owner.name,
                            avatar: foundBook.owner.avatar,
                            status: "Aktif"
                        });
                    }
                }
            } else if (!existingChat) {
                // Fallback for demo if id is just a generic user id and no book context
                setUser({
                    name: "Nadia Putri",
                    avatar: "google",
                    status: "Aktif"
                });
            }

            // 3. Load messages from chat service/store
            try {
                const loadedMessages = await chatService.getMessages(chatId);
                
                // If no messages exist but there's a last message in the chat, add it to store
                if (loadedMessages.length === 0 && existingChat?.lastMessage) {
                    const initialMessage: ChatMessage = {
                        id: `init-${Date.now()}`,
                        text: existingChat.lastMessage,
                        sender: "them",
                        timestamp: new Date(existingChat.timestamp)
                    };
                    // Add to store so it's consistent
                    chatStore.addMessage(chatId, initialMessage);
                    setMessages([initialMessage]);
                } else {
                    setMessages(loadedMessages);
                }
            } catch (error) {
                console.error("Error loading messages:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (chatId) {
            initializeChat();
        }
    }, [chatId, bookId]);

    // Subscribe to chat store changes for real-time updates
    useEffect(() => {
        if (!chatId) return;
        
        const storeMessages = chatStore.getMessages(chatId);
        // Always sync with store to avoid duplicates
        // Deduplicate by ID and sort by timestamp
        const uniqueMessages = Array.from(
            new Map(storeMessages.map(msg => [msg.id, msg])).values()
        ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        // Only update if messages actually changed to avoid unnecessary re-renders
        setMessages(prev => {
            const prevIds = new Set(prev.map(m => m.id));
            const newIds = new Set(uniqueMessages.map(m => m.id));
            
            // Check if messages actually changed
            if (prev.length === uniqueMessages.length && 
                prev.every(m => newIds.has(m.id)) &&
                uniqueMessages.every(m => prevIds.has(m.id))) {
                return prev; // No change, return previous to avoid re-render
            }
            
            return uniqueMessages;
        });
    }, [chatId, chatStore.messages]);

    // Handle sending message
    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !chatId) return;

        try {
            // Send message with bookId if book context exists
            // The message will be added to store by chatService, and useEffect will update local state
            await chatService.sendMessage(
                chatId,
                text,
                book?.id
            );
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    if (!user || isLoading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
                <div className="text-gray-400 text-sm">Memuat...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-[#F8F9FA]">
            <ChatDetailHeader
                name={user.name}
                status={user.status}
                avatar={user.avatar}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-1 min-h-[200px]">
                        <p>Belum ada pesan.</p>
                        <p>Mulai percakapan dengan {user.name}</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const messageBook = msg.bookId ? MOCK_BOOKS.find(b => b.id === msg.bookId) : null;
                    
                    return (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                        >
                            {msg.sender === 'them' && (
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img
                                        src={user.avatar === 'google' ? '/assets/avatars/google-avatar.png' : user.avatar || '/assets/avatars/default.png'}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=random';
                                        }}
                                    />
                                </div>
                            )}
                            <div className={`max-w-[75%] ${msg.sender === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1.5`}>
                                {messageBook && (
                                    <div className={`w-full ${msg.sender === 'me' ? 'bg-white/95' : 'bg-gray-50'} rounded-xl p-3 border ${msg.sender === 'me' ? 'border-gray-200' : 'border-gray-200'} shadow-sm`}>
                                        <div className="flex gap-2.5">
                                            <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                                                <img
                                                    src={messageBook.image || "/assets/books/placeholder.png"}
                                                    alt={messageBook.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `https://placehold.co/48x64/e0e0e0/333333?text=${messageBook.title.charAt(0)}`;
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-900 truncate mb-0.5">{messageBook.title}</h4>
                                                <p className="text-xs text-gray-500 truncate">{messageBook.author}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div
                                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                                        msg.sender === 'me'
                                            ? 'bg-brand-red text-white rounded-br-sm'
                                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm shadow-sm'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                            {msg.sender === 'me' && (
                                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    <img
                                        src="/assets/avatars/default.png"
                                        alt="You"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=You&background=random';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Book Context Panel (Fixed at bottom, above input) */}
            {showBookContext && book && (
                <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none">
                    <div className="max-w-md mx-auto pointer-events-auto">
                        <BookContextPanel
                            book={book}
                            onClose={() => setShowBookContext(false)}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="relative z-30">
                <ChatInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
}
