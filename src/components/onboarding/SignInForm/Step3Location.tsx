import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function Step3Location() {
  const [permissionStatus, setPermissionStatus] = useState<"pending" | "granted" | "denied">("pending");

  useEffect(() => {
    // Request location permission when component mounts
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success - save coordinates to localStorage
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          localStorage.setItem("user_coordinates", JSON.stringify(coords));
          setPermissionStatus("granted");
          console.log("Location permission granted:", coords);
        },
        (error) => {
          // Error - permission denied or other error
          console.error("Location permission error:", error);
          setPermissionStatus("denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
      setPermissionStatus("denied");
    }
  }, []);

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

        {/* Permission Status Indicator */}
        {permissionStatus === "granted" && (
          <div className="flex items-center gap-2 text-green-600 text-sm mt-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Lokasi berhasil diaktifkan</span>
          </div>
        )}

        {permissionStatus === "denied" && (
          <div className="flex items-center gap-2 text-amber-600 text-sm mt-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Lokasi tidak diaktifkan (akan menggunakan lokasi default)</span>
          </div>
        )}
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

