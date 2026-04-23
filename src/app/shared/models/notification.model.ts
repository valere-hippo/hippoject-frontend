export interface NotificationItem {
  id: number;
  type: string;
  projectId: number;
  issueId: number;
  message: string;
  read: boolean;
  createdAt: string;
}
