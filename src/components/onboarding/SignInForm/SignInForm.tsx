import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { TOTAL_STEPS } from "./constants";
import Step1NameAddress from "./Step1NameAddress";
import Step2Avatar from "./Step2Avatar";
import Step3Location from "./Step3Location";
import { useAddressData } from "./hooks/useAddressData";
import BottomContainer from "@/components/ui/BottomContainer";
import Button from "@/components/ui/Button";

interface SignInFormProps {
  onFinish: () => void;
}

export default function SignInForm({ onFinish }: SignInFormProps) {
  const { login } = useAuth();
  const [step, setStep] = useState(1);
  const [displayStep, setDisplayStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Handle step transition with animation
  useEffect(() => {
    if (step !== displayStep) {
      setIsTransitioning(true);
      // Wait for fade out, then change content and fade in
      const timer = setTimeout(() => {
        setDisplayStep(step);
        // Reset transition state after content change
        setTimeout(() => {
          setIsTransitioning(false);
        }, 50);
      }, 300); // Half of animation duration
      return () => clearTimeout(timer);
    }
  }, [step, displayStep]);

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
        const provinceName = addressData.provinces.find(p => p.code === selectedProvince)?.name || selectedProvince;
        const regencyName = addressData.regencies.find(r => r.code === selectedRegency)?.name || selectedRegency;
        const districtName = addressData.districts.find(d => d.code === selectedDistrict)?.name || selectedDistrict;
        const villageName = addressData.villages.find(v => v.code === selectedVillage)?.name || selectedVillage;

        await login(name, selectedAvatar, {
          province: provinceName,
          regency: regencyName,
          district: districtName,
          village: villageName,
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
      <div className="w-full px-8 pt-6 pb-16">
        <div className="flex gap-2">
          {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
            <div
              key={index}
              className={`h-1.5 flex-1 rounded-full transition-colors ${step >= index + 1 ? "bg-brand-red" : "bg-brand-red/15"
                }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-8 overflow-y-auto pb-32 relative">
        <div
          key={displayStep}
          className={isTransitioning ? "opacity-0 -translate-x-4" : "animate-slide-fade"}
          style={{
            transition: isTransitioning ? "opacity 0.3s ease-out, transform 0.3s ease-out" : "none"
          }}
        >
          {displayStep === 1 && (
            <Step1NameAddress
              name={name}
              onNameChange={setName}
              addressData={addressData}
            />
          )}

          {displayStep === 2 && (
            <Step2Avatar
              selectedAvatar={selectedAvatar}
              onAvatarChange={setSelectedAvatar}
            />
          )}

          {displayStep === 3 && <Step3Location />}
        </div>
      </div>

      {/* Bottom Button */}
      <BottomContainer className="gap-4">
        {step > 1 && (
          <Button variant="outline" fullWidth onClick={handleBack} className="flex-1">
            Kembali
          </Button>
        )}
        <Button
          variant="primary"
          fullWidth
          onClick={handleNext}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? "Memproses..." : "Lanjut"}
        </Button>
      </BottomContainer>
    </div>
  );
}

