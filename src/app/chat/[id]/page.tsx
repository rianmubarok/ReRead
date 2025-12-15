"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatInput from "@/components/chat/ChatInput";
import BookContextPanel from "@/components/chat/BookContextPanel";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatBookCard from "@/components/chat/ChatBookCard";
import { MOCK_CHATS } from "@/data/mockChats";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { useNav } from "@/context/NavContext";
import { chatService } from "@/services/chat.service";
import { ChatMessage } from "@/types/chat";
import { useChatStore } from "@/stores/chat.store";
import { Book } from "@/data/mockBooks";
import { parseMockDate, formatChatDate } from "@/utils/dateUtils";
import { useAuth } from "@/context/AuthContext";

export default function ChatDetailPage() {
    const { setVisible } = useNav();
    const { user: currentUser } = useAuth();
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

                if (chatId === "chat1") {
                    // Removed debug clearing logic that was causing data loss
                }
            }

            // 2. Check for book context if bookId is present
            if (bookId) {
                const foundBook = MOCK_BOOKS.find(b => b.id === bookId);
                if (foundBook) {
                    setBook(foundBook);
                    setShowBookContext(!existingChat);
                    if (!existingChat) {
                        setUser({
                            name: foundBook.owner.name,
                            avatar: foundBook.owner.avatar,
                            status: "Aktif"
                        });
                    }
                }
            } else if (!existingChat) {
                setUser({
                    name: "Nadia Putri",
                    avatar: "google",
                    status: "Aktif"
                });
            }

            // 3. Load messages from chat service/store
            try {
                const loadedMessages = await chatService.getMessages(chatId);
                let finalMessages = [...loadedMessages];

                // If we have an existing chat (mock), ensure its history is present
                if (existingChat) {
                    const storeIds = new Set(loadedMessages.map(m => m.id));
                    let mockMessages: ChatMessage[] = [];

                    if (existingChat.messages && existingChat.messages.length > 0) {
                        mockMessages = existingChat.messages.map((m, index) => ({
                            id: m.id,
                            text: m.text,
                            senderId: m.senderId === "me" ? (currentUser?.id || "me") : existingChat.user.id,
                            timestamp: parseMockDate(m.timestamp),
                            bookId: index === 0 ? existingChat.bookContext?.id : undefined,
                            isRead: m.isRead,
                        }));
                    } else if (existingChat.lastMessage) {
                        mockMessages = [{
                            id: `init-${Date.now()}`,
                            text: existingChat.lastMessage,
                            senderId: existingChat.user.id,
                            timestamp: parseMockDate(existingChat.timestamp),
                            isRead: false,
                        }];
                    }

                    // Identify missing mock messages
                    const missingMocks = mockMessages.filter(m => !storeIds.has(m.id));

                    if (missingMocks.length > 0) {
                        // We have missing history. We need to merge and re-populate the store to maintain order.
                        // Order: Mock History -> Loaded Messages (new ones)
                        // Note: timestamps should assume order, but let's be explicit
                        finalMessages = [...missingMocks, ...loadedMessages].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

                        // Update store with complete history
                        chatStore.clearMessages(chatId);
                        finalMessages.forEach(msg => chatStore.addMessage(chatId, msg));
                    }
                }

                setMessages(finalMessages);
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
        const uniqueMessages = Array.from(
            new Map(storeMessages.map(msg => [msg.id, msg])).values()
        ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        setMessages(prev => {
            const prevIds = new Set(prev.map(m => m.id));
            const newIds = new Set(uniqueMessages.map(m => m.id));

            if (prev.length === uniqueMessages.length &&
                prev.every(m => newIds.has(m.id)) &&
                uniqueMessages.every(m => prevIds.has(m.id))) {
                return prev;
            }

            return uniqueMessages;
        });
    }, [chatId, chatStore.messages]);

    // Handle sending message
    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !chatId || !currentUser?.id) return;

        try {
            await chatService.sendMessage(
                chatId,
                text,
                currentUser.id,
                showBookContext ? book?.id : undefined
            );
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleConfirmExchange = (action: string, messageId: string) => {
        if (action === 'confirm_exchange' || action === 'cancel_exchange') {
            const msg = messages.find(m => m.id === messageId);
            if (msg && msg.exchangeRequest) {
                const newStatus = action === 'confirm_exchange' ? 'completed' : 'cancelled';

                const updatedMsg = {
                    ...msg,
                    exchangeRequest: {
                        ...msg.exchangeRequest,
                        status: newStatus as "completed" | "cancelled" | "pending"
                    }
                };

                setMessages(prev => prev.map(m => m.id === messageId ? updatedMsg : m));

                if (action === 'confirm_exchange') {
                    handleSendMessage(`Pertukaran "${msg.exchangeRequest?.bookTitle}" telah selesai! 🎉`);
                } else {
                    // Optional: maybe send a system message saying it was cancelled? 
                    // For now just update status is enough.
                }
            }
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
                hasPendingExchange={messages.some(m =>
                    m.messageType === 'exchange_request' &&
                    m.exchangeRequest?.status === 'pending'
                )}
            />

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col [&::-webkit-scrollbar]:hidden">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-1 min-h-[200px]">
                        <p>Belum ada pesan.</p>
                        <p>Mulai percakapan dengan {user.name}</p>
                    </div>
                ) : (
                    <div className="mt-auto space-y-3 pb-4">
                        {(() => {
                            let lastDate = "";
                            return messages.map((msg, index) => {
                                const messageDate = formatChatDate(msg.timestamp);
                                const showDate = messageDate !== lastDate;
                                lastDate = messageDate;

                                return (
                                    <React.Fragment key={msg.id}>
                                        {showDate && (
                                            <div className="flex justify-center my-4 sticky top-2 z-10">
                                                <span className="bg-gray-100/80 backdrop-blur-sm text-gray-500 text-xs px-3 py-1 rounded-full">
                                                    {messageDate}
                                                </span>
                                            </div>
                                        )}
                                        <MessageBubble
                                            message={msg}
                                            user={user}
                                            currentUserId={currentUser?.id || "me"}
                                            onAction={handleConfirmExchange}
                                        />
                                    </React.Fragment>
                                );
                            });
                        })()}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Section: Context Panel + Input */}
            <div className="z-30 bg-[#F8F9FA]">
                {showBookContext && book && (
                    <div>
                        <BookContextPanel
                            book={book}
                            onClose={() => setShowBookContext(false)}
                            onSendMessage={handleSendMessage}
                        />
                    </div>
                )}
                <div className="bg-[#F8F9FA]">
                    <ChatInput onSendMessage={handleSendMessage} />
                </div>
            </div>
        </div>
    );
}
