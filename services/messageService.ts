import api from "@/lib/axios";
import type { ApiResponse, User, Product } from "@/types";

export interface MessageItem {
  _id: string;
  conversation: string;
  sender: {
    _id: string;
    name: string;
    email: string;
    photo?: { url?: string | null; publicId?: string | null } | null;
    avatar?: string | null;
  };
  content: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationItem {
  _id: string;
  participants: User[];
  product: Product;
  lastMessage?: MessageItem | null;
  lastMessageAt: string;
  isActive: boolean;
  unreadCount?: number;
  otherParticipant: User;
  createdAt: string;
  updatedAt: string;
}

export const messageService = {
  /**
   * Get all active conversations for current user
   */
  getConversations: async () => {
    const res = await api.get<ApiResponse<{ conversations: ConversationItem[] }>>("/messages/conversations");
    return res.data;
  },

  /**
   * Get or start a conversation for a product
   */
  getOrCreateConversation: async (productId: string, recipientId?: string) => {
    const res = await api.post<ApiResponse<{ conversation: ConversationItem }>>("/messages/conversations", {
      productId,
      recipientId,
    });
    return res.data;
  },

  /**
   * Get all messages thread for a conversation
   */
  getMessages: async (conversationId: string) => {
    const res = await api.get<ApiResponse<{ conversation: ConversationItem; messages: MessageItem[] }>>(
      `/messages/conversations/${conversationId}`
    );
    return res.data;
  },

  /**
   * Send a new message to a conversation
   */
  sendMessage: async (conversationId: string, content: string) => {
    const res = await api.post<ApiResponse<{ message: MessageItem }>>(
      `/messages/conversations/${conversationId}/send`,
      { content }
    );
    return res.data;
  },

  /**
   * Get total unread messages count
   */
  getUnreadCount: async () => {
    const res = await api.get<ApiResponse<{ unreadCount: number }>>("/messages/unread-count");
    return res.data;
  },
};

export default messageService;
