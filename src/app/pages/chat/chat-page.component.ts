import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, combineLatest, startWith, switchMap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { ChatConversation, ChatMessage, ChatParticipant } from '../../shared/models/chat.model';
import { IdentityUser } from '../../shared/models/identity.model';
import { resolveAvatarUrl } from '../../shared/utils/avatar';

@Component({
  selector: 'app-chat-page',
  imports: [AsyncPipe, DatePipe, FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent {
  private readonly auth = inject(AuthService);
  private readonly realtimeService = inject(RealtimeService);
  private readonly uiFeedback = inject(UiFeedbackService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();

  protected selectedConversationId: number | null = null;
  protected messageBody = '';
  protected directUserId = '';
  protected groupTitle = '';
  protected groupParticipantIds: string[] = [];
  protected isCreatingConversation = false;
  protected isSending = false;

  protected readonly vm$ = combineLatest({
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(() =>
      combineLatest({
        conversations: this.workspaceService.getChatConversations(),
        users: this.workspaceService.getIdentityUsers()
      })
    )
  );

  protected readonly messages$ = combineLatest({
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(() => (this.selectedConversationId ? this.workspaceService.getChatMessages(this.selectedConversationId) : [[] as ChatMessage[]]))
  );

  constructor() {
    this.realtimeService.events$.subscribe((event) => {
      const payload = event.payload as { conversationId?: number; participantIds?: string[] } | null;
      if (event.type === 'chat-updated' && payload?.participantIds?.some((participantId) => participantId.toLowerCase() === this.auth.userId().toLowerCase())) {
        this.refresh$.next();
      }
    });
  }

  protected selectConversation(conversation: ChatConversation): void {
    this.selectedConversationId = conversation.id;
    this.refresh$.next();
  }

  protected selectedConversation(conversations: ChatConversation[]): ChatConversation | null {
    return conversations.find((conversation) => conversation.id === this.selectedConversationId) ?? conversations[0] ?? null;
  }

  protected ensureSelectedConversation(conversations: ChatConversation[]): ChatConversation | null {
    const selected = this.selectedConversation(conversations);
    if (selected && this.selectedConversationId !== selected.id) {
      queueMicrotask(() => {
        this.selectedConversationId = selected.id;
        this.refresh$.next();
      });
    }
    return selected;
  }

  protected startDirectChat(): void {
    if (!this.directUserId) {
      return;
    }
    this.createConversation(false, [this.directUserId], null);
  }

  protected toggleGroupParticipant(userId: string, enabled: boolean): void {
    this.groupParticipantIds = enabled
      ? Array.from(new Set([...this.groupParticipantIds, userId]))
      : this.groupParticipantIds.filter((entry) => entry !== userId);
  }

  protected createGroupChat(): void {
    if (this.groupParticipantIds.length === 0) {
      return;
    }
    this.createConversation(true, this.groupParticipantIds, this.groupTitle || 'Gruppenchat');
  }

  protected sendMessage(conversationId: number): void {
    if (!this.messageBody.trim()) {
      return;
    }
    this.isSending = true;
    this.workspaceService.createChatMessage(conversationId, { body: this.messageBody }).subscribe({
      next: () => {
        this.messageBody = '';
        this.isSending = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSending = false;
      }
    });
  }

  protected isMine(message: ChatMessage): boolean {
    return message.authorId.toLowerCase() === this.auth.userId().toLowerCase();
  }

  protected avatarForParticipant(participant: ChatParticipant): string {
    return resolveAvatarUrl(participant.avatarUrl, participant.userId, participant.displayName);
  }

  protected avatarForUser(user: IdentityUser): string {
    return resolveAvatarUrl(user.avatarUrl, user.username, user.displayName);
  }

  protected otherUsers(users: IdentityUser[]): IdentityUser[] {
    return users.filter((user) => user.username.toLowerCase() !== this.auth.userId().toLowerCase());
  }

  protected conversationAvatar(conversation: ChatConversation): string {
    const other = conversation.participants.find((participant) => participant.userId.toLowerCase() !== this.auth.userId().toLowerCase()) ?? conversation.participants[0];
    return other ? this.avatarForParticipant(other) : resolveAvatarUrl(null, String(conversation.id), conversation.title);
  }

  private createConversation(groupChat: boolean, participantUserIds: string[], title: string | null): void {
    this.isCreatingConversation = true;
    this.workspaceService.createChatConversation({ groupChat, participantUserIds, title }).subscribe({
      next: (conversation) => {
        this.selectedConversationId = conversation.id;
        this.directUserId = '';
        this.groupTitle = '';
        this.groupParticipantIds = [];
        this.isCreatingConversation = false;
        this.uiFeedback.showSuccess(groupChat ? 'Der Gruppenchat wurde erstellt.' : 'Der direkte Chat wurde geöffnet.');
        this.refresh$.next();
      },
      error: () => {
        this.isCreatingConversation = false;
      }
    });
  }
}
