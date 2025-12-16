import React from "react";
import UserIcon from "@/components/icons/UserIcon";
import SearchableDropdown from "@/components/ui/SearchableDropdown";
import { UseAddressDataReturn } from "./hooks/useAddressData";

import GoogleIcon from "@/components/icons/GoogleIcon";

interface Step1NameAddressProps {
  name: string;
  onNameChange: (name: string) => void;
  addressData: UseAddressDataReturn;
}

export default function Step1NameAddress({
  name,
  onNameChange,
  addressData,
}: Step1NameAddressProps) {
  const {
    provinces,
    regencies,
    districts,
    villages,
    selectedProvince,
    selectedRegency,
    selectedDistrict,
    selectedVillage,
    isLoading,
    handleProvinceChange,
    handleRegencyChange,
    handleDistrictChange,
    handleVillageChange,
  } = addressData;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-medium text-brand-black">
          Selamat Datang <br />
          di ReRead
        </h1>
        <p className="text-sm text-brand-gray">
          Silakan lengkapi data berikut ya!
        </p>
      </div>

      {/* Form */}
      <div className="space-y-8">

        {/* Nama Lengkap */}
        <div>
          <p className="text-sm text-brand-black font-medium mb-4">
            Nama Lengkap
          </p>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black z-10 pointer-events-none">
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Masukkan nama"
              className="w-full bg-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm text-brand-black placeholder:text-brand-gray focus:outline-none focus:ring-1 focus:ring-brand-red/50"
              required
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <p className="text-sm text-brand-black font-medium mb-4">Alamat</p>
          <div className="grid grid-cols-2 gap-3">
            {/* Provinsi */}
            <SearchableDropdown
              options={provinces}
              value={selectedProvince}
              onChange={handleProvinceChange}
              placeholder="Provinsi"
            />

            {/* Kabupaten */}
            <SearchableDropdown
              options={regencies}
              value={selectedRegency}
              onChange={handleRegencyChange}
              placeholder="Kabupaten"
              disabled={!selectedProvince}
              isLoading={isLoading && !regencies.length && !!selectedProvince}
            />

            {/* Kecamatan */}
            <SearchableDropdown
              options={districts}
              value={selectedDistrict}
              onChange={handleDistrictChange}
              placeholder="Kecamatan"
              disabled={!selectedRegency}
              isLoading={isLoading && !districts.length && !!selectedRegency}
            />

            {/* Desa */}
            <SearchableDropdown
              options={villages}
              value={selectedVillage}
              onChange={handleVillageChange}
              placeholder="Desa"
              disabled={!selectedDistrict}
              isLoading={isLoading && !villages.length && !!selectedDistrict}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
