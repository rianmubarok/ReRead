"use client";
// Force refresh for mock data update
import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatInput from "@/components/chat/ChatInput";
import BookContextPanel from "@/components/chat/BookContextPanel";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatBookCard from "@/components/chat/ChatBookCard";
import { MOCK_CHATS } from "@/data/mockChats";
import { MOCK_BOOKS } from "@/data/mockBooks";
import { useNav } from "@/context/NavContext";
import { chatService } from "@/services/chat.service";
import { ChatMessage } from "@/types/chat";
import { useChatStore } from "@/stores/chat.store";
import { Book } from "@/types/book";
import { parseMockDate, formatChatDate } from "@/utils/dateUtils";
import { useAuth } from "@/context/AuthContext";
import { addExchangeHistory } from "@/storage/exchange.storage";
import toast from "react-hot-toast";

export default function ChatDetailPage() {
  const { setVisible } = useNav();
  const { user: currentUser } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const chatId = params?.id as string;
  const bookId = searchParams?.get("bookId");

  // State
  const [user, setUser] = useState<{
    id: string;
    name: string;
    avatar: string;
    status: string;
  } | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [showBookContext, setShowBookContext] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatStore = useChatStore();

  // Hide bottom nav on mount, show on unmount
  useEffect(() => {
    setVisible(false);
    return () => setVisible(true);
  }, [setVisible]);

  // Initialize data and load messages
  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);

      // 1. Try to find existing chat by ID
      const existingChat = MOCK_CHATS.find((c) => c.id === chatId);

      if (existingChat) {
        setUser({
          id: existingChat.user.id,
          name: existingChat.user.name,
          avatar: existingChat.user.avatar || "google",
          status: "Aktif",
        });

        if (chatId === "chat1") {
          // Removed debug clearing logic that was causing data loss
        }
      }

      // 2. Check for book context if bookId is present
      if (bookId) {
        const foundBook = MOCK_BOOKS.find((b) => b.id === bookId);
        if (foundBook) {
          setBook(foundBook);
          setShowBookContext(!existingChat);
          if (!existingChat) {
            setUser({
              id: foundBook.owner.id,
              name: foundBook.owner.name,
              avatar: foundBook.owner.avatar || "google",
              status: "Aktif",
            });
          }
        }
      } else if (!existingChat) {
        setUser({
          id: "user1",
          name: "Nadia Putri",
          avatar: "google",
          status: "Aktif",
        });
      }

      // 3. Load messages from chat service/store
      try {
        const loadedMessages = await chatService.getMessages(chatId);
        let finalMessages = [...loadedMessages];

        // Jika ada mock chat, jadikan mock sebagai sumber kebenaran utama,
        // lalu tambahkan pesan baru dari store yang ID-nya belum ada di mock.
        if (existingChat) {
          let mockMessages: ChatMessage[] = [];

          if (existingChat.messages && existingChat.messages.length > 0) {
            mockMessages = existingChat.messages.map((m, index) => ({
              id: m.id,
              text: m.text,
              senderId:
                m.senderId === "me"
                  ? currentUser?.id || "me"
                  : existingChat.user.id,
              timestamp: parseMockDate(m.timestamp),
              // Book context utama dan book dari exchangeRequest
              bookId:
                index === 0
                  ? existingChat.bookContext?.id
                  : m.exchangeRequest?.bookId ?? undefined,
              isRead: m.isRead,
              messageType: m.messageType,
              exchangeRequest: m.exchangeRequest,
            }));
          } else if (existingChat.lastMessage) {
            mockMessages = [
              {
                id: `init-${Date.now()}`,
                text: existingChat.lastMessage,
                senderId: existingChat.user.id,
                timestamp: parseMockDate(existingChat.timestamp),
                isRead: false,
              },
            ];
          }

          const mockIds = new Set(mockMessages.map((m) => m.id));
          const newFromStore = loadedMessages.filter((m) => !mockIds.has(m.id));

          finalMessages = [...mockMessages, ...newFromStore].sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
          );

          // Sinkronkan kembali ke store supaya state konsisten
          chatStore.clearMessages(chatId);
          finalMessages.forEach((msg) => chatStore.addMessage(chatId, msg));
        }

        setMessages(finalMessages);
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (chatId) {
      initializeChat();
    }
  }, [chatId, bookId]);

  // Subscribe to chat store changes for real-time updates
  useEffect(() => {
    if (!chatId) return;

    const storeMessages = chatStore.getMessages(chatId);
    const uniqueMessages = Array.from(
      new Map(storeMessages.map((msg) => [msg.id, msg])).values()
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setMessages((prev) => {
      const prevIds = new Set(prev.map((m) => m.id));
      const newIds = new Set(uniqueMessages.map((m) => m.id));

      if (
        prev.length === uniqueMessages.length &&
        prev.every((m) => newIds.has(m.id)) &&
        uniqueMessages.every((m) => prevIds.has(m.id))
      ) {
        return prev;
      }

      return uniqueMessages;
    });
  }, [chatId, chatStore.messages]);

  // Handle sending message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !chatId || !currentUser?.id) return;

    try {
      await chatService.sendMessage(
        chatId,
        text,
        currentUser.id,
        showBookContext ? book?.id : undefined
      );
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleConfirmExchange = (action: string, messageId: string) => {
    if (action !== "confirm_exchange" && action !== "cancel_exchange") return;

    const currentMessages = messages;
    const msg = currentMessages.find((m) => m.id === messageId);
    if (!msg || !msg.exchangeRequest) return;

    if (action === "cancel_exchange") {
      const remaining = currentMessages.filter((m) => m.id !== messageId);
      setMessages(remaining);

      // Sinkronkan ke store tanpa pesan yang dibatalkan
      chatStore.clearMessages(chatId);
      remaining.forEach((m) => chatStore.addMessage(chatId, m));

      toast.success("Pengajuan selesai dibatalkan");
      return;
    }

    // Konfirmasi: tandai completed, simpan di chat, dan tulis ke riwayat
    const updated: ChatMessage = {
      ...msg,
      exchangeRequest: {
        ...msg.exchangeRequest,
        status: "completed" as "completed",
      },
    };

    const next: ChatMessage[] = currentMessages.map(
      (m): ChatMessage => (m.id === messageId ? updated : m)
    );

    setMessages(next);

    // Sinkronkan ke store
    chatStore.clearMessages(chatId);
    next.forEach((m) => chatStore.addMessage(chatId, m));

    // Tambah ke riwayat pertukaran (local)
    if (user) {
      const exchangeBookId: string =
        (updated.exchangeRequest && updated.exchangeRequest.bookId) || "";

      addExchangeHistory({
        chatId: chatId || "",
        bookId: exchangeBookId,
        partnerId: user.id,
        note: updated.text,
      });
    }

    toast.success("Pertukaran ditandai selesai");
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      <ChatDetailHeader
        name={user.name}
        status={user.status}
        avatar={user.avatar}
        hasPendingExchange={messages.some(
          (m) =>
            m.messageType === "exchange_request" &&
            m.exchangeRequest?.status === "pending"
        )}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col [&::-webkit-scrollbar]:hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-1 min-h-[200px]">
            <p>Belum ada pesan.</p>
            <p>Mulai percakapan dengan {user.name}</p>
          </div>
        ) : (
          <div className="mt-auto space-y-3 pb-4">
            {(() => {
              let lastDate = "";
              return messages.map((msg, index) => {
                const messageDate = formatChatDate(msg.timestamp);
                const showDate = messageDate !== lastDate;
                lastDate = messageDate;

                return (
                  <React.Fragment key={msg.id}>
                    {showDate && (
                      <div className="flex justify-center my-4 sticky top-2 z-10">
                        <span className="bg-gray-100/80 backdrop-blur-sm text-gray-500 text-xs px-3 py-1 rounded-full">
                          {messageDate}
                        </span>
                      </div>
                    )}
                    <MessageBubble
                      message={msg}
                      user={user}
                      currentUserId={currentUser?.id || "me"}
                      onAction={handleConfirmExchange}
                    />
                  </React.Fragment>
                );
              });
            })()}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Section: Context Panel + Input */}
      <div className="z-30 bg-[#F8F9FA]">
        {showBookContext && book && (
          <div>
            <BookContextPanel
              book={book}
              onClose={() => setShowBookContext(false)}
              onSendMessage={handleSendMessage}
            />
          </div>
        )}
        <div className="bg-[#F8F9FA]">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
