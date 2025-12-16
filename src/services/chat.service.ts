import { ChatThread, ChatMessage } from "@/types/chat";
import { getChatRepository } from "@/repositories/chat.repository";

export const chatService = {
  /**
   * Get all chat threads
   * Dev Mode: Returns mock data (converted to new format)
   * TODO: Replace with Supabase when ready
   */
  getChatThreads: async (currentUserId?: string): Promise<ChatThread[]> => {
    const repo = getChatRepository();
    return repo.getChatThreads(currentUserId);
  },

  /**
   * Get chat thread by ID
   * Dev Mode: Returns from mock data (converted to new format)
   * TODO: Replace with Supabase when ready
   */
  getChatThread: async (chatId: string): Promise<ChatThread | null> => {
    const repo = getChatRepository();
    return repo.getChatThread(chatId);
  },

  /**
   * Get messages for a chat thread
   * Dev Mode: Returns from chat.store
   * TODO: Replace with Supabase when ready
   */
  getMessages: async (chatId: string, currentUserId?: string): Promise<ChatMessage[]> => {
    const repo = getChatRepository();
    return repo.getMessages(chatId, currentUserId);
  },

  /**
   * Send a message
   * Dev Mode: Stores message in chat.store
   * TODO: Replace with Supabase when ready
   */
  sendMessage: async (
    chatId: string,
    text: string,
    senderId: string, // Current user ID
    bookId?: string
  ): Promise<ChatMessage> => {
    const repo = getChatRepository();
    return repo.sendMessage(chatId, text, senderId, bookId);
  },

  /**
   * Create a new chat thread
   * Dev Mode: Returns mock chat thread
   * TODO: Replace with Supabase when ready
   */
  createChatThread: async (
    userId: string,
    bookId?: string
  ): Promise<ChatThread> => {
    const repo = getChatRepository();
    return repo.createChatThread(userId, bookId);
  },

  /**
   * Mark messages as read
   * Dev Mode: No-op
   * TODO: Replace with Supabase when ready
   */
  markAsRead: async (chatId: string): Promise<void> => {
    const repo = getChatRepository();
    await repo.markAsRead(chatId);
  },
};

