import React from "react";
import Image from "next/image";
import { AVATARS } from "./constants";

interface Step2AvatarProps {
  selectedAvatar: string;
  onAvatarChange: (avatar: string) => void;
  googleAvatarUrl?: string;
}

export default function Step2Avatar({
  selectedAvatar,
  onAvatarChange,
  googleAvatarUrl,
}: Step2AvatarProps) {
  return (
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
        <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300">
          <div className="w-full h-full relative">
            {selectedAvatar === "google" ? (
              // If google is selected, try to show the actual google url, else fallback to 'G'
              googleAvatarUrl && googleAvatarUrl !== "google" ? (
                <Image
                  src={googleAvatarUrl}
                  alt="Google Avatar"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-4xl text-gray-400 font-bold">G</span>
                </div>
              )
            ) : (
              <Image
                src={`/assets/avatar/${selectedAvatar}`}
                alt="Selected Avatar"
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>
      </div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-5 gap-4">
        {/* Slot 1: Google Placeholder */}
        <button
          onClick={() => onAvatarChange("google")}
          className={`aspect-square rounded-full flex items-center justify-center relative overflow-hidden transition-all border-2
            ${selectedAvatar === "google"
              ? "border-brand-red scale-105"
              : ""
            }
          `}
        >
          {googleAvatarUrl && googleAvatarUrl !== "google" ? (
            <Image
              src={googleAvatarUrl}
              alt="Google"
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-brand-gray font-medium">G</span>
          )}
        </button>

        {/* Slots 2-10: Asset Avatars */}
        {AVATARS.map((fileName) => (
          <button
            key={fileName}
            onClick={() => onAvatarChange(fileName)}
            className={`aspect-square rounded-full relative overflow-hidden transition-all border-2
              ${selectedAvatar === fileName
                ? "border-brand-red scale-105"
                : ""
              }
            `}
          >
            <Image
              src={`/assets/avatar/${fileName}`}
              alt={`Avatar ${fileName}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

