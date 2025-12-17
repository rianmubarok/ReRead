"use client";

import React, { useState, useEffect } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatFilter from "@/components/chat/ChatFilter";
import ChatListItem from "@/components/chat/ChatListItem";
import { useAuth } from "@/context/AuthContext";
import { getChatRepository } from "@/repositories/chat.repository";
import { ChatThread } from "@/types/chat";

export default function ChatPage() {
    const { user } = useAuth();
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Real Data State
    const [chats, setChats] = useState<ChatThread[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchChats = async () => {
            if (user?.uid) {
                try {
                    const data = await getChatRepository().getChatThreads(user.uid);
                    setChats(data);
                } catch (error) {
                    console.error("Failed to fetch chats", error);
                } finally {
                    setIsLoading(false);
                }
            } else if (!user) {
                // Not logged in or loading auth
                setIsLoading(true); // Keep loading until auth resolves
            }
        };

        fetchChats();

        // Optional: Polling for new chats every 5 seconds
        const interval = setInterval(() => {
            if (user?.uid) {
                getChatRepository().getChatThreads(user.uid).then(data => {
                    // Simple replace for now, ideal would be to merge or check diff
                    setChats(data);
                }).catch(console.warn);
            }
        }, 5000);

        return () => clearInterval(interval);

    }, [user]);

    const displayedChats = chats.filter(chat => {
        const matchesFilter = filter === "all" || (filter === "unread" && chat.unreadCount > 0);
        const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <ChatHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="min-h-screen bg-brand-white animate-fade-in pt-28 pb-24">
                <div className="px-6">
                    <ChatFilter filter={filter} onFilterChange={setFilter} />

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {displayedChats.length > 0 ? (
                                displayedChats.map((chat) => (
                                    <ChatListItem key={chat.id} chat={chat} />
                                ))
                            ) : (
                                <div className="text-center py-10 text-brand-gray text-sm">
                                    Belum ada percakapan.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
