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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.5900, lng: 110.6700 },
        bio: "Pecinta sejati buku fiksi, sejarah, dan novel klasik. Suka berdiskusi tentang buku sambil minum kopi.",
        locationLabel: "Panggang, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.6200, lng: 110.6800 },
        locationLabel: "Tahunan, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.5300, lng: 110.7000 },
        locationLabel: "Mlonggo, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.6300, lng: 110.7200 },
        locationLabel: "Batealit, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.7400, lng: 110.7500 },
        locationLabel: "Mayong, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.7000, lng: 110.7000 },
        locationLabel: "Pecangaan, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.7700, lng: 110.6500 },
        locationLabel: "Welahan, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.4600, lng: 110.8500 },
        locationLabel: "Keling, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -6.5000, lng: 110.8000 },
        locationLabel: "Kembang, Jepara, Jawa Tengah",
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
            province: "Jawa Tengah"
        },
        coordinates: { lat: -5.8500, lng: 110.4300 },
        locationLabel: "Karimunjawa, Jepara, Jawa Tengah",
        onboardingCompleted: true,
    },
];
