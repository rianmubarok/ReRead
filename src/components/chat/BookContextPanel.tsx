import React from "react";
import { Book } from "@/data/mockBooks";
import { RiCloseFill, RiArrowDownSLine } from "@remixicon/react";

interface BookContextPanelProps {
    book: Book;
    onClose: () => void;
    onSendMessage: (text: string) => void;
}

const BookContextPanel: React.FC<BookContextPanelProps> = ({ book, onClose, onSendMessage }) => {
    const quickActions = [
        "Masih Tersedia?",
        "Info Harga?",
        "Bisa Barter?",
        "Ada Foto Tambahan?"
    ];

    return (
        <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] p-4 pb-2 animate-slide-up">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                    <div className="w-16 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                        {/* Book Image */}
                        <img
                            src={book.image || "/assets/books/placeholder.png"}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to a placeholder color/text if image fails
                                (e.target as HTMLImageElement).src = `https://placehold.co/64x96/e0e0e0/333333?text=Buku`;
                            }}
                        />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">{book.title}</h3>
                        <p className="text-gray-500 text-sm mt-0.5">{book.author}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                >
                    <RiCloseFill className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
                {quickActions.map((action) => (
                    <button
                        key={action}
                        onClick={() => onSendMessage(action)}
                        className="bg-brand-red text-white text-sm font-medium py-2.5 px-4 rounded-full hover:bg-red-600 active:bg-red-700 transition-colors"
                    >
                        {action}
                    </button>
                ))}
            </div>

            <div className="flex justify-center -mb-2">
                <button onClick={onClose} className="p-2 text-gray-400">
                    <RiArrowDownSLine className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default BookContextPanel;
