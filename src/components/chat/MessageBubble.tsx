import React from "react";
import Link from "next/link";
import { RiArrowRightSLine } from "@remixicon/react";
import { ChatMessage } from "@/types/chat";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { formatMessageTime } from "@/utils/dateUtils";
import { isMessageFromMe } from "@/utils/chat.mapper";

interface MessageBubbleProps {
    message: ChatMessage;
    user: {
        name: string;
        avatar: string;
    };
    currentUserId: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, user, currentUserId }) => {
    const isMe = isMessageFromMe(message, currentUserId);
    const messageBook = message.bookId
        ? MOCK_BOOKS.find((b) => b.id === message.bookId)
        : null;

    return (
        <div
            className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
        >


            <div
                className={`w-full ${isMe ? "items-end" : "items-start"} flex flex-col gap-1.5`}
            >
                {messageBook && (
                    <div
                        className={`w-full ${isMe ? "bg-white/95" : "bg-gray-50"} rounded-xl p-3 border ${isMe ? "border-gray-200" : "border-gray-200"}`}
                    >
                        <div className="flex gap-2.5">
                            <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                    src={messageBook.image || "/assets/books/placeholder.png"}
                                    alt={messageBook.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (
                                            e.target as HTMLImageElement
                                        ).src = `https://placehold.co/48x64/e0e0e0/333333?text=${messageBook.title.charAt(
                                            0
                                        )}`;
                                    }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 truncate mb-0.5">
                                    {messageBook.title}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                    {messageBook.author}
                                </p>
                                <Link
                                    href={`/book/${messageBook.id}`}
                                    className="flex items-center gap-0.5 text-[10px] text-gray-900 font-medium mt-1.5 hover:opacity-70 transition-opacity"
                                >
                                    Lihat Buku <RiArrowRightSLine className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
                <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isMe
                        ? "bg-brand-red text-white rounded-br-sm"
                        : !isMe && message.isRead === false
                            ? "bg-red-50/50 text-brand-black border border-red-200 rounded-bl-sm shadow-sm font-medium"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                        }`}
                >
                    {message.text}
                </div>
                <div className={`flex items-center gap-1 px-1 -mt-0.5 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span className={`text-[10px] ${isMe ? "text-gray-400" : "text-gray-400"}`}>
                        {formatMessageTime(message.timestamp)}
                    </span>
                    {!isMe && message.isRead === false && (
                        <span className="w-1.5 h-1.5 bg-brand-red rounded-full" title="Belum dibaca" />
                    )}
                </div>
            </div>


        </div>
    );
};

export default MessageBubble;
