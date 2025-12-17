"use client";

import React from "react";
import Image from "next/image";
import { ChatThread } from "@/data/mockChats";
import { useRouter } from "next/navigation";
import { formatChatListTime } from "@/utils/dateUtils";

interface ChatListItemProps {
    chat: ChatThread;
}

export default function ChatListItem({ chat }: ChatListItemProps) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/chat/${chat.id}`)}
            className="flex items-start gap-4 p-4 -mx-4 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer active:scale-[0.99]"
        >
            {/* Avatar */}
            <div className="relative w-12 h-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-200 border border-gray-100">
                {/* Simple logic for mock avatars/real avatars */}
                {chat.user.avatar === 'google' ? (
                    <div className="w-full h-full flex items-center justify-center bg-[#FBEF86]">
                        <span className="font-bold text-gray-700 text-lg">
                            {chat.user.name ? chat.user.name.charAt(0).toUpperCase() : '?'}
                        </span>
                    </div>
                ) : (
                    <div className="relative w-full h-full">
                        <Image
                            src={(chat.user.avatar && chat.user.avatar.startsWith('http')) ? chat.user.avatar : `/assets/avatar/${chat.user.avatar || 'default.png'}`}
                            alt={chat.user.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                // Fallback is handled by showing the div background
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                        {/* Fallback initials underneath (visible if image fails/hidden) */}
                        <div className={`absolute inset-0 flex items-center justify-center -z-10 ${chat.id === '2' ? 'bg-blue-100' :
                            chat.id === '3' ? 'bg-green-100' :
                                chat.id === '4' ? 'bg-purple-100' : 'bg-orange-100'
                            }`}>
                            <span className="font-bold text-brand-black text-lg">
                                {chat.user.name ? chat.user.name.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-brand-black truncate pr-2">
                        {chat.user.name}
                    </h3>
                    <span className={`text-xs flex-shrink-0 ${chat.unreadCount > 0 ? "text-brand-red font-medium" : "text-gray-400"}`}>
                        {formatChatListTime(chat.timestamp)}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <p className={`text-sm truncate flex-1 ${chat.unreadCount > 0 ? "text-brand-black font-semibold" : "text-gray-500"}`}>
                        {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                        <div className="ml-2 bg-brand-red text-white text-[10px] font-bold px-1.5 h-4 flex items-center justify-center rounded-full min-w-[16px]">
                            {chat.unreadCount}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
