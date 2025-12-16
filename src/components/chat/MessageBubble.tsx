import React from "react";
import Link from "next/link";
import { RiArrowRightSLine, RiShakeHandsLine } from "@remixicon/react";
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
    onAction?: (action: string, messageId: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, user, currentUserId, onAction }) => {
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
                {message.messageType === 'exchange_request' && message.exchangeRequest ? (
                    <div className={`rounded-2xl p-4 w-64 ${isMe ? "bg-brand-red text-white ml-auto" : "bg-white border border-gray-100 text-brand-black"}`}>
                        <div className={`flex items-center gap-2 mb-3 pb-3 border-b ${isMe ? "border-white/20" : "border-gray-100"}`}>
                            <RiShakeHandsLine className="w-5 h-5" />
                            <span className="font-bold text-sm">Pengajuan Selesai</span>
                        </div>

                        <div className="flex gap-3 mb-3">
                            <div className="w-10 h-14 bg-black/10 rounded flex-shrink-0 overflow-hidden relative">
                                {message.exchangeRequest.bookImage ? (
                                    <img
                                        src={message.exchangeRequest.bookImage}
                                        className="w-full h-full object-cover"
                                        alt="Book"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-xs font-bold text-gray-400">
                                        {message.exchangeRequest.bookTitle.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs opacity-80 mb-0.5 ${isMe ? "text-white" : "text-gray-500"}`}>Buku</p>
                                <p className="font-bold text-sm line-clamp-2 leading-tight">{message.exchangeRequest.bookTitle}</p>
                            </div>
                        </div>

                        {message.text && (
                            <p className="text-sm opacity-90 mb-3">
                                {message.text.replace(/^Permintaan konfirmasi:\s*/i, "")}
                            </p>
                        )}

                        <div className="mt-2">
                            {message.exchangeRequest.status === 'completed' ? (
                                <div className={`w-full py-2 rounded-lg text-xs font-bold text-center ${isMe ? "bg-white/20 text-white" : "bg-green-100 text-green-700"}`}>
                                    Pertukaran Selesai
                                </div>
                            ) : message.exchangeRequest.status === 'cancelled' ? (
                                <div className={`w-full py-2 rounded-lg text-xs font-bold text-center ${isMe ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                                    Pengajuan Dibatalkan
                                </div>
                            ) : isMe ? (
                                <div className="space-y-2">
                                    <div className="w-full py-2 bg-white/20 rounded-lg text-xs font-bold text-center text-white">
                                        Menunggu Konfirmasi
                                    </div>
                                    <button
                                        onClick={() => onAction?.('cancel_exchange', message.id)}
                                        className="w-full py-2 bg-white text-brand-red rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm"
                                    >
                                        Batalkan Pengajuan
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => onAction?.('confirm_exchange', message.id)}
                                    className="w-full py-2 bg-brand-black text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity shadow-lg"
                                >
                                    Konfirmasi Selesai
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
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
