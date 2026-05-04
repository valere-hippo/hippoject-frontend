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
