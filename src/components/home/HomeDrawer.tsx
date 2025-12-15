"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  RiSettings4Line,
  RiQuestionLine,
  RiInformationLine,
  RiBookOpenLine,
  RiCloseLine,
  RiArrowRightSLine,
  RiMapPinLine,
  RiMapLine,
} from "@remixicon/react";
import Image from "next/image";
import { User } from "@/types/user";

interface HomeDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function HomeDrawer({ isOpen, onClose, user }: HomeDrawerProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const [locationEnabled, setLocationEnabled] = React.useState(false);
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
          () => {
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
          { timeout: 10000, maximumAge: 0 }
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
        } else {
          // If prompt or denied, start as disabled
          setLocationEnabled(false);
        }

        // Listen for status changes (e.g. user toggles in browser settings)
        permissionStatus.onchange = () => {
          if (permissionStatus.state === "granted") {
            setLocationEnabled(true);
          } else {
            setLocationEnabled(false);
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
        // TODO: Navigate to my books page
      },
    },
    {
      icon: RiSettings4Line,
      label: "Pengaturan",
      onClick: () => {
        onClose();
        // TODO: Navigate to settings page
      },
    },
    {
      icon: RiQuestionLine,
      label: "Bantuan",
      onClick: () => {
        onClose();
        // TODO: Navigate to help page
      },
    },
    {
      icon: RiInformationLine,
      label: "Tentang",
      onClick: () => {
        onClose();
        // TODO: Navigate to about page
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
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
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
              {locationEnabled && (
                <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RiMapLine className="w-8 h-8 text-brand-gray" />
                  </div>
                  {/* Placeholder for actual map integration */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 opacity-50"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-brand-red rounded-full border-2 border-white shadow-lg"></div>
                  </div>
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
