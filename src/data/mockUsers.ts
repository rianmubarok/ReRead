export interface User {
    id: string;
    name: string;
    avatar: string;
    location: string;
    isVerified: boolean;
    joinDate: string;
    rating: number;
}

export const MOCK_USERS: User[] = [
    {
        id: "user1",
        name: "Nadia Putri",
        avatar: "G1.png",
        location: "Panggang, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "Januari 2024",
        rating: 4.8,
    },
    {
        id: "user2",
        name: "Jiddan Yudistira",
        avatar: "B1.png",
        location: "Tahunan, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "Februari 2024",
        rating: 4.5,
    },
    {
        id: "user3",
        name: "Arvel Santoso",
        avatar: "B2.png",
        location: "Mlonggo, Jepara, Jawa Tengah",
        isVerified: false,
        joinDate: "Maret 2024",
        rating: 4.0,
    },
    {
        id: "user4",
        name: "Raka Hidayat",
        avatar: "B3.png",
        location: "Batealit, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "Maret 2024",
        rating: 4.9,
    },
    {
        id: "user5",
        name: "Dilla Maharani",
        avatar: "G2.png",
        location: "Mayong, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "April 2024",
        rating: 4.7,
    },
    {
        id: "user6",
        name: "Siti Aminah",
        avatar: "G3.png",
        location: "Pecangaan, Jepara, Jawa Tengah",
        isVerified: false,
        joinDate: "Mei 2024",
        rating: 4.2,
    },
    {
        id: "user7",
        name: "Budi Santoso",
        avatar: "B4.png",
        location: "Welahan, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "Juni 2024",
        rating: 4.6,
    },
    {
        id: "user8",
        name: "Citra Kirana",
        avatar: "G4.png",
        location: "Keling, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "Juli 2024",
        rating: 4.8,
    },
    {
        id: "user9",
        name: "Dewi Lestari",
        avatar: "G1.png",
        location: "Kembang, Jepara, Jawa Tengah",
        isVerified: false,
        joinDate: "Agustus 2024",
        rating: 4.3,
    },
    {
        id: "user10",
        name: "Eko Prasetyo",
        avatar: "B5.png",
        location: "Karimunjawa, Jepara, Jawa Tengah",
        isVerified: true,
        joinDate: "September 2024",
        rating: 4.7,
    },
];
