export interface Book {
    id: string;
    title: string;
    author: string;
    image: string; // Placeholder URL or local path
    location?: string;
    distance?: string;
    category: "Fiksi" | "Non-Fiksi" | "Pendidikan" | "Komik" | "Sastra";
    isTrending?: boolean;
    description: string;
    condition: "Baru" | "Baik" | "Bekas";
    owner: {
        id: string;
        name: string;
        avatar: string; // 'google' or path
        location: string;
        isVerified?: boolean;
    };
}

const DEFAULT_OWNER = {
    id: "user1",
    name: "Nadia Putri",
    avatar: "avatar_nadia.png", // We'll need to mock this or use placeholder
    location: "Panggang, Jepara, Jawa Tengah",
    isVerified: true
};

const DEFAULT_DESC = `Buku ini menurutku cukup membantu waktu aku lagi belajar memperbaiki cara berpikir dan membuat keputusan. Isinya ringan dan banyak contoh yang relevan, jadi enak dibaca. Sekarang aku sudah selesai membacanya dan ingin buku ini bermanfaat buat orang lain juga, jadi aku putuskan untuk melepasnya di sini.

Kondisi buku masih bagus, tidak ada coretan di dalam, hanya sedikit tanda pemakaian wajar.
Untuk pengambilan, aku lebih cocok ketemuan langsung di area sekitar Jepara, tapi kalau kamu butuh dikirim juga bisa dibicarakan lewat chat.
Harga atau pertukarannya fleksibel, boleh dinegosiasi atau kalau kamu benar-benar butuh bisa aku berikan gratis.

Silakan chat kalau mau tanya-tanya atau mau lihat foto tambahan.`;

export const MOCK_BOOKS: Book[] = [
    {
        id: "1",
        title: "Sapiens Grafis",
        author: "Yuval Noah Harari",
        image: "",
        location: "2 km dari lokasimu",
        distance: "2 km",
        category: "Non-Fiksi",
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    },
    {
        id: "2",
        title: "Makanya, Mikir!",
        author: "Abigail Limuria & Cania Citta",
        image: "",
        location: "5 km dari lokasimu",
        distance: "5 km",
        category: "Non-Fiksi",
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    },
    {
        id: "3",
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        image: "",
        location: "11 km dari lokasimu",
        distance: "11 km",
        category: "Non-Fiksi",
        description: DEFAULT_DESC,
        condition: "Bekas",
        owner: DEFAULT_OWNER
    },
    {
        id: "4",
        title: "Design of Everyday Things",
        author: "Don Norman",
        image: "",
        location: "12 km dari lokasimu",
        distance: "12 km",
        category: "Non-Fiksi",
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    },
    {
        id: "5",
        title: "Show Your Work!",
        author: "Austin Kleon",
        image: "",
        location: "15 km dari lokasimu",
        distance: "15 km",
        category: "Non-Fiksi",
        description: DEFAULT_DESC,
        condition: "Baru",
        owner: DEFAULT_OWNER
    },
    // Trending
    {
        id: "6",
        title: "Madilog",
        author: "Tan Malaka",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
        description: DEFAULT_DESC,
        condition: "Bekas",
        owner: DEFAULT_OWNER
    },
    {
        id: "7",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
        description: DEFAULT_DESC,
        condition: "Baru",
        owner: DEFAULT_OWNER
    },
    {
        id: "8",
        title: "Atomic Habits",
        author: "James Clear",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    },
    {
        id: "9",
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    },
    {
        id: "10",
        title: "Laut Bercerita",
        author: "Leila S. Chudori",
        image: "",
        category: "Fiksi",
        isTrending: true,
        description: DEFAULT_DESC,
        condition: "Baik",
        owner: DEFAULT_OWNER
    }
];
