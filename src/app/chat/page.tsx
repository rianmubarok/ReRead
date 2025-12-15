"use client";

import React, { useState } from "react";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatFilter from "@/components/chat/ChatFilter";
import ChatListItem from "@/components/chat/ChatListItem";
import { MOCK_CHATS } from "@/data/mockChats";

export default function ChatPage() {
    const [filter, setFilter] = useState<"all" | "unread">("all");

    return (
        <>
            <ChatHeader />
            <div className="min-h-screen bg-brand-white animate-fade-in pt-28">
                <div className="px-6">
                    <ChatFilter filter={filter} onFilterChange={setFilter} />

                    <div className="space-y-1">
                        {MOCK_CHATS.map((chat) => (
                            <ChatListItem key={chat.id} chat={chat} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
