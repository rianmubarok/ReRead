import React, { useState } from "react";
import { RiMicLine, RiSendPlaneFill } from "@remixicon/react";

interface ChatInputProps {
    onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage("");
        }
    };

    return (
        <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ketik pesan"
                        className="w-full bg-white border border-gray-300 rounded-full pl-5 pr-10 py-3 text-gray-800 focus:outline-none focus:border-brand-gray transition-colors font-medium placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                    >
                        <RiMicLine className="w-5 h-5" />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-[#2D3339] text-white p-3 rounded-full hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                >
                    {/* Custom icon or Remix icon for send */}
                    <RiSendPlaneFill className="w-5 h-5 -ml-0.5 mt-0.5 transform -rotate-45 translate-x-0.5 -translate-y-0.5" />
                    {/* The icon in screenshot looks a bit like a hand or a stylized send. Standard send is fine. Adjusting rotation to look cool. */}
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
