/**
 * Mapping utilities for converting between database and frontend types
 */

import {
  DatabaseMessage,
  DatabaseChatThread,
  ChatMessage,
  ChatThread,
  ChatMessageWithSender,
} from "@/types/chat";
import { User } from "@/types/user";
import { Book } from "@/types/book";

/**
 * Convert database message to frontend ChatMessage
 */
export function mapDatabaseMessageToChatMessage(
  dbMessage: DatabaseMessage,
  currentUserId?: string
): ChatMessage {
  return {
    id: dbMessage.id,
    text: dbMessage.text,
    senderId: dbMessage.sender_id,
    timestamp: new Date(dbMessage.created_at),
    bookId: dbMessage.book_id || undefined,
    isRead: dbMessage.is_read,
  };
}

/**
 * Convert frontend ChatMessage to database format
 */
export function mapChatMessageToDatabase(
  message: ChatMessage,
  chatId: string
): Omit<DatabaseMessage, "id" | "created_at" | "updated_at"> {
  return {
    chat_id: chatId,
    sender_id: message.senderId,
    text: message.text,
    book_id: message.bookId || null,
    is_read: message.isRead ?? false,
  };
}

/**
 * Convert database chat thread to frontend ChatThread
 * Requires user and book data to be fetched separately
 */
export function mapDatabaseChatThreadToChatThread(
  dbThread: DatabaseChatThread,
  otherUser: User,
  bookContext?: Book
): ChatThread {
  return {
    id: dbThread.id,
    user: otherUser,
    lastMessage: dbThread.last_message,
    timestamp: formatThreadTimestamp(dbThread.last_message_at),
    unreadCount: dbThread.unread_count,
    bookContext,
  };
}

/**
 * Add computed fields to ChatMessage for UI rendering
 */
export function enrichMessageWithSender(
  message: ChatMessage,
  currentUserId: string,
  sender?: User
): ChatMessageWithSender {
  return {
    ...message,
    isMe: message.senderId === currentUserId,
    sender,
  };
}

/**
 * Format timestamp for chat thread list display
 */
function formatThreadTimestamp(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    // Today - show time
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (diffDays === 1) {
    return "Kemarin";
  } else if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  } else {
    // Show date
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }
}

/**
 * Helper to determine if message is from current user
 */
export function isMessageFromMe(
  message: ChatMessage,
  currentUserId: string
): boolean {
  return message.senderId === currentUserId;
}
