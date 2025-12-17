"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import ChatDetailHeader from "@/components/chat/ChatDetailHeader";
import ChatInput from "@/components/chat/ChatInput";
import BookContextPanel from "@/components/chat/BookContextPanel";
import MessageBubble from "@/components/chat/MessageBubble";
import { useNav } from "@/context/NavContext";
import { ChatMessage, ChatThread } from "@/types/chat";
import { Book } from "@/types/book";
import { formatChatDate } from "@/utils/dateUtils";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { getChatRepository } from "@/repositories/chat.repository";
import { getBookRepository } from "@/repositories/book.repository";
import { getTransactionRepository } from "@/repositories/transaction.repository";
import { supabase } from "@/lib/supabase";

export default function ChatDetailPage() {
  const { setVisible } = useNav();
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const paramId = params?.id as string; // Could be ChatID or UserID
  const bookIdParam = searchParams?.get("bookId");

  // State
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [targetUserId, setTargetUserId] = useState<string | null>(null); // Store target user ID for lazy creation
  const [targetUser, setTargetUser] = useState<any>(null); // Store target user info for display

  // Book Context State
  const [contextBook, setContextBook] = useState<Book | null>(null);
  const [showBookContext, setShowBookContext] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hide bottom nav
  useEffect(() => {
    setVisible(false);
    return () => setVisible(true);
  }, [setVisible]);

  // 1. Initialize Thread & Load Context
  useEffect(() => {
    const init = async () => {
      if (!currentUser?.uid || !paramId) return;
      setIsLoading(true);

      try {
        // A. Try to find existing thread (DON'T create if not found)
        let resolvedThread = await getChatRepository().getChatThread(paramId, currentUser.uid);

        if (resolvedThread) {
          setThread(resolvedThread);

          // B. Load Messages
          const msgs = await getChatRepository().getMessages(resolvedThread.id);
          setMessages(msgs);

          // C. Mark as read
          if (currentUser?.uid) {
            await getChatRepository().markAsRead(resolvedThread.id, currentUser.uid);
          }
        } else {
          // Thread not found - store target user ID for lazy creation
          // Check if paramId is a UUID (existing thread ID) or UID (user ID)
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(paramId);

          if (!isUuid) {
            // paramId is likely a user UID - store it for lazy thread creation
            setTargetUserId(paramId);
          }
        }

        // D. Load Book Context if provided
        if (bookIdParam) {
          const book = await getBookRepository().getBookById(bookIdParam);
          if (book) {
            setContextBook(book);
            setShowBookContext(true);
          }
        }

      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Gagal memuat percakapan");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [currentUser, paramId, bookIdParam]);

  // 1.5. Fetch Target User Info (for lazy thread creation)
  useEffect(() => {
    const fetchTargetUser = async () => {
      if (!targetUserId || !supabase) return;

      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('uid', targetUserId)
          .single();

        if (data) {
          setTargetUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch target user:", error);
      }
    };

    fetchTargetUser();
  }, [targetUserId]);

  // 2. Realtime Polling
  useEffect(() => {
    if (!thread?.id || !currentUser?.uid) return;

    const interval = setInterval(async () => {
      try {
        const msgs = await getChatRepository().getMessages(thread.id);
        // Simple diff check or replace
        if (msgs.length !== messages.length) {
          setMessages(msgs);
        } else {
          // Check last message ID
          const lastNew = msgs[msgs.length - 1];
          const lastOld = messages[messages.length - 1];
          if (lastNew?.id !== lastOld?.id) {
            setMessages(msgs);
            // Mark as read if from others
            if (lastNew && lastNew.senderId !== currentUser.uid) {
              await getChatRepository().markAsRead(thread.id, currentUser.uid);
            }
          }
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [thread?.id, messages, currentUser]);


  // 3. Scroll to bottom
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages]);


  const handleSendMessage = async (text: string, options?: any) => {
    if (!text.trim() || !currentUser?.uid) return;

    // Lazy Thread Creation: If no thread exists but we have targetUserId, create it now
    let activeThread = thread;
    if (!activeThread && targetUserId) {
      try {
        const newThread = await getChatRepository().createChatThread(targetUserId, currentUser.uid);
        setThread(newThread);
        activeThread = newThread;
      } catch (error) {
        console.error("Failed to create thread:", error);
        toast.error("Gagal membuat percakapan");
        return;
      }
    }

    // If still no thread, can't send message
    if (!activeThread) {
      toast.error("Percakapan tidak ditemukan");
      return;
    }

    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimMsg: ChatMessage = {
      id: tempId,
      text,
      senderId: currentUser.uid,
      timestamp: new Date(),
      bookId: showBookContext ? contextBook?.id : undefined,
      isRead: false,
      messageType: options?.messageType,
      exchangeRequest: options?.metadata?.exchangeRequest
    };
    setMessages(prev => [...prev, optimMsg]);

    try {
      const sentMsg = await getChatRepository().sendMessage(
        activeThread.id,
        text,
        currentUser.uid,
        {
          bookId: showBookContext ? contextBook?.id : undefined,
          ...options
        }
      );

      // Replace optimistic
      setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m));

      // Hide specific context panel after sending context-aware message? 
      // User might want to keep it open? Let's keep it.

    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Gagal mengirim pesan");
      setMessages(prev => prev.filter(m => m.id !== tempId));
    }
  };

  // Handle Exchange Actions (Accept/Refuse/Cancel) via Messages
  // Handle Exchange Actions (Accept/Refuse/Cancel) via Messages
  const handleAction = async (action: string, messageId: string) => {
    if (!thread || !currentUser) return;

    const message = messages.find(m => m.id === messageId);
    if (!message || !message.exchangeRequest) return;

    if (action === 'confirm_exchange') {
      const loadingToast = toast.loading("Memproses pertukaran...");
      try {
        const req = message.exchangeRequest;
        const requesterId = message.senderId;
        const responderId = currentUser.uid;

        // 1. Mark Books as Exchanged
        // Requester is the one who sent the request (Owner of Book A)
        // Responder is the one accepting (Owner of Book B - if barter)
        // However, verify logic:
        // If Exchange Request sent by Owner A. Text: "Complete Exchange?"
        // B accepts.
        // A owns Book A. B owns Book B (barter).
        const successA = await getBookRepository().markAsExchanged(req.bookId, requesterId);
        let successB = true;

        if (req.barterBookId) {
          // Barter book is owned by the responder (the partner)
          successB = await getBookRepository().markAsExchanged(req.barterBookId, responderId);
        }

        if (!successA || !successB) {
          toast.error("Gagal update status buku via RPC database.", { id: loadingToast });
          return;
        }

        // 2. Create Transaction History
        await getTransactionRepository().createTransaction({
          requesterId,
          responderId,
          bookId: req.bookId,
          barterBookId: req.barterBookId,

          status: 'completed'
        });

        // 3. Update Message Status
        await getChatRepository().updateMessageMetadata(messageId, {
          exchangeRequest: { ...req, status: 'completed' }
        });

        // 4. Update UI
        setMessages(prev => prev.map(m => m.id === messageId ? {
          ...m,
          exchangeRequest: { ...req, status: 'completed' }
        } : m));

        toast.success("Pertukaran berhasil!", { id: loadingToast });

      } catch (error) {
        console.error("Exchange Error:", error);
        toast.error("Terjadi kesalahan saat memproses pertukaran.", { id: loadingToast });
      }
    } else if (action === 'cancel_exchange') {
      // Cancel logic (Update status only)
      try {
        const req = message.exchangeRequest;
        await getChatRepository().updateMessageMetadata(messageId, {
          exchangeRequest: { ...req, status: 'cancelled' }
        });
        setMessages(prev => prev.map(m => m.id === messageId ? {
          ...m,
          exchangeRequest: { ...req, status: 'cancelled' }
        } : m));
        toast.success("Pengajuan dibatalkan");
      } catch (e) {
        toast.error("Gagal membatalkan");
      }
    }
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat...</div>
      </div>
    );
  }

  // If no thread but we have targetUserId, we can still render the chat UI
  // The thread will be created when user sends first message
  if (!thread && !targetUserId) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Percakapan tidak ditemukan.</div>
      </div>
    );
  }

  // Prepare display data - use thread user if exists, otherwise use target user
  const displayUser = thread?.user || (targetUser ? {
    name: targetUser.name || "Pengguna",
    avatar: targetUser.avatar || ""
  } : { name: "Pengguna", avatar: "" });

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      <ChatDetailHeader
        name={displayUser.name}
        status="Online"
        avatar={displayUser.avatar || 'google'}
        hasPendingExchange={false}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col [&::-webkit-scrollbar]:hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-1 min-h-[200px]">
            <p>Belum ada pesan.</p>
            <p>Mulai percakapan dengan {displayUser.name}</p>
          </div>
        ) : (
          <div className="mt-auto space-y-3 pb-4">
            {(() => {
              let lastDate = "";
              return messages.map((msg) => {
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
                      user={{
                        name: displayUser.name,
                        avatar: displayUser.avatar || 'google'
                      }}
                      currentUserId={currentUser.uid}
                      onAction={handleAction}
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
        {showBookContext && contextBook && (
          <div>
            <BookContextPanel
              book={contextBook}
              isOwner={contextBook.owner.uid === currentUser?.uid || contextBook.owner.id === currentUser?.uid}
              onOpenExchangePage={() => router.push(`/chat/${thread?.id}/complete-exchange`)}
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
