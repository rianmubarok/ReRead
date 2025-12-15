"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiImageAddLine } from "@remixicon/react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_BOOKS, Book } from "@/data/mockBooks";
import { notFound } from "next/navigation";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [book, setBook] = useState<Book | null>(null);

    // Initialize state only after finding the book
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Non-Fiksi",
        condition: "Baik",
        description: "",
        price: "",
    });

    useEffect(() => {
        // Find the book
        const foundBook = MOCK_BOOKS.find((b) => b.id === id);

        if (!foundBook) {
            notFound(); // This might need error boundary handling in Next.js app dir 
            // fallback if notFound() throws immediately:
            return;
        }

        // Check ownership
        // In real app, API would return 403 or 404. Here we check client side.
        // Wait for user to be loaded (if user is null but loading, we might wait, 
        // but for now assume user is present if accessing this protected route logic)
        if (user && foundBook.owner.id !== user.id) {
            router.push("/my-books"); // Redirect if not owner
            return;
        }

        setBook(foundBook);
        setFormData({
            title: foundBook.title,
            author: foundBook.author,
            category: foundBook.category,
            condition: foundBook.condition,
            description: foundBook.description,
            price: foundBook.price?.toString() || "",
        });
    }, [id, user, router]);

    const categories = ["Fiksi", "Non-Fiksi", "Pendidikan", "Komik", "Sastra"];
    const conditions = ["Baru", "Baik", "Bekas"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (book) {
            // Update MOCK_DATA in place
            book.title = formData.title;
            book.author = formData.author;
            book.category = formData.category as any;
            book.condition = formData.condition as any;
            book.description = formData.description;
            book.price = formData.price ? Number(formData.price) : undefined;

            // Navigate back
            router.push("/my-books");
        } else {
            setIsLoading(false);
        }
    };

    if (!book) return <div className="min-h-screen bg-brand-white pt-24 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-brand-white pb-32">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 border-b border-gray-100 z-50">
                <div className="flex items-center gap-4 py-6 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <RiArrowLeftLine className="w-6 h-6" />
                    </button>
                    <div className="flex-1 font-bold text-lg text-brand-black">
                        Edit Buku
                    </div>
                </div>
            </div>

            <div className="pt-24 px-6 max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Image Placeholder */}
                    <div className="w-full aspect-[3/4] max-h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden">
                        {/* Show existing image if any, currently mock doesn't consistently store URLs we can render easily if blank, 
                         so we stick to placeholder or checking book.image */}
                        {book.image ? (
                            // Keeping it simple with placeholder since handling Next/Image with varied mock URLs might break
                            <img src={book.image} alt="Preview" className="w-full h-full object-cover opacity-50" />
                        ) : (
                            <RiImageAddLine className="w-12 h-12 mb-2" />
                        )}
                        <span className="text-sm font-medium relative z-10">Ubah Foto Buku</span>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Judul Buku</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="Contoh: Laut Bercerita"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
                        />
                    </div>

                    {/* Author */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Penulis</label>
                        <input
                            type="text"
                            name="author"
                            required
                            placeholder="Nama penulis"
                            value={formData.author}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Category */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black">Kategori</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all appearance-none"
                            >
                                {categories.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Condition */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-brand-black">Kondisi</label>
                            <select
                                name="condition"
                                value={formData.condition}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all appearance-none"
                            >
                                {conditions.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Harga (Opsional)</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="Rp 0"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all"
                        />
                        <p className="text-xs text-brand-gray">Kosongkan jika ingin barter/gratis.</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Deskripsi</label>
                        <textarea
                            name="description"
                            required
                            rows={4}
                            placeholder="Ceritakan sedikit tentang buku ini..."
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full bg-brand-black text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
                    >
                        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    {/* Bottom Spacer */}
                    <div className="h-4" />
                </form>
            </div>
        </div>
    );
}
