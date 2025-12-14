"use client";

import { create } from "zustand";
import { ChatMessage } from "@/types/chat";

interface ChatState {
  // Messages by chat ID
  messages: Record<string, ChatMessage[]>;

  // Actions
  addMessage: (chatId: string, message: ChatMessage) => void;
  getMessages: (chatId: string) => ChatMessage[];
  clearMessages: (chatId: string) => void;
  clearAllMessages: () => void;
}

/**
 * In-memory chat store for managing chat messages
 * This is used for development before migrating to Supabase Realtime
 *
 * Messages are stored in memory and will be lost on page refresh.
 * This is intentional for development - real persistence will come from Supabase.
 */
export const useChatStore = create<ChatState>((set, get) => ({
  messages: {},

  /**
   * Add a message to a chat thread
   */
  addMessage: (chatId: string, message: ChatMessage) => {
    set((state) => {
      const existingMessages = state.messages[chatId] || [];
      return {
        messages: {
          ...state.messages,
          [chatId]: [...existingMessages, message],
        },
      };
    });
  },

  /**
   * Get all messages for a chat thread
   */
  getMessages: (chatId: string) => {
    return get().messages[chatId] || [];
  },

  /**
   * Clear messages for a specific chat thread
   */
  clearMessages: (chatId: string) => {
    set((state) => {
      const { [chatId]: _, ...rest } = state.messages;
      return { messages: rest };
    });
  },

  /**
   * Clear all messages (useful for logout)
   */
  clearAllMessages: () => {
    set({ messages: {} });
  },
}));
