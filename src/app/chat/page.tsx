"use client";

import React, { useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatFilter from "@/components/chat/ChatFilter";
import ChatListItem from "@/components/chat/ChatListItem";
import { MOCK_CHATS } from "@/data/mockChats";

export default function ChatPage() {
    const [filter, setFilter] = useState<"all" | "unread">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const displayedChats = MOCK_CHATS.filter(chat => {
        const matchesFilter = filter === "all" || (filter === "unread" && chat.unreadCount > 0);
        const matchesSearch = chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <>
            <ChatHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            <div className="min-h-screen bg-brand-white animate-fade-in pt-28">
                <div className="px-6">
                    <ChatFilter filter={filter} onFilterChange={setFilter} />

                    <div className="space-y-1">
                        {displayedChats.map((chat) => (
                            <ChatListItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
