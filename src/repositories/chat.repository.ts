import { ChatThread, ChatMessage } from "@/types/chat";
import { User } from "@/types/user";
import { Book } from "@/types/book";
import { supabase } from "@/lib/supabase";
import { MOCK_CHATS } from "@/data/mockChats";
import { useChatStore } from "@/stores/chat.store";
import { generateId } from "@/utils/id";

export interface SendMessageOptions {
  bookId?: string;
  messageType?: "text" | "exchange_request" | "exchange_completed";
  metadata?: any;
}

export interface ChatRepository {
  getChatThreads(currentUserId: string): Promise<ChatThread[]>;
  getChatThread(chatIdOrUserId: string, currentUserId: string): Promise<ChatThread | null>;
  getMessages(chatId: string, currentUserId?: string): Promise<ChatMessage[]>;
  sendMessage(chatId: string, text: string, senderId: string, options?: SendMessageOptions): Promise<ChatMessage>;
  createChatThread(targetUserId: string, currentUserId: string, bookId?: string): Promise<ChatThread>;
  markAsRead(chatId: string, currentUserId: string): Promise<void>;
  getTotalUnreadCount(currentUserId: string): Promise<number>;
  updateMessageMetadata(messageId: string, metadata: any): Promise<boolean>;
}

// Local helper to map book data from join
const mapBookFromMsg = (bookData: any): Book | undefined => {
  if (!bookData) return undefined;

  const ownerData = bookData.users;
  const owner: User = {
    id: ownerData?.uid || ownerData?.id || "unknown",
    uid: ownerData?.uid || "unknown",
    name: ownerData?.name || "Unknown",
    avatar: ownerData?.avatar,
    address: ownerData?.address,
    coordinates: ownerData?.coordinates
  } as User;

  return {
    id: bookData.id,
    title: bookData.title,
    author: bookData.author,
    image: bookData.image,
    description: bookData.description,
    category: bookData.category,
    condition: bookData.condition,
    owner: owner,
    exchangeMethods: bookData.exchange_methods || [],
    status: bookData.status || 'Available',
    createdAt: bookData.created_at
  };
};

class MockChatRepository implements ChatRepository {
  async getChatThreads(currentUserId: string): Promise<ChatThread[]> {
    return [];
  }
  async getChatThread(chatId: string, currentUserId: string): Promise<ChatThread | null> {
    return null;
  }
  async getMessages(chatId: string): Promise<ChatMessage[]> {
    return [];
  }
  async sendMessage(chatId: string, text: string, senderId: string, options?: SendMessageOptions): Promise<ChatMessage> {
    throw new Error("Mock not implemented");
  }
  async createChatThread(targetUserId: string, currentUserId: string, bookId?: string): Promise<ChatThread> {
    throw new Error("Mock not implemented");
  }
  async markAsRead(chatId: string, currentUserId: string): Promise<void> { }
  async getTotalUnreadCount(currentUserId: string): Promise<number> {
    return 0;
  }
  async updateMessageMetadata(messageId: string, metadata: any): Promise<boolean> {
    return true;
  }
}

class SupabaseChatRepository implements ChatRepository {
  // Helper to fetch users manually to avoid Join 406 errors
  private async fetchUsers(uids: string[]): Promise<Record<string, any>> {
    if (!supabase) return {};
    if (uids.length === 0) return {};
    const uniqueUids = Array.from(new Set(uids));
    const { data } = await supabase.from('users').select('*').in('uid', uniqueUids);

    const userMap: Record<string, any> = {};
    data?.forEach(u => {
      userMap[u.uid] = u;
    });
    return userMap;
  }

  async getChatThreads(currentUserId: string): Promise<ChatThread[]> {
    if (!supabase) return [];

    // 1. Fetch threads raw (no join)
    const { data, error } = await supabase
      .from('chat_threads')
      .select('id, user_a, user_b, last_message, last_message_at, created_at, updated_at')
      .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error("Error fetching chat threads:", error);
      return [];
    }

    if (!data || data.length === 0) return [];

    // Filter out threads with no messages (empty threads created but never used)
    // Only show threads that have at least one message
    const threadIds = data.map(t => t.id);
    let messageCountMap = new Map<string, number>();

    if (threadIds.length > 0) {
      const { data: messageCounts } = await supabase
        .from('chat_messages')
        .select('chat_id')
        .in('chat_id', threadIds);

      messageCounts?.forEach((msg: any) => {
        messageCountMap.set(msg.chat_id, (messageCountMap.get(msg.chat_id) || 0) + 1);
      });
    }

    // Only include threads that have at least one message
    const validThreads = data.filter(t => (messageCountMap.get(t.id) || 0) > 0);

    if (validThreads.length === 0) return [];

    // 2. Fetch related users manually
    const partnerIds = validThreads.map(t => t.user_a === currentUserId ? t.user_b : t.user_a);
    const userMap = await this.fetchUsers(partnerIds);

    // 3. Fetch unread counts
    const validThreadIds = validThreads.map(t => t.id);
    let unreadMap = new Map<string, number>();

    if (validThreadIds.length > 0) {
      const { data: unreadData } = await supabase
        .from('chat_messages')
        .select('chat_id')
        .in('chat_id', validThreadIds)
        .eq('is_read', false)
        .neq('sender_id', currentUserId);

      unreadData?.forEach((msg: any) => {
        unreadMap.set(msg.chat_id, (unreadMap.get(msg.chat_id) || 0) + 1);
      });
    }

    // 4. Combine - Use map directly, no filter null
    return validThreads.map(thread => {
      const isUserA = thread.user_a === currentUserId;
      const partnerId = isUserA ? thread.user_b : thread.user_a;
      const partner = userMap[partnerId];

      const user: User = partner ? {
        id: partner.uid || partner.id,
        uid: partner.uid,
        name: partner.name,
        avatar: partner.avatar,
        address: partner.address,
        coordinates: partner.coordinates,
        onboardingCompleted: partner.onboarding_completed,
        isVerified: partner.is_verified,
      } : {
        id: partnerId,
        uid: partnerId,
        name: "Pengguna Tidak Dikenal",
        avatar: "",
        onboardingCompleted: false,
        isVerified: false,
      } as User;

      return {
        id: thread.id,
        user,
        lastMessage: thread.last_message || "Percakapan baru",
        timestamp: thread.last_message_at || thread.created_at,
        unreadCount: unreadMap.get(thread.id) || 0,
        bookContext: undefined,
      };
    });
  }

  async getChatThread(chatIdOrUserId: string, currentUserId: string): Promise<ChatThread | null> {
    if (!supabase) return null;

    let threadData = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chatIdOrUserId);

    if (isUuid) {
      const { data } = await supabase.from('chat_threads')
        .select('id, user_a, user_b, last_message, last_message_at, created_at, updated_at')
        .eq('id', chatIdOrUserId).single();
      threadData = data;
    }

    if (!threadData) {
      // Try find by participants pair (Split query to avoid 406 on complex OR)
      // 1. Check A -> B
      const { data: dataA } = await supabase.from('chat_threads')
        .select('id, user_a, user_b, last_message, last_message_at, created_at, updated_at')
        .match({ user_a: currentUserId, user_b: chatIdOrUserId })
        .maybeSingle();

      threadData = dataA;

      // 2. Check B -> A
      if (!threadData) {
        const { data: dataB } = await supabase.from('chat_threads')
          .select('id, user_a, user_b, last_message, last_message_at, created_at, updated_at')
          .match({ user_a: chatIdOrUserId, user_b: currentUserId })
          .maybeSingle();
        threadData = dataB;
      }
    }

    if (!threadData) return null;

    const isUserA = threadData.user_a === currentUserId;
    const partnerId = isUserA ? threadData.user_b : threadData.user_a;

    const userMap = await this.fetchUsers([partnerId]);
    const partner = userMap[partnerId];

    if (!partner) return null;

    const user: User = {
      id: partner.uid || partner.id,
      uid: partner.uid,
      name: partner.name,
      avatar: partner.avatar,
      address: partner.address,
      coordinates: partner.coordinates,
      onboardingCompleted: partner.onboarding_completed,
      isVerified: partner.is_verified,
    };

    return {
      id: threadData.id,
      user,
      lastMessage: threadData.last_message || "",
      timestamp: threadData.last_message_at,
      unreadCount: 0,
    };
  }

  async getMessages(chatId: string): Promise<ChatMessage[]> {
    if (!supabase) return [];

    // NOTE: Keep join for book/user for now. If this fails, we will need to refactor this too.
    // Assuming book relation works fine.
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
         *,
         book:books(
             *,
             users(*)
         )
      `)
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    return (data || []).map(msg => ({
      id: msg.id,
      text: msg.text,
      senderId: msg.sender_id,
      timestamp: new Date(msg.created_at),
      bookId: msg.book_id,
      book: mapBookFromMsg(msg.book),
      messageType: msg.message_type as any,
      exchangeRequest: msg.metadata?.exchangeRequest ? {
        ...msg.metadata.exchangeRequest
      } : undefined,
      isRead: msg.is_read,
    }));
  }

  async sendMessage(chatId: string, text: string, senderId: string, options?: SendMessageOptions): Promise<ChatMessage> {
    if (!supabase) throw new Error("Supabase not configured");

    const payload = {
      chat_id: chatId,
      sender_id: senderId,
      text: text,
      book_id: options?.bookId,
      message_type: options?.messageType || 'text',
      metadata: options?.metadata || {}
    };

    // Insert message
    const { data: msgData, error: msgError } = await supabase
      .from('chat_messages')
      .insert(payload)
      .select(`
          *,
          book:books(*, users(*))
      `)
      .single();

    if (msgError) throw msgError;

    // Update thread last message
    await supabase
      .from('chat_threads')
      .update({
        last_message: text,
        last_message_at: new Date().toISOString()
      })
      .eq('id', chatId);

    return {
      id: msgData.id,
      text: msgData.text,
      senderId: msgData.sender_id,
      timestamp: new Date(msgData.created_at),
      bookId: msgData.book_id,
      book: mapBookFromMsg(msgData.book),
      messageType: msgData.message_type as any,
      exchangeRequest: msgData.metadata?.exchangeRequest,
      isRead: msgData.is_read
    };
  }

  async createChatThread(targetUserId: string, currentUserId: string, bookId?: string): Promise<ChatThread> {
    if (!supabase) throw new Error("Supabase not configured");

    // Use RPC to avoid 409 Conflict race conditions
    const { data, error } = await supabase.rpc('get_or_create_chat_thread', {
      current_user_id: currentUserId,
      target_user_id: targetUserId
    });

    if (error) {
      console.error("RPC Error createChatThread:", error);
      throw error;
    }

    // data is the thread object directly from DB
    const threadData = data as any; // Cast to bypass strict type if needed, or define interface

    // Now fetch partner detail
    let partnerUserMap = await this.fetchUsers([targetUserId]);
    let partnerUser = partnerUserMap[targetUserId];

    if (!partnerUser) {
      // Fallback
      const { data: userData } = await supabase.from('users').select('*').eq('uid', targetUserId).single();
      partnerUser = userData;
    }

    return {
      id: threadData.id,
      user: {
        id: partnerUser.uid || partnerUser.id,
        uid: partnerUser.uid,
        name: partnerUser.name,
        avatar: partnerUser.avatar,
        onboardingCompleted: partnerUser.onboarding_completed,
        address: partnerUser.address,
        coordinates: partnerUser.coordinates,
      } as User,
      lastMessage: threadData.last_message || "",
      timestamp: threadData.created_at,
      unreadCount: 0,
    };
  }

  async markAsRead(chatId: string, currentUserId: string): Promise<void> {
    if (!supabase) return;
    await supabase
      .from('chat_messages')
      .update({ is_read: true })
      .eq('chat_id', chatId)
      .neq('sender_id', currentUserId) // Only messages sent by others
      .eq('is_read', false);
  }

  async getTotalUnreadCount(currentUserId: string): Promise<number> {
    if (!supabase) return 0;
    const { count, error } = await supabase
      .from('chat_messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .neq('sender_id', currentUserId);

    if (error) return 0;
    return count || 0;
  }

  async updateMessageMetadata(messageId: string, metadata: any): Promise<boolean> {
    if (!supabase) return false;
    const { error } = await supabase
      .from('chat_messages')
      .update({ metadata: metadata })
      .eq('id', messageId);

    if (error) {
      console.error("Failed to update message metadata", error);
      return false;
    }
    return true;
  }
}

export const getChatRepository = (): ChatRepository => {
  if (supabase) {
    return new SupabaseChatRepository();
  }
  return new MockChatRepository();
};
