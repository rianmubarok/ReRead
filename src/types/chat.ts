/**
 * Chat-related types for the application
 * These types are designed to work with both mock data and database
 */

import { User } from "./user";
import { Book } from "./book";
import type { MockUser } from "@/data/mockUsers";

/**
 * Database schema types (what comes from Supabase)
 */
export interface DatabaseMessage {
  id: string;
  chat_id: string;
  sender_id: string; // User ID of the sender
  text: string;
  book_id?: string | null; // Optional: if message is related to a book
  created_at: string; // ISO timestamp
  updated_at: string;
  is_read: boolean;
}

export interface DatabaseChatThread {
  id: string;
  user_id: string; // The other user in the chat
  book_id?: string | null; // Optional book context if chat started from a book
  last_message: string;
  last_message_at: string; // ISO timestamp
  unread_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Frontend types (what the UI uses)
 * These are derived from database types with computed fields
 */
export interface ChatMessage {
  id: string;
  text: string;
  senderId: string; // User ID - will be compared with current user to determine "me" vs "them"
  timestamp: Date;
  bookId?: string; // Optional: if message is related to a book
  isRead?: boolean; // Optional: for read status
  messageType?: "text" | "exchange_request" | "exchange_completed";
  exchangeRequest?: {
    bookId: string;
    bookTitle: string;
    bookImage: string;
    status: "pending" | "completed" | "cancelled";
  };
}

/**
 * Computed message type with sender info
 * Used in MessageBubble component
 */
export interface ChatMessageWithSender extends ChatMessage {
  isMe: boolean; // Computed: senderId === currentUserId
  sender?: User; // Optional: sender user info
}

export interface ChatThread {
  id: string;
  user: User; // The other user in the chat
  lastMessage: string;
  timestamp: string; // Formatted timestamp for display
  unreadCount: number;
  bookContext?: Book; // Optional book context if the chat started from a book
  // Note: messages are loaded separately, not included in thread
}

/**
 * Legacy types for mock data compatibility
 * @deprecated Use ChatMessage and ChatThread instead
 */
export interface LegacyMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  messageType?: "text" | "exchange_request" | "exchange_completed";
  exchangeRequest?: {
    bookId: string;
    bookTitle: string;
    bookImage: string;
    status: "pending" | "completed" | "cancelled";
  };
}

export interface LegacyChatThread {
  id: string;
  user: MockUser; // Use MockUser type for legacy compatibility
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  bookContext?: Book;
  messages: LegacyMessage[];
}
