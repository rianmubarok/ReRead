import React, { useState, useEffect } from "react";
import Image from "next/image";
import GoogleIcon from "../icons/GoogleIcon";
import Button from "@/components/ui/Button";
import BottomContainer from "@/components/ui/BottomContainer";
import { useAuth } from "@/context/AuthContext";

interface WalkthroughProps {
  onFinish: () => void;
}

const steps = [
  {
    title: "Cari Buku di Sekitarmu",
    description:
      "Temukan buku dari pengguna terdekat. Izinkan lokasi agar kamu bisa melihat koleksi yang mudah dijangkau.",
    image: "/assets/walkthrough/wl-1.svg",
    sprinkleCount: 6,
  },
  {
    title: "Negosiasi Sepuasnya",
    description:
      "Hubungi pemilik buku dan tentukan sendiri harganya. Kamu bisa menawar, barter, atau mengambilnya secara gratis sesuai kesepakatan.",
    image: "/assets/walkthrough/wl-2.svg",
    sprinkleCount: 4,
  },
  {
    title: "Kirim Sesuka Kamu",
    description:
      "Atur cara serah-terima yang paling nyaman. Kamu bisa COD, menggunakan kurir, atau mengambil langsung dari pemilik buku.",
    image: "/assets/walkthrough/wl-3.svg",
    sprinkleCount: 6,
  },
];

export default function Walkthrough({ onFinish }: WalkthroughProps) {
  const { loginWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStep, setDisplayStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Handle step transition with animation
  useEffect(() => {
    if (currentStep !== displayStep) {
      setIsTransitioning(true);
      // Wait for fade out, then change content and fade in
      const timer = setTimeout(() => {
        setDisplayStep(currentStep);
        // Reset transition state after content change
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300); // Half of animation duration
      return () => clearTimeout(timer);
    }
  }, [currentStep, displayStep]);

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last Step: trigger Google Login directly
      setIsLoading(true);
      try {
        await loginWithGoogle();
        onFinish();
      } catch (error) {
        console.error("Google login failed during walkthrough:", error);
        // If failed, maybe just proceed to manual sign in or show error?
        // Current flow: we want google login here. If it fails, we prob still go to sign in form but let's let success drive it.
        // Actually, on successfully login, we proceed.
        // If failure, we might want to manually fallback to onFinish() to show form? 
        // For now let's assume if google fails, we fallback to manual form.
        onFinish();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-between min-h-screen bg-brand-white relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center w-full px-8 pb-16">
        <div className="relative w-full h-60 mb-8">
          <div
            key={displayStep}
            className={`absolute inset-0 ${isTransitioning ? "opacity-0 scale-95" : "animate-scale-fade"}`}
            style={{
              transition: isTransitioning ? "opacity 0.3s ease-out, transform 0.3s ease-out" : "none"
            }}
          >
            <Image
              src={steps[displayStep].image}
              alt={steps[displayStep].title}
              fill
              className="object-contain"
              priority
            />

            {/* Dynamic Sprinkles */}
            {Array.from({ length: steps[displayStep].sprinkleCount }).map(
              (_, index) => (
                <div
                  key={`${displayStep}-${index}`}
                  className={`sprinkle sprinkle-${displayStep}-${index} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Image
                    src="/assets/walkthrough/sprinkle.svg"
                    alt="decoration"
                    fill
                    className="object-contain"
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex gap-1 my-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep ? "w-10 bg-brand-red" : "w-4 bg-brand-red/15"
                }`}
            />
          ))}
        </div>

        {/* Text Content */}
        <div
          key={`text-${displayStep}`}
          className={`text-center space-y-4 max-w-xs ${isTransitioning ? "opacity-0 translate-x-4" : "animate-slide-fade"}`}
          style={{
            transition: isTransitioning ? "opacity 0.3s ease-out, transform 0.3s ease-out" : "none"
          }}
        >
          <h2 className="text-2xl font-medium text-brand-black font-sans">
            {steps[displayStep].title}
          </h2>
          <p className="text-brand-gray font-regular text-sm">
            {steps[displayStep].description}
          </p>
        </div>
      </div>

      {/* Navigation & Controls */}
      <BottomContainer>
        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 border border-brand-gray/30 rounded-xl py-3 text-sm font-medium hover:bg-gray-50 active:scale-[0.98] transition disabled:opacity-60 text-brand-black"
          >
            <GoogleIcon className="w-5 h-5" />
            {isLoading ? "Menghubungkan..." : "Masuk dengan Google"}
          </button>
        ) : (
          <Button
            onClick={handleNext}
            variant="primary"
            fullWidth
            className="flex items-center justify-center gap-3"
          >
            Lanjut
          </Button>
        )}
      </BottomContainer>
    </div>
  );
}

