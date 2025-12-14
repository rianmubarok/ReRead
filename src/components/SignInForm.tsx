import React, { useState, useEffect } from "react";
import UserIcon from "./icons/UserIcon";
import Image from "next/image";
import SearchableDropdown from "./SearchableDropdown";

interface SignInFormProps {
    onFinish: () => void;
}

interface Region {
    code: string;
    name: string;
}

export default function SignInForm({ onFinish }: SignInFormProps) {
    const [step, setStep] = useState(1);

    // Address State
    const [provinces, setProvinces] = useState<Region[]>([]);
    const [regencies, setRegencies] = useState<Region[]>([]);
    const [districts, setDistricts] = useState<Region[]>([]);
    const [villages, setVillages] = useState<Region[]>([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedRegency, setSelectedRegency] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedVillage, setSelectedVillage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchProvinces();
    }, []);

    // Helper to get base URL
    const getBaseUrl = () => {
        if (typeof window !== 'undefined') return ''; // Browser should handle relative paths but let's be safe
        return '';
    };

    const fetchProvinces = async () => {
        try {
            console.log("Fetching provinces...");
            const response = await fetch(`/api/wilayah/provinces`);
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
            const data = await response.json();
            console.log("Provinces data:", data);
            setProvinces(data.data || []);
        } catch (error) {
            console.error("Error fetching provinces:", error);
        }
    };

    const handleProvinceChange = async (value: string) => {
        const provinceCode = value;
        setSelectedProvince(provinceCode);
        setSelectedRegency("");
        setSelectedDistrict("");
        setSelectedVillage("");
        setRegencies([]);
        setDistricts([]);
        setVillages([]);

        if (provinceCode) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/wilayah/regencies/${provinceCode}`);
                const data = await response.json();
                setRegencies(data.data || []);
            } catch (error) {
                console.error("Error fetching regencies:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleRegencyChange = async (value: string) => {
        const regencyCode = value;
        setSelectedRegency(regencyCode);
        setSelectedDistrict("");
        setSelectedVillage("");
        setDistricts([]);
        setVillages([]);

        if (regencyCode) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/wilayah/districts/${regencyCode}`);
                const data = await response.json();
                setDistricts(data.data || []);
            } catch (error) {
                console.error("Error fetching districts:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleDistrictChange = async (value: string) => {
        const districtCode = value;
        setSelectedDistrict(districtCode);
        setSelectedVillage("");
        setVillages([]);

        if (districtCode) {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/wilayah/villages/${districtCode}`);
                const data = await response.json();
                setVillages(data.data || []);
            } catch (error) {
                console.error("Error fetching villages:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleVillageChange = (value: string) => {
        setSelectedVillage(value);
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="absolute inset-0 z-[100] flex flex-col min-h-screen bg-brand-white overflow-hidden animate-fade-in-up">
            {/* Top Progress Bar */}
            <div className="w-full px-8 pt-12 pb-8">
                <div className="flex gap-2">
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-brand-red" : "bg-brand-red/15"}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-brand-red" : "bg-brand-red/15"}`} />
                    <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 3 ? "bg-brand-red" : "bg-brand-red/15"}`} />
                </div>
            </div>

            <div className="flex-1 px-8 overflow-y-auto pb-32">
                {step === 1 && (
                    <div className="animate-fade-in">
                        {/* Header */}
                        <div className="mb-8 space-y-2">
                            <h1 className="text-2xl font-medium text-brand-black">
                                Selamat Datang <br />
                                di ReRead
                            </h1>
                            <p className="text-sm text-brand-gray">
                                Silakan lengkapi data berikut ya!
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-6">
                            {/* Nama Lengkap */}
                            <div className="space-y-2">
                                <label className="text-sm text-brand-black">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black z-10 pointer-events-none">
                                        <UserIcon className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Masukkan nama"
                                        className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50"
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="space-y-3">
                                <label className="text-sm text-brand-black">Alamat</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Provinsi */}
                                    <SearchableDropdown
                                        options={provinces}
                                        value={selectedProvince}
                                        onChange={handleProvinceChange}
                                        placeholder="Provinsi"
                                    />

                                    {/* Kabupaten */}
                                    <SearchableDropdown
                                        options={regencies}
                                        value={selectedRegency}
                                        onChange={handleRegencyChange}
                                        placeholder="Kabupaten"
                                        disabled={!selectedProvince}
                                        isLoading={isLoading && !regencies.length && !!selectedProvince}
                                    />

                                    {/* Kecamatan */}
                                    <SearchableDropdown
                                        options={districts}
                                        value={selectedDistrict}
                                        onChange={handleDistrictChange}
                                        placeholder="Kecamatan"
                                        disabled={!selectedRegency}
                                        isLoading={isLoading && !districts.length && !!selectedRegency}
                                    />

                                    {/* Desa */}
                                    <SearchableDropdown
                                        options={villages}
                                        value={selectedVillage}
                                        onChange={handleVillageChange}
                                        placeholder="Desa"
                                        disabled={!selectedDistrict}
                                        isLoading={isLoading && !villages.length && !!selectedDistrict}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-fade-in space-y-8">
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-medium text-brand-black">
                                Lengkapi Profil
                            </h1>
                            <p className="text-sm text-brand-gray">
                                Pilih foto atau gunakan avatar yang sudah tersedia.
                            </p>
                        </div>

                        {/* Avatar Preview */}
                        <div className="flex justify-center">
                            <div className="w-40 h-40 bg-[#FBEF86] rounded-full flex items-center justify-center relative overflow-hidden">
                                {/* Placeholder Avatar */}
                                <div className="w-full h-full relative">
                                    {/* Using a simple placeholder colored circle for now or generic user icon scale up if no image */}
                                    {/* In a real app we'd map the selected avatar here */}
                                    <div className="absolute inset-4 bg-brand-black rounded-full opacity-10"></div>
                                </div>
                            </div>
                        </div>

                        {/* Avatar Grid */}
                        <div className="grid grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer" />
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-fade-in space-y-12">
                        {/* Header */}
                        <div className="space-y-2">
                            <h1 className="text-2xl font-medium text-brand-black">
                                Izinkan Lokasi
                            </h1>
                            <p className="text-sm text-brand-gray">
                                Aktifkan lokasi supaya kamu bisa menemukan buku terdekat dari pengguna lain.
                            </p>
                        </div>

                        {/* Location Image */}
                        <div className="relative w-full aspect-square max-w-[280px] mx-auto">
                            <Image
                                src="/assets/signInForm/locationPermission.svg"
                                alt="Location Permission"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-white via-white to-transparent flex gap-4">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="flex-1 bg-brand-red/15 text-brand-red py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                    >
                        Kembali
                    </button>
                )}
                <button
                    onClick={handleNext}
                    className="flex-1 bg-brand-red text-white py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
                >
                    Lanjut
                </button>
            </div>
        </div>
    );
}
