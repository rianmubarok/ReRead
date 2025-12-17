"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
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

export default function ChatDetailPage() {
  const { setVisible } = useNav();
  const { user: currentUser } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();
  const paramId = params?.id as string; // Could be ChatID or UserID
  const bookIdParam = searchParams?.get("bookId");

  // State
  const [thread, setThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        // A. Resolve Thread (Find by ID or UserID, or Create if UserID)
        let resolvedThread = await getChatRepository().getChatThread(paramId, currentUser.uid);

        // If not found, and paramId looks like a UserID, try to create/ensure thread exists
        if (!resolvedThread) {
          // Check if paramId is a potential UserID (not a UUID format check strictly, but let's try create)
          // If getChatThread returned null, it implies no thread found. 
          // If paramId is actually a valid UserID, createChatThread will handle "find or create".
          try {
            resolvedThread = await getChatRepository().createChatThread(paramId, currentUser.uid);
          } catch (createErr) {
            console.warn("Failed to create thread, paramId might not be a valid UserID", createErr);
          }
        }

        if (resolvedThread) {
          setThread(resolvedThread);

          // B. Load Messages
          const msgs = await getChatRepository().getMessages(resolvedThread.id);
          setMessages(msgs);

          // C. Mark as read
          if (currentUser?.uid) {
            await getChatRepository().markAsRead(resolvedThread.id, currentUser.uid);
          }
        }

        // C. Load Book Context if provided
        if (bookIdParam) {
          const book = await getBookRepository().getBookById(bookIdParam);
          if (book) {
            setContextBook(book);
            // Show context only if no messages yet or explicit intent?
            // Usually show if bookId is passed
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


  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !thread || !currentUser?.uid) return;

    // Optimistic Update
    const tempId = `temp-${Date.now()}`;
    const optimMsg: ChatMessage = {
      id: tempId,
      text,
      senderId: currentUser.uid,
      timestamp: new Date(),
      bookId: showBookContext ? contextBook?.id : undefined,
      isRead: false
    };
    setMessages(prev => [...prev, optimMsg]);

    try {
      const sentMsg = await getChatRepository().sendMessage(
        thread.id,
        text,
        currentUser.uid,
        {
          bookId: showBookContext ? contextBook?.id : undefined
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
  const handleAction = async (action: string, messageId: string) => {
    // Implementation for confirming exchange would update metadata in DB
    // Not yet implemented in repository fully (need updateMessage method)
    // For now, show toast
    toast("Fitur update status pengajuan akan segera hadir!");
  };

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Memuat...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-gray-400 text-sm">Percakapan tidak ditemukan.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA]">
      <ChatDetailHeader
        name={thread.user.name}
        status="Online"
        avatar={thread.user.avatar || 'google'}
        hasPendingExchange={false}
      />

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col [&::-webkit-scrollbar]:hidden">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 text-sm space-y-1 min-h-[200px]">
            <p>Belum ada pesan.</p>
            <p>Mulai percakapan dengan {thread.user.name}</p>
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
                        name: thread.user.name,
                        avatar: thread.user.avatar || 'google'
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
              onClose={() => setShowBookContext(false)}
              onSendMessage={handleSendMessage} // Simple string send for now
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
