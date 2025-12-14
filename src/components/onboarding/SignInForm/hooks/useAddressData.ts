import { useState, useEffect } from "react";
import { Region } from "../types";

export type UseAddressDataReturn = ReturnType<typeof useAddressData>;

export function useAddressData() {
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await fetch(`/api/wilayah/provinces`);
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const data = await response.json();
      setProvinces(data.data || []);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const handleProvinceChange = async (value: string) => {
    setSelectedProvince(value);
    setSelectedRegency("");
    setSelectedDistrict("");
    setSelectedVillage("");
    setRegencies([]);
    setDistricts([]);
    setVillages([]);

    if (value) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/wilayah/regencies/${value}`);
        const data = await response.json();
        setRegencies(data.data || []);
      } catch (error) {
        console.error("Error fetching regencies:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegencyChange = async (value: string) => {
    setSelectedRegency(value);
    setSelectedDistrict("");
    setSelectedVillage("");
    setDistricts([]);
    setVillages([]);

    if (value) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/wilayah/districts/${value}`);
        const data = await response.json();
        setDistricts(data.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDistrictChange = async (value: string) => {
    setSelectedDistrict(value);
    setSelectedVillage("");
    setVillages([]);

    if (value) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/wilayah/villages/${value}`);
        const data = await response.json();
        setVillages(data.data || []);
      } catch (error) {
        console.error("Error fetching villages:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVillageChange = (value: string) => {
    setSelectedVillage(value);
  };

  return {
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
  };
}
