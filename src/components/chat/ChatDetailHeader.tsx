import { RiArrowLeftLine, RiMore2Fill, RiShakeHandsLine } from "@remixicon/react";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";

interface ChatDetailHeaderProps {
    name: string;
    status: string;
    avatar: string;
    onOptionSelect?: (option: string) => void;
    hasPendingExchange?: boolean;
}

const ChatDetailHeader: React.FC<ChatDetailHeaderProps> = ({ name, status, avatar, onOptionSelect, hasPendingExchange }) => {
    const router = useRouter();
    const params = useParams();
    const [showMenu, setShowMenu] = useState(false);

    const handleCompleteExchange = () => {
        if (hasPendingExchange) return;

        if (params?.id) {
            router.push(`/chat/${params.id}/complete-exchange`);
        }
        setShowMenu(false);
    };

    return (
        <div className="flex items-center justify-between px-6 py-4 pt-8 bg-white z-10 sticky top-0 border-b border-gray-100">
            {/* ... rest of existing code ... */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-1 -ml-1 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <RiArrowLeftLine className="w-6 h-6" />
                </button>

                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                        src={avatar === 'google' ? '/assets/avatars/google-avatar.png' : (avatar.startsWith('http') ? avatar : `/assets/avatar/${avatar}`)}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('ui-avatars')) {
                                target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=random';
                            }
                        }}
                    />
                </div>

                <div>
                    <h2 className="font-bold text-gray-900 leading-tight">{name}</h2>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                        <span className="text-xs text-gray-500">{status}</span>
                    </div>
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <RiMore2Fill className="w-6 h-6" />
                </button>

                {showMenu && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 overflow-hidden z-20 animate-fade-in origin-top-right">
                            <button
                                onClick={handleCompleteExchange}
                                disabled={hasPendingExchange}
                                className={`w-full text-left px-4 py-3 text-sm flex items-center gap-2 ${hasPendingExchange
                                    ? "text-gray-400 cursor-not-allowed bg-gray-50"
                                    : "text-brand-black hover:bg-gray-50"
                                    }`}
                            >
                                <RiShakeHandsLine className={`w-4 h-4 ${hasPendingExchange ? "text-gray-400" : "text-brand-black"}`} />
                                {hasPendingExchange ? "Menunggu Konfirmasi" : "Ajukan Selesai"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatDetailHeader;
