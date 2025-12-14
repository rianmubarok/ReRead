import React from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiMore2Fill } from "@remixicon/react";
import Image from "next/image";

interface ChatDetailHeaderProps {
    name: string;
    status: string;
    avatar: string; // Assuming we handle different avatar sources
}

const ChatDetailHeader: React.FC<ChatDetailHeaderProps> = ({ name, status, avatar }) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between px-6 py-4 pt-8 bg-white z-10 sticky top-0">
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-1 -ml-1 text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <RiArrowLeftLine className="w-6 h-6" />
                </button>

                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    {/* Placeholder for avatar logic - if it's a path or external url */}
                    {/* Simulating the avatar from design */}
                    <img
                        src={avatar === 'google' ? '/assets/avatars/google-avatar.png' : `/assets/avatar/${avatar}`}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            // On error, try to show ui-avatars as last resort
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

            <button className="p-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                <RiMore2Fill className="w-6 h-6" />
            </button>
        </div>
    );
};

export default ChatDetailHeader;
