import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { LoadingService } from '../core/services/loading.service';
import { RealtimeService } from '../core/services/realtime.service';
import { UiFeedbackService } from '../core/services/ui-feedback.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { IDENTITY_REALM_ROLES } from '../shared/models/identity.model';
import { NotificationItem } from '../shared/models/notification.model';
import { resolveAvatarUrl } from '../shared/utils/avatar';
import { identityRealmRoleDescription, identityRealmRoleLabel, notificationTypeLabel } from '../shared/utils/ui-labels';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent implements OnDestroy {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
  protected readonly loadingService = inject(LoadingService);
  protected readonly uiFeedback = inject(UiFeedbackService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly realtimeService = inject(RealtimeService);

  protected readonly navItems = [
    { label: 'Übersicht', icon: '◫', route: '/dashboard' },
    { label: 'Projekte', icon: '◪', route: '/projects' },
    { label: 'Vorgänge', icon: '◎', route: '/issues' },
    { label: 'Einstellungen', icon: '⚙', route: '/settings' }
  ];

  protected readonly quickLinks = [{ label: 'Projekte', route: '/projects' }, { label: 'Vorgangsübersicht', route: '/issues' }];
  protected readonly notificationTypeLabel = notificationTypeLabel;
  protected readonly roleInfo = IDENTITY_REALM_ROLES.map((role) => ({
    role,
    label: identityRealmRoleLabel(role),
    description: identityRealmRoleDescription(role)
  }));
  protected readonly currentAvatarUrl = signal<string | null>(null);
  protected readonly resolvedCurrentAvatarUrl = computed(() =>
    resolveAvatarUrl(this.currentAvatarUrl(), this.auth.userId(), this.auth.displayName())
  );

  protected currentUrl = this.router.url;
  protected notifications: NotificationItem[] = [];
  protected notificationsOpen = false;
  protected readonly pageTitle = computed(() => {
    if (this.currentUrl.includes('/board')) return 'Board';
    if (this.currentUrl.includes('/backlog')) return 'Backlog';
    if (this.currentUrl.includes('/issues/')) return 'Vorgangsdetail';
    if (this.currentUrl.includes('/issues')) return 'Vorgänge';
    if (this.currentUrl.includes('/settings')) return 'Einstellungen';
    if (this.currentUrl === '/projects') return 'Projekte';
    if (this.currentUrl.includes('/projects/')) return 'Projektübersicht';
    return 'Übersicht';
  });

  constructor() {
    void this.realtimeService.connect();
    this.loadNotifications();
    this.loadCurrentProfile();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentUrl = this.router.url;
    });
    this.realtimeService.events$.subscribe((event) => {
      const payload = event.payload as { recipientId?: string } | null;
      if (event.type === 'notifications-updated' && (!payload?.recipientId || payload.recipientId === this.auth.userId())) {
        this.loadNotifications();
      }
    });
  }

  protected unreadNotifications(): number {
    return this.notifications.filter((notification) => !notification.read).length;
  }

  protected markNotificationRead(notificationId: number): void {
    this.workspaceService.markNotificationRead(notificationId).subscribe(() => {
      this.loadNotifications();
    });
  }

  protected toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
  }

  protected closeNotifications(): void {
    this.notificationsOpen = false;
  }

  protected openNotification(notification: NotificationItem): void {
    if (!notification.read) {
      this.markNotificationRead(notification.id);
    }
    this.notificationsOpen = false;
    if (notification.issueId && notification.issueId > 0) {
      void this.router.navigate(['/projects', notification.projectId, 'issues', notification.issueId]);
      return;
    }

    if (notification.projectId && notification.type === 'SPRINT') {
      void this.router.navigate(['/projects', notification.projectId, 'backlog']);
    }
  }

  protected logout(): void {
    void this.auth.logout();
  }

  protected dismissToast(id: number): void {
    this.uiFeedback.dismiss(id);
  }

  ngOnDestroy(): void {
    this.realtimeService.disconnect();
  }

  private loadNotifications(): void {
    this.workspaceService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  private loadCurrentProfile(): void {
    this.workspaceService.getMyIdentityUser().subscribe({
      next: (user) => this.currentAvatarUrl.set(user.avatarUrl),
      error: () => this.currentAvatarUrl.set(null)
    });
  }
}
