"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiImageAddLine } from "@remixicon/react";
import { useAuth } from "@/context/AuthContext";
import { MOCK_BOOKS, Book } from "@/data/mockBooks";
import toast from "react-hot-toast";

export default function AddBookPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Non-Fiksi",
        condition: "Baik",
        description: "",
        exchangeMethods: [] as string[],
    });

    const categories = ["Fiksi", "Non-Fiksi", "Pendidikan", "Komik", "Sastra"];
    const conditions = ["Baru", "Baik", "Bekas"];
    const exchangeOptions = ["Gratis / Dipinjamkan", "Nego", "Barter"];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleExchangeMethod = (method: string) => {
        setFormData(prev => {
            const current = prev.exchangeMethods;
            if (current.includes(method)) {
                return { ...prev, exchangeMethods: current.filter(m => m !== method) };
            } else {
                return { ...prev, exchangeMethods: [...current, method] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { title, author, description, exchangeMethods } = formData;

        // Manual validation replaced native 'required'
        if (!title || !author || !description) {
            toast.error("Mohon lengkapi semua data buku.", {
                duration: 3000,
                icon: "⚠️",
            });
            setIsLoading(false);
            return;
        }

        if (formData.exchangeMethods.length === 0) {
            toast.error("Pilih minimal satu metode pertukaran", {
                duration: 3000,
                icon: "⚠️",
            });
            setIsLoading(false);
            return;
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (user) {
            const newBook: Book = {
                id: Math.random().toString(36).substr(2, 9),
                title: formData.title,
                author: formData.author,
                image: "", // TODO: Handle image upload
                category: formData.category as any,
                description: formData.description,
                condition: formData.condition as any,
                owner: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar || "default-avatar.png",
                    location: user.address
                        ? `${user.address.district}, ${user.address.regency}, ${user.address.province}`
                        : "Lokasi tidak diketahui",
                    isVerified: true,
                    joinDate: "2024",
                },
                exchangeMethods: formData.exchangeMethods,
                createdAt: "Baru saja",
                location: user.address
                    ? `${user.address.district}, ${user.address.regency}`
                    : "Lokasi Saya",
                distance: "0 km",
            };

            // In-memory update for demo purposes
            // Note: This will reset on page reload/recompile
            MOCK_BOOKS.unshift(newBook);

            toast.success("Buku berhasil ditambahkan!");

            // Navigate back replacing current history entry so "back" doesn't return to form
            router.replace("/my-books");
        } else {
            toast.error("Silakan login terlebih dahulu");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-white pb-32">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 w-full max-w-md mx-auto bg-brand-white px-6 z-50">
                <div className="flex items-center gap-4 py-6 pt-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <RiArrowLeftLine className="w-6 h-6" />
                    </button>
                    <div className="flex-1 font-bold text-lg text-brand-black">
                        Tambah Buku
                    </div>
                </div>
            </div>

            <div className="pt-24 px-6 max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6" noValidate>

                    {/* Image Placeholder */}
                    <div className="w-full aspect-[3/4] max-h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                        <RiImageAddLine className="w-12 h-12 mb-2" />
                        <span className="text-sm font-medium">Unggah Foto Buku</span>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Judul Buku</label>
                        <input
                            type="text"
                            name="title"
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

                    {/* Exchange Methods */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-brand-black">Metode Pertukaran</label>
                        <div className="flex flex-wrap gap-2">
                            {exchangeOptions.map((method) => {
                                const isSelected = formData.exchangeMethods.includes(method);
                                return (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => toggleExchangeMethod(method)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                                            ${isSelected
                                                ? "bg-brand-black text-white border-brand-black"
                                                : "bg-white text-brand-gray border-gray-200 hover:border-brand-black"
                                            }`}
                                    >
                                        {method}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-brand-gray">Pilih satu atau lebih.</p>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Deskripsi</label>
                        <textarea
                            name="description"
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
                        className={`w-full bg-brand-black text-white font-bold py-4 rounded-full transition-all active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
                    >
                        {isLoading ? "Menambahkan..." : "Tambah Buku"}
                    </button>

                    {/* Bottom Spacer */}
                    <div className="h-4" />
                </form>
            </div>
        </div>
    );
}
