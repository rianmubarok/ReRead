export interface ChatThread {
    id: string;
    user: {
        name: string;
        avatar: string; // 'google' or filename or url
    };
    lastMessage: string;
    timestamp: string;
    unreadCount?: number;
}

export const MOCK_CHATS: ChatThread[] = [
    {
        id: "1",
        user: { name: "Nadia Putri", avatar: "google" }, // Using google placeholder style matches design somewhat or custom
        // Design shows specific avatars. I'll use placeholders or existing assets if available.
        // For now, I'll use 'google' style or assume assets exist.
        // The design has diverse avatars. I will map them to the avatar assets I saw earlier if possible, or random.
        lastMessage: "Besok segera saya kirim",
        timestamp: "09:12",
        unreadCount: 0
    },
    {
        id: "2",
        user: { name: "Jiddan Yudistira Sudibyo", avatar: "avatar_2.png" },
        lastMessage: "Masih bagus kak",
        timestamp: "Kemarin",
        unreadCount: 0
    },
    {
        id: "3",
        user: { name: "Arvel Santoso", avatar: "avatar_3.png" },
        lastMessage: "Tukar sama buku punyaku boleh kak?",
        timestamp: "Senin",
        unreadCount: 0
    },
    {
        id: "4",
        user: { name: "Raka Hidayat", avatar: "avatar_4.png" },
        lastMessage: "Ok",
        timestamp: "07/12/25",
        unreadCount: 0
    },
    {
        id: "5",
        user: { name: "Dilla Maharani", avatar: "avatar_5.png" },
        lastMessage: "Terimakasih",
        timestamp: "07/12/25",
        unreadCount: 0
    }
];
