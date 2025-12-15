"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  RiBookOpenLine,
  RiCloseLine,
  RiArrowRightSLine,
  RiMapPinLine,
  RiMapLine,
} from "@remixicon/react";
import Image from "next/image";
import { User } from "@/types/user";
import dynamic from "next/dynamic";

const MapPreview = dynamic<{ lat: number; lng: number }>(() => import("../map/MapPreview"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
      <RiMapLine className="w-8 h-8 text-gray-400" />
    </div>
  ),
});

interface HomeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function HomeDrawer({ isOpen, onClose, user }: HomeDrawerProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [locationEnabled, setLocationEnabled] = React.useState(false);
  const [coordinates, setCoordinates] = React.useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggleLocation = async () => {
    if (isLoading) return;

    if (locationEnabled) {
      setLocationEnabled(false);
      return;
    }

    if ("geolocation" in navigator) {
      setIsLoading(true);
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCoordinates({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationEnabled(true);
            setIsLoading(false);
          },
          (error) => {
            let errorMessage = "Terjadi kesalahan saat mengambil lokasi.";
            // Use logical checks or integers for error codes safely
            if (error.code === 1 /* PERMISSION_DENIED */) {
              errorMessage = "Izin lokasi ditolak. Silakan aktifkan di pengaturan browser.";
            } else if (error.code === 2 /* POSITION_UNAVAILABLE */) {
              errorMessage = "Informasi lokasi tidak tersedia.";
            } else if (error.code === 3 /* TIMEOUT */) {
              errorMessage = "Waktu permintaan lokasi habis.";
            }

            console.warn("Location error:", error.message);
            // Optional: Show error to user via toast/alert if needed
            // alert(errorMessage); 
            setLocationEnabled(false);
            setIsLoading(false);
          },
          { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
        );
      } catch (error) {
        console.error("Error requesting location permission:", error);
        setIsLoading(false);
      }
    }
  };

  React.useEffect(() => {
    // Check initial permission status if supported
    if ("permissions" in navigator && "geolocation" in navigator) {
      navigator.permissions.query({ name: "geolocation" }).catch(() => {
        // Fallback for browsers regarding permissions API
        return null;
      }).then((permissionStatus) => {
        if (!permissionStatus) return;

        // Set initial state based on permission
        if (permissionStatus.state === "granted") {
          setLocationEnabled(true);
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setCoordinates({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            () => setLocationEnabled(false), // Fallback if actual fetch fails
            { enableHighAccuracy: true }
          );
        } else {
          // If prompt or denied, start as disabled
          setLocationEnabled(false);
        }

        // Listen for status changes (e.g. user toggles in browser settings)
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setLocationEnabled(true);
            navigator.geolocation.getCurrentPosition((position) => {
              setCoordinates({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
              (error) => console.warn(error),
              { enableHighAccuracy: true }
            );
          } else {
            setLocationEnabled(false);
            setCoordinates(null);
          }
        };
      });
    }
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    {
      icon: RiBookOpenLine,
      label: "Buku Saya",
      onClick: () => {
        onClose();
        router.push("/my-books");
      },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 w-full max-w-md h-full pointer-events-none z-[60] left-1/2 -translate-x-1/2 overflow-hidden"
      >
        <div
          className={`h-full w-80 max-w-[85vw] bg-brand-white transition-transform duration-300 ease-in-out ${isOpen
            ? "pointer-events-auto translate-x-0"
            : "pointer-events-none -translate-x-full"
            }`}
          style={{
            willChange: "transform",
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6">
              <h2 className="text-lg font-bold text-brand-black">Menu</h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-brand-black hover:bg-gray-100 rounded-full transition-colors"
              >
                <RiCloseLine className="w-6 h-6" />
              </button>
            </div>

            {/* Location Permission */}
            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <RiMapPinLine className="w-5 h-5 text-brand-gray" />
                  <span className="font-medium text-brand-black">
                    Izinkan Lokasi
                  </span>
                </div>
                <button
                  onClick={handleToggleLocation}
                  disabled={isLoading}
                  className={`w-10 h-5 rounded-full p-1 transition-colors duration-200 ease-in-out ${locationEnabled ? "bg-green-500" : "bg-gray-300"
                    } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                >
                  <div
                    className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${locationEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                  />
                </button>
              </div>

              {/* Mini Map */}
              {locationEnabled && coordinates && (
                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative border border-gray-200">
                  <MapPreview lat={coordinates.lat} lng={coordinates.lng} />
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-3 text-brand-black">
                    <item.icon className="w-5 h-5 text-brand-gray group-hover:text-brand-black transition-colors" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <RiArrowRightSLine className="w-5 h-5 text-gray-300 group-hover:text-brand-black transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
