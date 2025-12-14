import { ChatThread } from "@/data/mockChats";
import { MOCK_CHATS } from "@/data/mockChats";
import { delay, DEV_MODE } from "@/utils/constants";
import { useChatStore } from "@/stores/chat.store";
import { generateId } from "@/utils/id";

export interface ChatMessage {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: Date;
  bookId?: string; // Optional: if message is related to a book
}

export const chatService = {
  /**
   * Get all chat threads
   * Dev Mode: Returns mock data
   * TODO: Replace with Supabase when ready
   */
  getChatThreads: async (): Promise<ChatThread[]> => {
    await delay(300);
    
    if (DEV_MODE) {
      return MOCK_CHATS;
    }
    
    // TODO: Replace with Supabase query
    // return await supabase.from('chat_threads').select('*').order('updated_at', { ascending: false });
    return [];
  },

  /**
   * Get chat thread by ID
   * Dev Mode: Returns from mock data
   * TODO: Replace with Supabase when ready
   */
  getChatThread: async (chatId: string): Promise<ChatThread | null> => {
    await delay(200);
    
    if (DEV_MODE) {
      return MOCK_CHATS.find((chat) => chat.id === chatId) || null;
    }
    
    // TODO: Replace with Supabase query
    // return await supabase.from('chat_threads').select('*').eq('id', chatId).single();
    return null;
  },

  /**
   * Get messages for a chat thread
   * Dev Mode: Returns from chat.store
   * TODO: Replace with Supabase when ready
   */
  getMessages: async (chatId: string): Promise<ChatMessage[]> => {
    await delay(200);
    
    if (DEV_MODE) {
      // Messages are managed in-memory by chat.store
      const store = useChatStore.getState();
      return store.getMessages(chatId);
    }
    
    // TODO: Replace with Supabase query
    // return await supabase.from('messages').select('*').eq('chat_id', chatId).order('created_at', { ascending: true });
    return [];
  },

  /**
   * Send a message
   * Dev Mode: Stores message in chat.store
   * TODO: Replace with Supabase when ready
   */
  sendMessage: async (
    chatId: string,
    text: string,
    bookId?: string
  ): Promise<ChatMessage> => {
    await delay(300);
    
    const message: ChatMessage = {
      id: generateId("msg"),
      text,
      sender: "me",
      timestamp: new Date(),
      bookId,
    };
    
    if (DEV_MODE) {
      // Store message in chat.store
      const store = useChatStore.getState();
      store.addMessage(chatId, message);
      return message;
    }
    
    // TODO: Replace with Supabase insert
    // return await supabase.from('messages').insert({
    //   chat_id: chatId,
    //   text,
    //   sender_id: currentUser.id,
    //   book_id: bookId,
    // }).select().single();
    return message;
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
    await delay(400);
    
    const newThread: ChatThread = {
      id: generateId("chat"),
      user: {
        name: "User", // TODO: Fetch from user service
        avatar: "google",
      },
      lastMessage: "",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
    };
    
    if (DEV_MODE) {
      return newThread;
    }
    
    // TODO: Replace with Supabase insert
    // return await supabase.from('chat_threads').insert({
    //   user_id: userId,
    //   book_id: bookId,
    // }).select().single();
    return newThread;
  },

  /**
   * Mark messages as read
   * Dev Mode: No-op
   * TODO: Replace with Supabase when ready
   */
  markAsRead: async (chatId: string): Promise<void> => {
    await delay(200);
    
    if (DEV_MODE) {
      // In dev mode, handled by chat.store
      return;
    }
    
    // TODO: Replace with Supabase update
    // await supabase.from('chat_threads').update({ unread_count: 0 }).eq('id', chatId);
  },
};

