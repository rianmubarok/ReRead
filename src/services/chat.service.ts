import { ChatThread, ChatMessage, DatabaseMessage, DatabaseChatThread } from "@/types/chat";
import { LegacyChatThread } from "@/types/chat";
import { MOCK_CHATS } from "@/data/mockChats";
import { delay, DEV_MODE } from "@/utils/constants";
import { useChatStore } from "@/stores/chat.store";
import { generateId } from "@/utils/id";
import { mapDatabaseMessageToChatMessage, mapChatMessageToDatabase, mapDatabaseChatThreadToChatThread } from "@/utils/chat.mapper";
import { User } from "@/types/user";
import { Book } from "@/data/mockBooks";

export const chatService = {
  /**
   * Get all chat threads
   * Dev Mode: Returns mock data (converted to new format)
   * TODO: Replace with Supabase when ready
   */
  getChatThreads: async (currentUserId?: string): Promise<ChatThread[]> => {
    await delay(300);

    if (DEV_MODE) {
      // Convert legacy mock data to new format
      return MOCK_CHATS.map(thread => ({
        id: thread.id,
        user: {
          id: thread.user.id,
          uid: thread.user.id,
          name: thread.user.name,
          avatar: thread.user.avatar,
          onboardingCompleted: true
        },
        lastMessage: thread.lastMessage,
        timestamp: thread.timestamp,
        unreadCount: thread.unreadCount,
        bookContext: thread.bookContext,
      }));
    }

    // TODO: Replace with Supabase query
    // const { data: threads, error } = await supabase
    //   .from('chat_threads')
    //   .select('*, user:users!chat_threads_user_id_fkey(*), book:books(*)')
    //   .order('updated_at', { ascending: false });
    // 
    // if (error) throw error;
    // return threads.map(t => mapDatabaseChatThreadToChatThread(t, t.user, t.book));
    return [];
  },

  /**
   * Get chat thread by ID
   * Dev Mode: Returns from mock data (converted to new format)
   * TODO: Replace with Supabase when ready
   */
  getChatThread: async (chatId: string): Promise<ChatThread | null> => {
    await delay(200);

    if (DEV_MODE) {
      const thread = MOCK_CHATS.find((chat) => chat.id === chatId);
      if (!thread) return null;

      return {
        id: thread.id,
        user: {
          id: thread.user.id,
          uid: thread.user.id,
          name: thread.user.name,
          avatar: thread.user.avatar,
          onboardingCompleted: true
        },
        lastMessage: thread.lastMessage,
        timestamp: thread.timestamp,
        unreadCount: thread.unreadCount,
        bookContext: thread.bookContext,
      };
    }

    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from('chat_threads')
    //   .select('*, user:users!chat_threads_user_id_fkey(*), book:books(*)')
    //   .eq('id', chatId)
    //   .single();
    // 
    // if (error) return null;
    // return mapDatabaseChatThreadToChatThread(data, data.user, data.book);
    return null;
  },

  /**
   * Get messages for a chat thread
   * Dev Mode: Returns from chat.store
   * TODO: Replace with Supabase when ready
   */
  getMessages: async (chatId: string, currentUserId?: string): Promise<ChatMessage[]> => {
    await delay(200);

    if (DEV_MODE) {
      // Messages are managed in-memory by chat.store
      const store = useChatStore.getState();
      return store.getMessages(chatId);
    }

    // TODO: Replace with Supabase query
    // const { data, error } = await supabase
    //   .from('messages')
    //   .select('*')
    //   .eq('chat_id', chatId)
    //   .order('created_at', { ascending: true });
    // 
    // if (error) throw error;
    // return data.map(msg => mapDatabaseMessageToChatMessage(msg, currentUserId));
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
    senderId: string, // Current user ID
    bookId?: string
  ): Promise<ChatMessage> => {
    await delay(300);

    const message: ChatMessage = {
      id: generateId("msg"),
      text,
      senderId, // Use senderId instead of "me"
      timestamp: new Date(),
      bookId,
      isRead: false,
    };

    if (DEV_MODE) {
      // Store message in chat.store
      const store = useChatStore.getState();
      store.addMessage(chatId, message);
      return message;
    }

    // TODO: Replace with Supabase insert
    // const messageData = mapChatMessageToDatabase(message, chatId);
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert(messageData)
    //   .select()
    //   .single();
    // 
    // if (error) throw error;
    // return mapDatabaseMessageToChatMessage(data, senderId);
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
        id: userId,
        uid: userId,
        name: "User", // TODO: Fetch from user service
        avatar: "google",
        onboardingCompleted: true,
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

