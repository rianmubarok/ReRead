import { MOCK_USERS, User } from "./mockUsers";
import { MOCK_BOOKS, Book } from "./mockBooks";
import { LegacyMessage, LegacyChatThread } from "@/types/chat";

// Re-export types for backward compatibility
export type Message = LegacyMessage;
export type ChatThread = LegacyChatThread;

// Export legacy types directly
// export { LegacyMessage as Message, LegacyChatThread as ChatThread };

export const MOCK_CHATS: LegacyChatThread[] = [
    {
        id: "chat1",
        user: MOCK_USERS[0], // user1: Nadia Putri
        lastMessage: "Besok segera saya kirim ya kak, ditunggu resinya.",
        timestamp: "09:12",
        unreadCount: 2,
        bookContext: MOCK_BOOKS[0], // Sapiens Grafis
        messages: [
            {
                id: "m1",
                senderId: "me",
                text: "Halo kak, buku Sapiens Grafis ini masih ada?",
                timestamp: "08:30",
                isRead: true,
            },
            {
                id: "m2",
                senderId: "user1",
                text: "Masih kak, silakan.",
                timestamp: "08:45",
                isRead: true,
            },
            {
                id: "m3",
                senderId: "me",
                text: "Kondisinya gimana kak? Ada sobek atau coretan?",
                timestamp: "08:46",
                isRead: true,
            },
            {
                id: "m4",
                senderId: "user1",
                text: "Mulus banget kak, baru baca sekali aja.",
                timestamp: "08:50",
                isRead: true,
            },
            {
                id: "m5",
                senderId: "me",
                text: "Oke saya ambil ya. Bisa kirim besok?",
                timestamp: "09:00",
                isRead: true,
            },
            {
                id: "m6",
                senderId: "user1",
                text: "Siap, bisa kak.",
                timestamp: "09:05",
                isRead: true,
            },
            {
                id: "m7",
                senderId: "user1",
                text: "Besok segera saya kirim ya kak, ditunggu resinya.",
                timestamp: "09:12",
                isRead: false,
            },
        ],
    },
    {
        id: "chat2",
        user: MOCK_USERS[1], // user2: Jiddan
        lastMessage: "Masih bagus kok bukunya, jarang dibaca.",

        timestamp: "Kemarin",
        unreadCount: 0,
        // bookContext removed to reduce visual noise
        messages: [
            {
                id: "m1",
                senderId: "me",
                text: "Halo, buku Makanya, Mikir! ini edisi tahun berapa ya?",
                timestamp: "09:30",
                isRead: true,
            },
            {
                id: "m2",
                senderId: "user2",
                text: "Halo, ini cetakan 2023 kak.",
                timestamp: "09:35",
                isRead: true,
            },
            {
                id: "m3",
                senderId: "me",
                text: "Kondisinya gimana kak?",
                timestamp: "09:36",
                isRead: true,
            },
            {
                id: "m4",
                senderId: "user2",
                text: "Masih bagus kok bukunya, jarang dibaca.",
                timestamp: "09:40",
                isRead: true,
            },
        ],
    },
    {
        id: "chat3",
        user: MOCK_USERS[2], // user3: Arvel
        lastMessage: "Boleh nego tipis nggak kak?",

        timestamp: "10/12/25",
        unreadCount: 1,
        // bookContext removed
        messages: [
            {
                id: "m1",
                senderId: "user3",
                text: "Halo kak, buku Thinking Fast & Slow nya ready?",
                timestamp: "14:20",
                isRead: true,
            },
            {
                id: "m2",
                senderId: "me",
                text: "Ready kak, silakan diorder.",
                timestamp: "14:25",
                isRead: true,
            },
            {
                id: "m3",
                senderId: "user3",
                text: "Boleh nego tipis nggak kak?",
                timestamp: "14:30",
                isRead: false,
            },
        ],
    },
    {
        id: "chat4",
        user: MOCK_USERS[3], // user4: Raka
        lastMessage: "Siap, kabari kalau sudah sampai ya.",
        timestamp: "07/12/25",
        unreadCount: 0,
        messages: [
            {
                id: "m1",
                senderId: "me",
                text: "Kak paketnya sudah saya kirim ya.",
                timestamp: "10:00",
                isRead: true,
            },
            {
                id: "m2",
                senderId: "user4",
                text: "Siap, kabari kalau sudah sampai ya.",
                timestamp: "10:05",
                isRead: true,
            },
        ],
    },
    {
        id: "chat5",
        user: MOCK_USERS[4], // user5: Dilla
        lastMessage: "Terimakasih kembali!",
        timestamp: "07/12/25",
        unreadCount: 0,
        messages: [],
    },
    {
        id: "chat6",
        user: MOCK_USERS[5], // user6
        lastMessage: "Wah kejauhan kalau COD di situ.",
        timestamp: "05/12/25",
        unreadCount: 0,
        messages: [],
    },
    {
        id: "chat7",
        user: MOCK_USERS[6], // user7
        lastMessage: "Kalau barter sama buku saya mau?",
        timestamp: "01/12/25",
        unreadCount: 0,
        messages: [],
    },
];
