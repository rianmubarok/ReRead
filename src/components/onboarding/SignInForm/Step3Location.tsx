import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Step3LocationProps {
  onLocationGranted?: (coords: { lat: number; lng: number }) => void;
}

export default function Step3Location({ onLocationGranted }: Step3LocationProps) {
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);

  const handleRequestLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Browser Anda tidak mendukung geolokasi");
      return;
    }

    setIsRequestingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocationGranted(true);
        setIsRequestingLocation(false);
        toast.success("Lokasi berhasil diaktifkan!");
        onLocationGranted?.(coords);
      },
      (error) => {
        setIsRequestingLocation(false);
        console.error("Geolocation error:", error);

        let errorMessage = "Gagal mendapatkan lokasi";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Izin lokasi ditolak. Silakan aktifkan di pengaturan browser.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Lokasi tidak tersedia";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Waktu permintaan lokasi habis";
        }

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-medium text-brand-black">
          Izinkan Lokasi
        </h1>
        <p className="text-sm text-brand-gray">
          Aktifkan lokasi supaya kamu bisa menemukan buku terdekat dari
          pengguna lain.
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

      {/* Location Button */}
      <div className="pt-4">
        <button
          onClick={handleRequestLocation}
          disabled={isRequestingLocation || locationGranted}
          className={`w-full py-3 px-4 rounded-full font-medium transition-all ${locationGranted
              ? "bg-green-100 text-green-700 cursor-not-allowed"
              : isRequestingLocation
                ? "bg-gray-200 text-gray-500 cursor-wait"
                : "bg-brand-black text-white hover:bg-gray-800 active:scale-95"
            }`}
        >
          {isRequestingLocation
            ? "Meminta izin lokasi..."
            : locationGranted
              ? "✓ Lokasi Diaktifkan"
              : "Aktifkan Lokasi"}
        </button>

        {!locationGranted && (
          <p className="text-xs text-brand-gray text-center mt-3">
            Anda dapat melewati langkah ini dan mengaktifkan lokasi nanti di pengaturan
          </p>
        )}
      </div>
    </div>
  );
}

