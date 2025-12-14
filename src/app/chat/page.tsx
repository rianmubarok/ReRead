"use client";

import React, { useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatFilter from "@/components/chat/ChatFilter";
import ChatListItem from "@/components/chat/ChatListItem";
import { MOCK_CHATS } from "@/data/mockChats";

export default function ChatPage() {
    const [filter, setFilter] = useState<"all" | "unread">("all");

    return (
        <div className="min-h-screen bg-brand-white pb-24 animate-fade-in">
            <div className="px-6">
                <ChatHeader />

                <ChatFilter filter={filter} onFilterChange={setFilter} />

                <div className="space-y-1">
                    {MOCK_CHATS.map((chat) => (
                        <ChatListItem key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </div>
    );
}
