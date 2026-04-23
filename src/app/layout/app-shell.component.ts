import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';
import { WorkspaceService } from '../core/services/workspace.service';
import { NotificationItem } from '../shared/models/notification.model';

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
  private readonly notificationsTimer = window.setInterval(() => this.loadNotifications(), 15000);

  protected readonly navItems = [
    { label: 'Dashboard', icon: '◫', route: '/dashboard' },
    { label: 'Projects', icon: '◪', route: '/projects' },
    { label: 'Issues', icon: '◎', route: '/issues' },
    { label: 'Settings', icon: '⚙', route: '/settings' }
  ];

  protected readonly quickLinks = [{ label: 'Projects', route: '/projects' }, { label: 'Issue navigator', route: '/issues' }];

  protected currentUrl = this.router.url;
  protected notifications: NotificationItem[] = [];
  protected readonly pageTitle = computed(() => {
    if (this.currentUrl.includes('/board')) return 'Board';
    if (this.currentUrl.includes('/backlog')) return 'Backlog';
    if (this.currentUrl.includes('/issues/')) return 'Issue Detail';
    if (this.currentUrl.includes('/issues')) return 'Issues';
    if (this.currentUrl.includes('/settings')) return 'Settings';
    if (this.currentUrl === '/projects') return 'Projects';
    if (this.currentUrl.includes('/projects/')) return 'Project Overview';
    return 'Dashboard';
  });

  constructor() {
    this.loadNotifications();
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentUrl = this.router.url;
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
    window.clearInterval(this.notificationsTimer);
    void this.auth.logout();
  }

  ngOnDestroy(): void {
    window.clearInterval(this.notificationsTimer);
  }

  private loadNotifications(): void {
    this.workspaceService.getNotifications().subscribe((notifications) => {
      this.notifications = notifications;
    });
  }
}
