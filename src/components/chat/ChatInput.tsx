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
        <div className="p-4 bg-white border-t border-gray-100 safe-area-bottom">
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ketik pesan"
                        className="w-full bg-gray-50 border border-gray-200 rounded-full pl-5 pr-10 py-3 text-gray-800 focus:outline-none focus:border-brand-red focus:bg-white transition-all font-medium placeholder:text-gray-400 text-sm"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 transition-colors"
                    >
                        <RiMicLine className="w-5 h-5" />
                    </button>
                </div>

                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="bg-brand-red text-white p-3 rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0 shadow-sm"
                >
                    <RiSendPlaneFill className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

export default ChatInput;
