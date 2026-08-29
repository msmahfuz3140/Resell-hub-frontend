"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Send,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  ExternalLink,
  MessageSquare,
  Sparkles,
  CheckCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { messageService, type ConversationItem, type MessageItem } from "@/services/messageService";
import { useAuth } from "@/contexts/AuthContext";
import type { Product } from "@/types";

const QUICK_GREETINGS = [
  "Hi, is this still available?",
  "Is the price negotiable?",
  "What is your lowest price for this?",
  "Can we meet up in Dhaka for inspection?",
];

export default function ChatWithSellerModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const [conversation, setConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  // Smart container-only scroll helper — NEVER scrolls the entire window
  const scrollToBottom = useCallback((force = false, smooth = true) => {
    setTimeout(() => {
      const container = scrollAreaRef.current;
      if (!container) return;

      const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      const isNearBottom = distanceFromBottom < 150;

      if (force || isNearBottom) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: smooth ? "smooth" : "auto",
        });
      }
    }, 50);
  }, []);

  // Fetch messages function
  const fetchMessagesForConv = useCallback(async (convId: string, showLoader = false) => {
    if (!convId) return;
    try {
      if (showLoader) setIsLoading(true);
      const res = await messageService.getMessages(convId);
      if (res?.data?.messages) {
        const incoming = res.data.messages as MessageItem[];
        setMessages((prev) => {
          // If message count or latest ID changed, update
          const isDiff =
            incoming.length !== prev.length ||
            (incoming.length > 0 && incoming[incoming.length - 1]._id !== prev[prev.length - 1]?._id);
          if (isDiff) {
            // Only auto-scroll if user is already near bottom (force = false)
            scrollToBottom(false, true);
            return incoming;
          }
          return prev;
        });
      }
    } catch (err: unknown) {
      console.error("Fetch messages error in modal:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  }, [scrollToBottom]);

  // Init chat on modal open
  useEffect(() => {
    if (!isOpen || !product) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      activeConvIdRef.current = null;
      setConversation(null);
      setMessages([]);
      return;
    }

    let isMounted = true;
    const initChat = async () => {
      try {
        setIsLoading(true);
        const sellerId = product.sellerInfo?.sellerId || (typeof product.seller === "object" ? product.seller._id : product.seller);
        const convRes = await messageService.getOrCreateConversation(product._id, sellerId);

        if (convRes?.data?.conversation && isMounted) {
          const conv = convRes.data.conversation;
          setConversation(conv);
          activeConvIdRef.current = conv._id;

          // Initial fetch (force scroll on open)
          await fetchMessagesForConv(conv._id, true);
          scrollToBottom(true, false);

          // Real-time polling every 1.5s while modal is open
          if (pollingRef.current) clearInterval(pollingRef.current);
          pollingRef.current = setInterval(() => {
            if (activeConvIdRef.current) {
              fetchMessagesForConv(activeConvIdRef.current, false);
            }
          }, 1500);
        }
      } catch (err: unknown) {
        console.error("Chat init error in modal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      if (pollingRef.current) clearInterval(pollingRef.current);
      activeConvIdRef.current = null;
    };
  }, [isOpen, product, fetchMessagesForConv, scrollToBottom]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || messageText).trim();
    if (!text) return;

    if (!conversation) {
      toast.error("Conversation is initializing. Please wait a moment.");
      return;
    }

    const convId = conversation._id;

    try {
      setIsSending(true);
      setMessageText("");

      // 1. Instant optimistic UI
      const tempId = `temp_${Date.now()}`;
      const optimisticMsg: MessageItem = {
        _id: tempId,
        conversation: convId,
        sender: {
          _id: user?._id || "current_user",
          name: user?.name || "You",
          email: user?.email || "",
          photo: user?.photo,
          avatar: user?.avatar,
        },
        content: text,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      scrollToBottom(true);

      // 2. Send to backend
      await messageService.sendMessage(convId, text);

      // 3. Immediately sync
      await fetchMessagesForConv(convId, false);
      scrollToBottom(true);
    } catch (err: unknown) {
      console.error("Send message error in modal:", err);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => !m._id.startsWith("temp_")));
      setMessageText(text);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const sellerName = product.sellerInfo?.name || "Seller";
  const sellerPhoto = product.sellerInfo?.photo;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[620px] max-h-[90vh] border border-slate-200/90 dark:border-slate-800 animate-in zoom-in-95 duration-200">
        {/* ── Chat Header ── */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 border border-white/20 flex items-center justify-center text-white font-black overflow-hidden shrink-0">
              {sellerPhoto ? (
                <img src={sellerPhoto} alt={sellerName} className="w-full h-full object-cover" />
              ) : (
                sellerName[0]?.toUpperCase()
              )}
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-indigo-950" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black truncate">{sellerName}</h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active • Instant Chat</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              href={conversation ? `/messages?id=${conversation._id}` : "/messages"}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Open full inbox"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Product Pinned Mini Bar ── */}
        <div className="p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-800/60 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
              {product.images?.[0]?.url ? (
                <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[220px]">{product.title}</h4>
              <p className="text-xs font-black text-indigo-600 dark:text-indigo-400">{formatCurrency(product.price)}</p>
            </div>
          </div>

          <Link
            href={`/checkout?productId=${product._id}`}
            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[11px] shrink-0 shadow-xs transition"
          >
            Buy Now
          </Link>
        </div>

        {/* ── Message Thread ── */}
        <div ref={scrollAreaRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-950/60">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold">Connecting with seller...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-500 dark:text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Start Conversation</h4>
              <p className="text-xs text-slate-400 max-w-xs mb-4">
                Ask about availability, negotiate pricing, or arrange pickup details with {sellerName}.
              </p>

              {/* Quick greetings */}
              <div className="w-full space-y-2 max-w-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-left">
                  Quick Prompts:
                </span>
                <div className="flex flex-col gap-1.5">
                  {QUICK_GREETINGS.map((msg, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(msg)}
                      className="text-left text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700 transition cursor-pointer"
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isMe =
                  msg.sender?._id?.toString() === user?._id?.toString() ||
                  msg.sender?.email === user?.email ||
                  msg.sender?._id === "current_user";

                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-br-xs"
                          : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 font-semibold px-1">
                      <span>{timeAgo(msg.createdAt)}</span>
                      {isMe && (
                        <span>
                          {msg.isRead ? (
                            <CheckCheck className="w-3 h-3 text-indigo-600 dark:text-indigo-400 inline" />
                          ) : (
                            <Check className="w-3 h-3 text-slate-400 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* ── Message Input Bar ── */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message ${sellerName}...`}
              className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            <button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0 shadow-md shadow-indigo-600/20"
            >
              {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
