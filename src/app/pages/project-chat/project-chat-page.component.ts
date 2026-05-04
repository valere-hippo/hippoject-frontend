import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { RealtimeService } from '../../core/services/realtime.service';
import { UiFeedbackService } from '../../core/services/ui-feedback.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { ProjectChatMessage } from '../../shared/models/chat.model';
import { ProjectMember } from '../../shared/models/project.model';
import { resolveAvatarUrl } from '../../shared/utils/avatar';

@Component({
  selector: 'app-project-chat-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './project-chat-page.component.html',
  styleUrl: './project-chat-page.component.scss'
})
export class ProjectChatPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly realtimeService = inject(RealtimeService);
  private readonly uiFeedback = inject(UiFeedbackService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();

  protected messageBody = '';
  protected isSending = false;

  protected readonly vm$ = combineLatest({
    projectId: this.route.paramMap.pipe(map((params) => Number(params.get('projectId')))),
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        members: this.workspaceService.getProjectMembers(projectId),
        messages: this.workspaceService.getProjectChatMessages(projectId)
      }).pipe(map((data) => ({ ...data, projectId })))
    )
  );

  constructor() {
    this.realtimeService.events$.subscribe((event) => {
      const payload = event.payload as { projectId?: number } | null;
      const currentProjectId = Number(this.route.snapshot.paramMap.get('projectId'));
      if (event.type === 'project-chat-message' && payload?.projectId === currentProjectId) {
        this.refresh$.next();
      }
    });
  }

  protected sendMessage(projectId: number): void {
    if (!this.messageBody.trim()) {
      return;
    }

    this.isSending = true;
    this.workspaceService.createProjectChatMessage(projectId, { body: this.messageBody }).subscribe({
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

  protected isMine(message: ProjectChatMessage): boolean {
    return message.authorId.toLowerCase() === this.auth.userId().toLowerCase();
  }

  protected memberAvatar(message: ProjectChatMessage, members: ProjectMember[]): string {
    const member = members.find((candidate) => candidate.userId.toLowerCase() === message.authorId.toLowerCase());
    const label = member?.displayName || message.authorDisplayName || message.authorId;
    return resolveAvatarUrl(null, message.authorId, label);
  }

  protected avatarForMember(member: ProjectMember): string {
    return resolveAvatarUrl(null, member.userId, member.displayName);
  }
}
