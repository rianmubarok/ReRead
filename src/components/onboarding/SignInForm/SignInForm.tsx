import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { TOTAL_STEPS } from "./constants";
import Step1NameAddress from "./Step1NameAddress";
import Step2Avatar from "./Step2Avatar";
import Step3Location from "./Step3Location";
import { useAddressData } from "./hooks/useAddressData";

interface SignInFormProps {
  onFinish: () => void;
}

export default function SignInForm({ onFinish }: SignInFormProps) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string>("google");
  const [isLoading, setIsLoading] = useState(false);

  const addressData = useAddressData();
  const {
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
  } = addressData;

  const handleNext = async () => {
    if (step < TOTAL_STEPS) {
      // Validation for Step 1
      if (step === 1) {
        if (
          !name ||
          !selectedProvince ||
          !selectedRegency ||
          !selectedDistrict ||
          !selectedVillage
        ) {
          toast.error("Mohon lengkapi semua data diri dan alamat.", {
            duration: 3000,
            icon: "⚠️",
          });
          return;
        }
      }
      setStep(step + 1);
    } else {
      // Final Step (Location) -> Submit
      setIsLoading(true);
      try {
        await login(name, selectedAvatar, {
          province: selectedProvince,
          regency: selectedRegency,
          district: selectedDistrict,
          village: selectedVillage,
        });
        onFinish();
      } catch (error) {
        console.error("Login Error", error);
      } finally {
        setIsLoading(false);
      }
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
      <div className="w-full px-8 pt-12 pb-16">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= index + 1 ? "bg-brand-red" : "bg-brand-red/15"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 overflow-y-auto pb-32">
        {step === 1 && (
          <Step1NameAddress
            name={name}
            onNameChange={setName}
            addressData={addressData}
          />
        )}

        {step === 2 && (
          <Step2Avatar
            selectedAvatar={selectedAvatar}
            onAvatarChange={setSelectedAvatar}
          />
        )}

        {step === 3 && <Step3Location />}
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
          disabled={isLoading}
          className="flex-1 bg-brand-red text-white py-4 rounded-xl font-semibold text-sm active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Memproses..." : "Lanjut"}
        </button>
      </div>
    </div>
  );
}

