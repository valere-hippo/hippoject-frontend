export interface ProjectChatMessage {
  id: number;
  projectId: number;
  authorId: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
}

export interface CreateProjectChatMessageRequest {
  body: string;
}

export interface ChatParticipant {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface ChatConversation {
  id: number;
  title: string;
  groupChat: boolean;
  participants: ChatParticipant[];
  lastMessage: string | null;
  lastMessageAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  authorId: string;
  authorDisplayName: string;
  body: string;
  createdAt: string;
}

export interface CreateChatConversationRequest {
  title?: string | null;
  groupChat: boolean;
  participantUserIds: string[];
}

export interface CreateChatMessageRequest {
  body: string;
}
