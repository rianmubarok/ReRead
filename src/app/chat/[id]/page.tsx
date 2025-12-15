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

                // FORCE UPDATE/RESET for Dev/Demo:
                // If this is chat1 (Nadia), force clear store to pick up new mock changes
                // regarding unread messages.
                if (chatId === "chat1") {
                    chatStore.clearMessages(chatId);
                    setMessages([]); // Clear local state to trigger full reload logic below
                }
            }

            // 2. Check for book context if bookId is present
            if (bookId) {
                const foundBook = MOCK_BOOKS.find(b => b.id === bookId);
                if (foundBook) {
                    setBook(foundBook);
                    // Only show BookContextPanel for NEW chats (not existing ones)
                    // Existing chats already have book context in the first message (ChatBookCard)
                    setShowBookContext(!existingChat);
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
                if (loadedMessages.length === 0 && existingChat) {
                    let initialMessages: ChatMessage[] = [];

                    if (existingChat.messages && existingChat.messages.length > 0) {
                        // Convert legacy messages to new format
                        initialMessages = existingChat.messages.map((m, index) => ({
                            id: m.id,
                            text: m.text,
                            senderId: m.senderId === "me" ? (currentUser?.id || "me") : existingChat.user.id,
                            timestamp: parseMockDate(m.timestamp),
                            // Only attach book context to the very first message of the conversation
                            bookId: index === 0 ? existingChat.bookContext?.id : undefined,
                            isRead: m.isRead,
                        }));
                    } else if (existingChat.lastMessage) {
                        initialMessages = [{
                            id: `init-${Date.now()}`,
                            text: existingChat.lastMessage,
                            senderId: existingChat.user.id,
                            timestamp: parseMockDate(existingChat.timestamp),
                            isRead: false,
                        }];
                    }

                    // Add all to store
                    initialMessages.forEach(msg => chatStore.addMessage(chatId, msg));
                    setMessages(initialMessages);
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
        if (!text.trim() || !chatId || !currentUser?.id) return;

        try {
            // Send message with bookId if book context exists
            // The message will be added to store by chatService, and useEffect will update local state
            await chatService.sendMessage(
                chatId,
                text,
                currentUser.id, // Pass current user ID
                showBookContext ? book?.id : undefined
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
