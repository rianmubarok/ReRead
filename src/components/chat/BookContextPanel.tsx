import React from "react";
import { Book } from "@/types/book";
import { RiCloseFill, RiArrowDownSLine } from "@remixicon/react";

interface BookContextPanelProps {
    book: Book;
    isOwner: boolean;
    onClose: () => void;
    onSendMessage: (text: string, options?: any) => void;
    onOpenExchangePage: () => void;
}

const BookContextPanel: React.FC<BookContextPanelProps> = ({
    book,
    isOwner,
    onClose,
    onSendMessage,
    onOpenExchangePage
}) => {
    const quickActions = [
        "Masih Tersedia?",
        "Info Harga?",
        "Bisa Barter?",
        "Ada Foto Tambahan?",
        "Kondisi Fisik?",
        "Edisi Tahun Berapa?",
        "Lokasi COD?",
        "Sedikit Nego?"
    ];

    const [showActions, setShowActions] = React.useState(true);

    return (
        <div className="bg-white p-4 pb-0 animate-slide-up border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between mb-4">
                <div className="flex gap-3">
                    <div className="w-12 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        {/* Book Image */}
                        <img
                            src={book.image || "/assets/books/placeholder.png"}
                            alt={book.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback to a placeholder color/text if image fails
                                (e.target as HTMLImageElement).src = `https://placehold.co/48x64/e0e0e0/333333?text=${book.title.charAt(0)}`;
                            }}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate mb-0.5">
                            {book.title}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                            {book.author}
                        </p>

                        {isOwner && (
                            <span className="text-[10px] text-gray-400 mt-1 block">
                                Anda pemilik buku ini
                            </span>
                        )}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-1 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 hover:text-red-500 transition-colors"
                >
                    <RiCloseFill className="w-5 h-5" />
                </button>
            </div>

            {showActions && (
                <div className="mb-2 animate-fade-in">
                    {/* Owner View: Actions */}
                    {isOwner ? (
                        <div className="space-y-2">
                            {(!book.status || book.status === 'Available') ? (
                                <button
                                    onClick={onOpenExchangePage}
                                    className="w-full bg-green-600 text-white hover:bg-green-700 text-sm font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span>Tandai Selesai / Tukar</span>
                                </button>
                            ) : (
                                <div className="text-center p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                                    Status buku ini sudah selesai/diarsipkan.
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Seeker View: Quick Questions */
                        <div className="grid grid-cols-2 gap-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action}
                                    onClick={() => onSendMessage(action)}
                                    className="bg-brand-red/5 text-brand-red hover:bg-brand-red hover:text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-all duration-200 border border-brand-red/10"
                                >
                                    {action}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <div className="flex justify-center border-t border-gray-50 mt-2">
                <button
                    onClick={() => setShowActions(!showActions)}
                    className="w-full py-2 flex items-center justify-center text-gray-300 hover:text-brand-red transition-colors group"
                >
                    <RiArrowDownSLine className={`w-5 h-5 transform transition-transform duration-300 ${showActions ? "rotate-180" : ""}`} />
                </button>
            </div>
        </div>
    );
};

export default BookContextPanel;
