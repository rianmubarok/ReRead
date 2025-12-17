"use client";

import React, { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiImageAddLine, RiCloseCircleFill } from "@remixicon/react";
import { useAuth } from "@/context/AuthContext";
import { Book, ExchangeMethod } from "@/types/book";
import { notFound } from "next/navigation";
import { getBookRepository } from "@/repositories/book.repository";
import { uploadBookImage } from "@/services/storage.service";
import toast from "react-hot-toast";
import Image from "next/image";

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [book, setBook] = useState<Book | null>(null);

    // Image Upload State
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        category: "Non-Fiksi",
        condition: "Baik",
        description: "",
        exchangeMethods: [] as ExchangeMethod[],
        status: "Available" as "Available" | "Archived",
    });

    // Valid Exchange Methods (from Book type)
    const availableExchangeMethods: ExchangeMethod[] = ["Gratis / Dipinjamkan", "Nego", "Barter"];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const foundBook = await getBookRepository().getBookById(id);
                if (!foundBook) {
                    notFound();
                    return;
                }

                // Check ownership
                if (user && foundBook.owner.id !== user.id) {
                    toast.error("Anda tidak memiliki akses untuk mengedit buku ini");
                    router.push("/my-books");
                    return;
                }

                setBook(foundBook);
                setFormData({
                    title: foundBook.title,
                    author: foundBook.author,
                    category: foundBook.category,
                    condition: foundBook.condition,
                    description: foundBook.description,
                    exchangeMethods: foundBook.exchangeMethods || [],
                    status: (foundBook.status as "Available" | "Archived") || "Available",
                });
                setImagePreview(foundBook.image);
            } catch (err) {
                console.error("Failed to load book:", err);
                toast.error("Gagal memuat detail buku");
            } finally {
                setIsLoading(false);
            }
        };

        if (user && id) {
            fetchBook();
        }
    }, [id, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleExchangeMethod = (method: ExchangeMethod) => {
        setFormData(prev => {
            const current = prev.exchangeMethods;
            if (current.includes(method)) {
                return { ...prev, exchangeMethods: current.filter(m => m !== method) };
            } else {
                return { ...prev, exchangeMethods: [...current, method] };
            }
        });
    };

    // Image Handlers
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast.error("Ukuran gambar maksimal 5MB");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("Mohon upload file gambar valid");
                return;
            }
            setImageFile(file);
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.exchangeMethods.length === 0) {
            toast.error("Pilih minimal satu metode pertukaran");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Menyimpan perubahan...");

        try {
            let imageUrl = book?.image; // Default to existing image

            // Convert local image file to URL if new file uploaded
            if (imageFile) {
                const uploadedUrl = await uploadBookImage(imageFile);
                if (uploadedUrl) {
                    imageUrl = uploadedUrl;
                } else {
                    throw new Error("Gagal mengupload gambar");
                }
            }

            // Update Book
            await getBookRepository().updateBook(id, {
                title: formData.title,
                author: formData.author,
                category: formData.category as any,
                condition: formData.condition as any,
                description: formData.description,
                exchangeMethods: formData.exchangeMethods,
                status: formData.status,
                image: imageUrl,
            });

            toast.success("Buku berhasil diperbarui!", { id: loadingToast });
            router.refresh(); // Ensure data is fresh
            router.back();
        } catch (error) {
            console.error("Update failed:", error);
            toast.error("Gagal menyimpan perubahan", { id: loadingToast });
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-brand-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-black rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!book) return null;

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

                    {/* Image Upload */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    <div
                        onClick={handleImageClick}
                        className="w-full aspect-[3/4] max-h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group"
                    >
                        {imagePreview ? (
                            <>
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                    <span className="bg-white/90 text-brand-black px-4 py-2 rounded-full text-sm font-medium shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                        Ganti Foto
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <RiImageAddLine className="w-12 h-12 mb-2" />
                                <span className="text-sm font-medium relative z-10">Upload Foto Buku</span>
                            </>
                        )}
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

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-50 border border-gray-200 text-brand-black rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-brand-black transition-all appearance-none"
                        >
                            <option value="Available">Tersedia (Aktif)</option>
                            <option value="Archived">Diarsipkan</option>
                        </select>
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
                                {["Fiksi", "Non-Fiksi", "Pendidikan", "Komik", "Sastra"].map(c => (
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
                                {["Baru", "Baik", "Bekas"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Exchange Methods */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-brand-black mb-1 block">Metode Pertukaran</label>
                        <div className="flex flex-wrap gap-2">
                            {availableExchangeMethods.map((method) => {
                                const isSelected = formData.exchangeMethods.includes(method);
                                return (
                                    <button
                                        key={method}
                                        type="button"
                                        onClick={() => toggleExchangeMethod(method)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isSelected
                                            ? "bg-brand-black text-white shadow-md"
                                            : "bg-gray-100 text-brand-gray hover:bg-gray-200"
                                            }`}
                                    >
                                        {method}
                                    </button>
                                );
                            })}
                        </div>
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
                        disabled={isSaving}
                        className={`w-full bg-brand-black text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 ${isSaving ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'}`}
                    >
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>

                    {/* Bottom Spacer */}
                    <div className="h-4" />
                </form>
            </div>
        </div>
    );
}
