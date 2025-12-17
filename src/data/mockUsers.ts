import { User } from "@/types/user";

export interface MockUser extends User {
  location: string; // Formatting: "District, Regency, Province"
  isVerified: boolean;
  joinDate: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "user1",
    uid: "user1",
    name: "Nadia Putri",
    avatar: "G1.png",
    location: "Panggang, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "Januari 2024",
    address: {
      district: "Panggang",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Panggang",
    },
    coordinates: { lat: -6.59, lng: 110.67 },
    bio: "Pecinta sejati buku fiksi, sejarah, dan novel klasik. Suka berdiskusi tentang buku sambil minum kopi.",

    onboardingCompleted: true,
  },
  {
    id: "user2",
    uid: "user2",
    name: "Jiddan Yudistira",
    avatar: "B1.png",
    location: "Tahunan, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "Februari 2024",
    address: {
      district: "Tahunan",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Tahunan",
    },
    coordinates: { lat: -6.62, lng: 110.68 },

    onboardingCompleted: true,
  },
  {
    id: "user3",
    uid: "user3",
    name: "Arvel Santoso",
    avatar: "B2.png",
    location: "Mlonggo, Jepara, Jawa Tengah",
    isVerified: false,
    joinDate: "Maret 2024",
    address: {
      district: "Mlonggo",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Mlonggo",
    },
    coordinates: { lat: -6.53, lng: 110.7 },

    onboardingCompleted: true,
  },
  {
    id: "user4",
    uid: "user4",
    name: "Raka Hidayat",
    avatar: "B3.png",
    location: "Batealit, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "Maret 2024",
    address: {
      district: "Batealit",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Batealit",
    },
    coordinates: { lat: -6.63, lng: 110.72 },

    onboardingCompleted: true,
  },
  {
    id: "user5",
    uid: "user5",
    name: "Dilla Maharani",
    avatar: "G2.png",
    location: "Mayong, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "April 2024",
    address: {
      district: "Mayong",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Mayong",
    },
    coordinates: { lat: -6.74, lng: 110.75 },

    onboardingCompleted: true,
  },
  {
    id: "user6",
    uid: "user6",
    name: "Siti Aminah",
    avatar: "G3.png",
    location: "Pecangaan, Jepara, Jawa Tengah",
    isVerified: false,
    joinDate: "Mei 2024",
    address: {
      district: "Pecangaan",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Pecangaan",
    },
    coordinates: { lat: -6.7, lng: 110.7 },

    onboardingCompleted: true,
  },
  {
    id: "user7",
    uid: "user7",
    name: "Budi Santoso",
    avatar: "B4.png",
    location: "Welahan, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "Juni 2024",
    address: {
      district: "Welahan",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Welahan",
    },
    coordinates: { lat: -6.77, lng: 110.65 },

    onboardingCompleted: true,
  },
  {
    id: "user8",
    uid: "user8",
    name: "Citra Kirana",
    avatar: "G4.png",
    location: "Keling, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "Juli 2024",
    address: {
      district: "Keling",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Keling",
    },
    coordinates: { lat: -6.46, lng: 110.85 },

    onboardingCompleted: true,
  },
  {
    id: "user9",
    uid: "user9",
    name: "Dewi Lestari",
    avatar: "G1.png",
    location: "Kembang, Jepara, Jawa Tengah",
    isVerified: false,
    joinDate: "Agustus 2024",
    address: {
      district: "Kembang",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Kembang",
    },
    coordinates: { lat: -6.5, lng: 110.8 },

    onboardingCompleted: true,
  },
  {
    id: "user10",
    uid: "user10",
    name: "Eko Prasetyo",
    avatar: "B5.png",
    location: "Karimunjawa, Jepara, Jawa Tengah",
    isVerified: true,
    joinDate: "September 2024",
    address: {
      district: "Karimunjawa",
      regency: "Jepara",
      province: "Jawa Tengah",
      village: "Karimunjawa",
    },
    coordinates: { lat: -5.85, lng: 110.43 },

    onboardingCompleted: true,
  },
];
