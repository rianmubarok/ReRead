"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RiArrowLeftLine, RiImageAddLine } from "@remixicon/react";
import { useAuth } from "@/context/AuthContext";
import { useNav } from "@/context/NavContext";
import { ExchangeMethod } from "@/types/book";
import toast from "react-hot-toast";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import { uploadBookImage } from "@/services/storage.service";
import { getBookRepository } from "@/repositories/book.repository";

export default function AddBookPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { setVisible } = useNav();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setVisible(false);
  }, [setVisible]);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Non-Fiksi",
    condition: "Baik",
    description: "",
    exchangeMethods: [] as ExchangeMethod[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Fiksi",
    "Non-Fiksi",
    "Pendidikan",
    "Komik",
    "Sastra",
    "Biografi",
    "Teknologi",
    "Seni",
    "Agama",
    "Hobi",
  ];
  const conditions = ["Baru", "Baik", "Bekas"];
  const exchangeOptions: ExchangeMethod[] = [
    "Gratis / Dipinjamkan",
    "Nego",
    "Barter",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExchangeMethod = (method: ExchangeMethod) => {
    setFormData((prev) => {
      const current = prev.exchangeMethods;
      if (current.includes(method)) {
        return {
          ...prev,
          exchangeMethods: current.filter((m) => m !== method),
        };
      }
      return { ...prev, exchangeMethods: [...current, method] };
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
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

    if (user) {
      try {
        let imageUrl = "";
        if (imageFile) {
          const uploadedUrl = await uploadBookImage(imageFile);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          } else {
            toast.error(
              "Gagal mengunggah gambar. Mencoba menyimpan tanpa gambar."
            );
          }
        }

        const locationLabel = user.address
          ? `${user.address.district}, ${user.address.regency}`
          : "Lokasi tidak diketahui";

        await getBookRepository().createBook({
          title: formData.title,
          author: formData.author,
          image: imageUrl,
          category: formData.category as any,
          description: formData.description,
          condition: formData.condition as any,
          owner: {
            ...user,
            id: user.id || "",
          } as any,
          exchangeMethods: formData.exchangeMethods,
          createdAt: new Date().toISOString(),
          locationLabel,
          distanceLabel: "0 km",
        });

        toast.success("Buku berhasil ditambahkan!");

        router.back();
      } catch (error) {
        console.error("Failed to create book:", error);
        toast.error("Gagal menambahkan buku");
        setIsLoading(false);
      }
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
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] max-h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer overflow-hidden relative"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <RiImageAddLine className="w-12 h-12 mb-2" />
                <span className="text-sm font-medium">Unggah Foto Buku</span>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-brand-black">
              Judul Buku
            </label>
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
            <label className="text-sm font-bold text-brand-black">
              Penulis
            </label>
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
              <label className="text-sm font-bold text-brand-black">
                Kategori
              </label>
              <SearchableDropdown
                options={categories.map((c) => ({ code: c, name: c }))}
                value={formData.category}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, category: val }))
                }
                placeholder="Pilih Kategori"
              />
            </div>

            {/* Condition */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-brand-black">
                Kondisi
              </label>
              <SearchableDropdown
                options={conditions.map((c) => ({ code: c, name: c }))}
                value={formData.condition}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, condition: val }))
                }
                placeholder="Pilih Kondisi"
              />
            </div>
          </div>

          {/* Exchange Methods */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-brand-black">
              Metode Pertukaran
            </label>
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
            <label className="text-sm font-bold text-brand-black">
              Deskripsi
            </label>
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
            className={`w-full bg-brand-black text-white font-bold py-4 rounded-full transition-all active:scale-95 ${isLoading ? "opacity-70 cursor-wait" : "hover:scale-[1.02]"
              }`}
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
