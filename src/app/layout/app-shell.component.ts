import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { RealtimeService } from '../core/services/realtime.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { NotificationItem } from '../shared/models/notification.model';
import { notificationTypeLabel } from '../shared/utils/ui-labels';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent implements OnDestroy {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);
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

  protected currentUrl = this.router.url;
  protected notifications: NotificationItem[] = [];
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

  protected logout(): void {
    void this.auth.logout();
  }

  ngOnDestroy(): void {
    this.realtimeService.disconnect();
  }

  private loadNotifications(): void {
    this.workspaceService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }
}
