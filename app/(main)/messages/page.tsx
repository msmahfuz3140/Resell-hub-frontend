"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Send,
  ShoppingBag,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  ExternalLink,
  CheckCheck,
  Check,
  Sparkles,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { messageService, type ConversationItem, type MessageItem } from "@/services/messageService";
import { useAuth } from "@/contexts/AuthContext";

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetConvId = searchParams.get("id");
  const targetProductId = searchParams.get("productId");
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // State
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [isConversationsLoading, setIsConversationsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeConvIdRef = useRef<string | null>(null);

  // Smart container-only scroll helper — NEVER scrolls the entire window
  const scrollToBottom = useCallback((force = false, smooth = true) => {
    setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Only scroll if forced (e.g., initial load / user sending) or user is already near bottom (<= 150px)
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

  // Auth protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error("Please login to access your inbox.");
      router.push("/login?redirect=/messages");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch all conversations
  const fetchConversations = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsConversationsLoading(true);
      const res = await messageService.getConversations();
      if (res?.data?.conversations) {
        const convList = res.data.conversations;
        setConversations(convList);

        // If targetConvId passed in URL, pick it
        if (targetConvId) {
          const found = convList.find((c) => c._id === targetConvId);
          if (found) {
            setActiveConversation(found);
            setIsMobileChatActive(true);
          }
        } else if (!activeConvIdRef.current && convList.length > 0) {
          // Default pick the first conversation if none is active
          setActiveConversation(convList[0]);
        }
      }
    } catch (err: unknown) {
      console.error("[Messages] Error fetching conversations:", err);
    } finally {
      if (!silent) setIsConversationsLoading(false);
    }
  }, [targetConvId]);

  // Handle targetProductId on mount (e.g. from /listings/xyz)
  useEffect(() => {
    if (!isAuthenticated || !targetProductId) return;

    const initProductChat = async () => {
      try {
        const res = await messageService.getOrCreateConversation(targetProductId);
        if (res?.data?.conversation) {
          const conv = res.data.conversation;
          setActiveConversation(conv);
          setIsMobileChatActive(true);
          fetchConversations(true);
        }
      } catch (err: unknown) {
        console.error("[Messages] Error init product chat:", err);
      }
    };

    initProductChat();
  }, [isAuthenticated, targetProductId, fetchConversations]);

  // Initial load of conversations list
  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations(false);
    }
  }, [isAuthenticated, fetchConversations]);

  // Poll conversations every 4 seconds for new conversations or unread count updates
  useEffect(() => {
    if (!isAuthenticated) return;
    if (convPollingRef.current) clearInterval(convPollingRef.current);

    convPollingRef.current = setInterval(() => {
      fetchConversations(true);
    }, 4000);

    return () => {
      if (convPollingRef.current) clearInterval(convPollingRef.current);
    };
  }, [isAuthenticated, fetchConversations]);

  // Core: Fetch messages for active conversation
  const fetchMessagesForActive = useCallback(async (convId: string, showLoader = false) => {
    if (!convId) return;
    try {
      if (showLoader) setIsMessagesLoading(true);
      const res = await messageService.getMessages(convId);
      if (res?.data?.messages) {
        const incoming = res.data.messages as MessageItem[];
        setMessages((prev) => {
          // Detect difference: length changed or latest message ID changed
          const isDiff =
            incoming.length !== prev.length ||
            (incoming.length > 0 && incoming[incoming.length - 1]._id !== prev[prev.length - 1]?._id);

          if (isDiff) {
            // Only auto-scroll if user was already at the bottom (force = false)
            scrollToBottom(false, true);
            return incoming;
          }
          return prev;
        });
      }
    } catch (err: unknown) {
      console.error("[Messages] fetch messages error:", err);
    } finally {
      if (showLoader) setIsMessagesLoading(false);
    }
  }, [scrollToBottom]);

  // When active conversation changes, immediately load messages and start 1.5s real-time polling
  useEffect(() => {
    if (!activeConversation) {
      if (pollingRef.current) clearInterval(pollingRef.current);
      activeConvIdRef.current = null;
      setMessages([]);
      return;
    }

    const convId = activeConversation._id;
    activeConvIdRef.current = convId;

    if (pollingRef.current) clearInterval(pollingRef.current);

    // 1. Immediate fetch (force scroll on initial load)
    fetchMessagesForActive(convId, true);
    scrollToBottom(true, false);

    // 2. Real-time fast polling every 1.5 seconds (like messenger)
    pollingRef.current = setInterval(() => {
      const currentId = activeConvIdRef.current;
      if (currentId) {
        fetchMessagesForActive(currentId, false);
      }
    }, 1500);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [activeConversation?._id, fetchMessagesForActive, scrollToBottom]);

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || messageInput).trim();
    if (!text || !activeConversation) return;

    const convId = activeConversation._id;

    try {
      setIsSending(true);
      setMessageInput("");

      // 1. Optimistic message — instant display
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

      // Update conversations sidebar last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === convId
            ? { ...c, lastMessage: optimisticMsg, lastMessageAt: new Date().toISOString() }
            : c
        )
      );

      // 2. Send to backend
      await messageService.sendMessage(convId, text);

      // 3. Immediately re-fetch real message
      await fetchMessagesForActive(convId, false);
      scrollToBottom(true);

      // 4. Also refresh sidebar conversations in background
      fetchConversations(true);
    } catch (err: unknown) {
      console.error("[Messages] send message error:", err);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => !m._id.startsWith("temp_")));
      setMessageInput(text);
    } finally {
      setIsSending(false);
    }
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) => {
    const otherName = c.otherParticipant?.name || "";
    const prodTitle = c.product?.title || "";
    const query = searchQuery.toLowerCase();
    return otherName.toLowerCase().includes(query) || prodTitle.toLowerCase().includes(query);
  });

  if (authLoading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50/70 dark:bg-slate-950/70 py-4 sm:py-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header Strip ── */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Inbox className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Messages & Chat Inbox
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Communicate directly with buyers and sellers in real-time.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Escrow Protected Chat</span>
          </div>
        </div>

        {/* ── Inbox Main Window ── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 h-[720px] max-h-[82vh]">
          {/* ── Left Column: Conversations List ── */}
          <div
            className={`lg:col-span-5 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full bg-slate-50/40 dark:bg-slate-950/40 ${
              isMobileChatActive ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Search Box */}
            <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chats by name or item..."
                  className="w-full pl-9.5 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {/* Conversation Items */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {isConversationsLoading && conversations.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <Loader2 className="w-7 h-7 text-indigo-600 dark:text-indigo-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-slate-400">Loading inbox conversations...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-10 text-center text-slate-400 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto opacity-40 text-indigo-400" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">No Messages Yet</h4>
                  <p className="text-xs text-slate-400 max-w-[220px] mx-auto">
                    When you chat with a seller or receive buyer inquiries, they will appear here.
                  </p>
                  <Link
                    href="/listings"
                    className="inline-block mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                  >
                    Browse Listings
                  </Link>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected = activeConversation?._id === conv._id;
                  const other = conv.otherParticipant;
                  const prod = conv.product;

                  return (
                    <button
                      key={conv._id}
                      type="button"
                      onClick={() => {
                        setActiveConversation(conv);
                        setIsMobileChatActive(true);
                      }}
                      className={`w-full p-3.5 sm:p-4 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-l-4 border-indigo-600"
                          : "hover:bg-slate-100/70 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden shadow-xs">
                        {other?.photo?.url ? (
                          <img src={other.photo.url} alt="" className="w-full h-full object-cover" />
                        ) : other?.avatar ? (
                          <img src={other.avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          other?.name?.[0]?.toUpperCase() || "U"
                        )}
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                      </div>

                      {/* Info & Last Message */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                            {other?.name || "Marketplace User"}
                          </h4>
                          <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                            {timeAgo(conv.lastMessageAt || conv.updatedAt)}
                          </span>
                        </div>

                        {/* Product Tag */}
                        {prod && (
                          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/90 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md w-fit truncate max-w-[200px]">
                            <ShoppingBag className="w-3 h-3 shrink-0" />
                            <span className="truncate">{prod.title}</span>
                          </div>
                        )}

                        {/* Last Message Snippet */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                          {conv.lastMessage?.content || "Tap to chat..."}
                        </p>
                      </div>

                      {/* Unread Badge */}
                      {conv.unreadCount && conv.unreadCount > 0 ? (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                          {conv.unreadCount}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Right Column: Active Chat Thread ── */}
          <div
            className={`lg:col-span-7 flex flex-col h-full bg-white dark:bg-slate-900 ${
              !isMobileChatActive ? "hidden lg:flex" : "flex"
            }`}
          >
            {activeConversation ? (
              <>
                {/* ── Chat Header ── */}
                <div className="p-3.5 sm:p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setIsMobileChatActive(false)}
                      className="lg:hidden p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="relative w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 overflow-hidden shadow-xs">
                      {activeConversation.otherParticipant?.photo?.url ? (
                        <img
                          src={activeConversation.otherParticipant.photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        activeConversation.otherParticipant?.name?.[0]?.toUpperCase() || "U"
                      )}
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">
                          {activeConversation.otherParticipant?.name || "Marketplace User"}
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-200 dark:border-emerald-800/60">
                          Verified
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold truncate">
                        {activeConversation.otherParticipant?.email || "Direct Inquiries"}
                      </p>
                    </div>
                  </div>

                  {activeConversation.product && (
                    <Link
                      href={`/listings/${activeConversation.product._id}`}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition border border-slate-200/80 dark:border-slate-700 shrink-0"
                    >
                      <span>View Listing</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* ── Product Pinned Bar ── */}
                {activeConversation.product && (
                  <div className="px-4 py-2.5 bg-indigo-50/70 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-800/60 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                        {activeConversation.product.images?.[0]?.url ? (
                          <img
                            src={activeConversation.product.images[0].url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingBag className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                          {activeConversation.product.title}
                        </h4>
                        <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {formatCurrency(activeConversation.product.price)}
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/checkout?productId=${activeConversation.product._id}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shrink-0 shadow-xs transition"
                    >
                      Buy Now
                    </Link>
                  </div>
                )}

                {/* ── Message Feed ── */}
                <div ref={scrollContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
                  {isMessagesLoading && messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs font-bold">Loading message history...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
                      <Sparkles className="w-8 h-8 text-indigo-400" />
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">Start the conversation!</h4>
                      <p className="text-xs max-w-xs">
                        Say hi, negotiate the price, or ask for product specifications.
                      </p>
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
                              className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-xs ${
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

                {/* ── Input Bar ── */}
                <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                    />
                    <button
                      type="submit"
                      disabled={isSending || !messageInput.trim()}
                      className="w-11 h-11 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shrink-0 shadow-md shadow-indigo-600/20"
                    >
                      {isSending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Inbox className="w-8 h-8" />
                </div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Select a Conversation</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Choose a chat from the inbox list on the left to read and send messages.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      }
    >
      <MessagesContent />
    </Suspense>
  );
}
