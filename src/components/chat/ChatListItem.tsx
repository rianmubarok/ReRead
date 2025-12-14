"use client";

import React from "react";
import Image from "next/image";
import { ChatThread } from "@/data/mockChats";

interface ChatListItemProps {
    chat: ChatThread;
}

import { useRouter } from "next/navigation";

// ... inside the component
export default function ChatListItem({ chat }: ChatListItemProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/chat/${chat.id}`)}
            className="flex items-start gap-4 p-4 -mx-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer active:scale-[0.99]"
        >
            {/* Avatar */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                {/* Simple logic for mock avatars */}
                {chat.user.avatar === 'google' ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#FBEF86]">
                        <span className="font-bold text-gray-700 text-lg">
                            {chat.user.name.charAt(0)}
                        </span>
                    </div>
                ) : (
                    // Assuming we might have assets or just fallback to letter for now if asset missing
                    // For this mock, I'll use a colored div or placeholder if image valid logic isn't set up
                    <div className={`w-full h-full flex items-center justify-center ${chat.id === '2' ? 'bg-blue-100' :
                        chat.id === '3' ? 'bg-green-100' :
                            chat.id === '4' ? 'bg-purple-100' : 'bg-orange-100'
                        }`}>
                        {/* 
                    Ideally use <Image /> if we have files. 
                    I'll use text initial for now to be safe and clean, 
                    matching the "Nadia" google style more or less if image fails.
                  */}
                        <span className="font-bold text-brand-black text-lg">
                            {chat.user.name.charAt(0)}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-brand-black truncate pr-2">
                        {chat.user.name}
                    </h3>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                        {chat.timestamp}
                    </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                </p>
            </div>
        </div>
    );
}
