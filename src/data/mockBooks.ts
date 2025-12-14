export interface Book {
    id: string;
    title: string;
    author: string;
    image: string; // Placeholder URL or local path
    location?: string;
    distance?: string;
    category: "Fiksi" | "Non-Fiksi" | "Pendidikan";
    isTrending?: boolean;
}

export const MOCK_BOOKS: Book[] = [
    {
        id: "1",
        title: "Sapiens Grafis",
        author: "Yuval Noah Harari",
        image: "",
        location: "2 km dari lokasimu",
        distance: "2 km",
        category: "Non-Fiksi",
    },
    {
        id: "2",
        title: "Makanya, Mikir!",
        author: "Abigail Limuria",
        image: "",
        location: "5 km dari lokasimu",
        distance: "5 km",
        category: "Non-Fiksi",
    },
    {
        id: "3",
        title: "Thinking, Fast and Slow",
        author: "Daniel Kahneman",
        image: "",
        location: "11 km dari lokasimu",
        distance: "11 km",
        category: "Non-Fiksi",
    },
    {
        id: "4",
        title: "Design of Everyday Things",
        author: "Don Norman",
        image: "",
        location: "12 km dari lokasimu",
        distance: "12 km",
        category: "Non-Fiksi",
    },
    {
        id: "5",
        title: "Show Your Work!",
        author: "Austin Kleon",
        image: "",
        location: "15 km dari lokasimu",
        distance: "15 km",
        category: "Non-Fiksi",
    },
    // Trending
    {
        id: "6",
        title: "Madilog",
        author: "Tan Malaka",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
    },
    {
        id: "7",
        title: "The Psychology of Money",
        author: "Morgan Housel",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
    },
    {
        id: "8",
        title: "Atomic Habits",
        author: "James Clear",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
    },
    {
        id: "9",
        title: "Filosofi Teras",
        author: "Henry Manampiring",
        image: "",
        category: "Non-Fiksi",
        isTrending: true,
    },
    {
        id: "10",
        title: "Laut Bercerita",
        author: "Leila S. Chudori",
        image: "",
        category: "Fiksi",
        isTrending: true,
    }
];
