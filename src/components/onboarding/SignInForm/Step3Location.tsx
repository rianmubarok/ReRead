import React from "react";
import Image from "next/image";

export default function Step3Location() {
  return (
    <div className="animate-fade-in space-y-24">
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
    </div>
  );
}

