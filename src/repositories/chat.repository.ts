import { ChatThread, ChatMessage } from "@/types/chat";
import { DEV_MODE, maybeDelay } from "@/utils/constants";
import { supabase } from "@/lib/supabase";
import { MOCK_CHATS } from "@/data/mockChats";
import { useChatStore } from "@/stores/chat.store";
import { generateId } from "@/utils/id";

export interface ChatRepository {
  getChatThreads(currentUserId?: string): Promise<ChatThread[]>;
  getChatThread(chatId: string): Promise<ChatThread | null>;
  getMessages(chatId: string, currentUserId?: string): Promise<ChatMessage[]>;
  sendMessage(chatId: string, text: string, senderId: string, bookId?: string): Promise<ChatMessage>;
  createChatThread(userId: string, bookId?: string): Promise<ChatThread>;
  markAsRead(chatId: string): Promise<void>;
}

class MockChatRepository implements ChatRepository {
  async getChatThreads(): Promise<ChatThread[]> {
    await maybeDelay(300);
    return MOCK_CHATS.map(thread => ({
      id: thread.id,
      user: {
        id: thread.user.id,
        uid: thread.user.id,
        name: thread.user.name,
        avatar: thread.user.avatar,
        address: thread.user.address,
        coordinates: thread.user.coordinates,
        onboardingCompleted: true,
        locationLabel: thread.user.location,
        isVerified: thread.user.isVerified,
        joinDate: thread.user.joinDate,
      },
      lastMessage: thread.lastMessage,
      timestamp: thread.timestamp,
      unreadCount: thread.unreadCount,
      bookContext: thread.bookContext,
    }));
  }

  async getChatThread(chatId: string): Promise<ChatThread | null> {
    await maybeDelay(200);
    const thread = MOCK_CHATS.find((c) => c.id === chatId);
    if (!thread) return null;
    return {
      id: thread.id,
      user: {
        id: thread.user.id,
        uid: thread.user.id,
        name: thread.user.name,
        avatar: thread.user.avatar,
        address: thread.user.address,
        coordinates: thread.user.coordinates,
        onboardingCompleted: true,
        locationLabel: thread.user.location,
        isVerified: thread.user.isVerified,
        joinDate: thread.user.joinDate,
      },
      lastMessage: thread.lastMessage,
      timestamp: thread.timestamp,
      unreadCount: thread.unreadCount,
      bookContext: thread.bookContext,
    };
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    await maybeDelay(200);
    const store = useChatStore.getState();
    return store.getMessages(chatId);
  }

  async sendMessage(chatId: string, text: string, senderId: string, bookId?: string): Promise<ChatMessage> {
    await maybeDelay(300);
    const message: ChatMessage = {
      id: generateId("msg"),
      text,
      senderId,
      timestamp: new Date(),
      bookId,
      isRead: false,
    };
    const store = useChatStore.getState();
    store.addMessage(chatId, message);
    return message;
  }

  async createChatThread(userId: string, bookId?: string): Promise<ChatThread> {
    await maybeDelay(400);
    return {
      id: generateId("chat"),
      user: {
        id: userId,
        uid: userId,
        name: "User",
        avatar: "google",
        onboardingCompleted: true,
      },
      lastMessage: "",
      timestamp: new Date().toISOString(),
      unreadCount: 0,
    };
  }

  async markAsRead(): Promise<void> {
    await maybeDelay(200);
  }
}

class SupabaseChatRepository implements ChatRepository {
  async getChatThreads(): Promise<ChatThread[]> {
    if (!supabase) return [];
    return [];
  }
  async getChatThread(_chatId: string): Promise<ChatThread | null> {
    if (!supabase) return null;
    return null;
  }
  async getMessages(_chatId: string): Promise<ChatMessage[]> {
    if (!supabase) return [];
    return [];
  }
  async sendMessage(_chatId: string, _text: string, _senderId: string, _bookId?: string): Promise<ChatMessage> {
    if (!supabase) throw new Error("Supabase not configured");
    throw new Error("Supabase sendMessage not implemented");
  }
  async createChatThread(_userId: string, _bookId?: string): Promise<ChatThread> {
    if (!supabase) throw new Error("Supabase not configured");
    throw new Error("Supabase createChatThread not implemented");
  }
  async markAsRead(_chatId: string): Promise<void> {
    if (!supabase) return;
    // TODO: update unread counters
  }
}

export const getChatRepository = (): ChatRepository => {
  if (!DEV_MODE && supabase) {
    return new SupabaseChatRepository();
  }
  return new MockChatRepository();
};

