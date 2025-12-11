import React, { useState } from "react";
import Image from "next/image";
import GoogleIcon from "./icons/GoogleIcon";

interface WalkthroughProps {
    onFinish: () => void;
}

const steps = [
    {
        title: "Cari Buku di Sekitarmu",
        description: "Temukan buku dari pengguna terdekat. Izinkan lokasi agar kamu bisa melihat koleksi yang mudah dijangkau.",
        image: "/assets/walkthrough/wl-1.svg",
        sprinkleCount: 6,
    },
    {
        title: "Negosiasi Sepuasnya",
        description: "Hubungi pemilik buku dan tentukan sendiri harganya. Kamu bisa menawar, barter, atau mengambilnya secara gratis sesuai kesepakatan.",
        image: "/assets/walkthrough/wl-2.svg",
        sprinkleCount: 4,
    },
    {
        title: "Kirim Sesuka Kamu",
        description: "Atur cara serah-terima yang paling nyaman. Kamu bisa COD, menggunakan kurir, atau mengambil langsung dari pemilik buku.",
        image: "/assets/walkthrough/wl-3.svg",
        sprinkleCount: 6,
    },
];

export default function Walkthrough({ onFinish }: WalkthroughProps) {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };

    return (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-between min-h-screen bg-brand-white relative overflow-hidden">
            <div className="flex-1 flex flex-col items-center justify-center w-full px-8">
                <div className="relative w-full h-60 mb-8">
                    <Image
                        src={steps[currentStep].image}
                        alt={steps[currentStep].title}
                        fill
                        className="object-contain transition-all duration-500"
                        priority
                    />

                    {/* Dynamic Sprinkles */}
                    {Array.from({ length: steps[currentStep].sprinkleCount }).map((_, index) => (
                        <div
                            key={index}
                            className={`sprinkle sprinkle-${currentStep}-${index}`}
                        >
                            <Image
                                src="/assets/walkthrough/sprinkle.svg"
                                alt="decoration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex gap-1 my-8">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-4 h-2 rounded-full transition-all duration-300 ${index === currentStep ? "w-8 bg-brand-red" : "bg-brand-red/15"
                                }`}
                        />
                    ))}
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 max-w-xs animate-fade-in-up">
                    <h2 className="text-2xl font-medium text-brand-black font-sans">{steps[currentStep].title}</h2>
                    <p className="text-brand-gray font-regular text-sm">{steps[currentStep].description}</p>
                </div>
            </div>

            {/* Navigation & Controls */}
            <div className="w-full px-8 pb-12 flex flex-col gap-6 items-center">
                {/* Buttons */}
                <div className="w-full space-y-5">
                    <button
                        onClick={handleNext}
                        className={`w-full py-4 text-sm font-semibold rounded-xl active:scale-95 transition-transform flex items-center justify-center gap-3 ${currentStep === steps.length - 1
                            ? "bg-brand-red/15 text-brand-red"
                            : "bg-brand-red text-white"
                            }`}
                    >
                        {currentStep === steps.length - 1 && <GoogleIcon className="w-6 h-6" />}
                        {currentStep === steps.length - 1 ? "Masuk Menggunakan Google" : "Lanjut"}
                    </button>
                </div>
            </div>
        </div>
    );
}
