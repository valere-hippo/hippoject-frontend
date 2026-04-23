import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { WorkspaceService } from '../core/services/workspace.service';

@Component({
  selector: 'app-shell',
  imports: [AsyncPipe, CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss'
})
export class AppShellComponent {
  private readonly router = inject(Router);
  private readonly workspaceService = inject(WorkspaceService);

  protected readonly user$ = this.workspaceService.getCurrentUser();
  protected readonly navItems = [
    { label: 'Dashboard', icon: '◫', route: '/dashboard' },
    { label: 'Projects', icon: '◪', route: '/projects' },
    { label: 'Issues', icon: '◎', route: '/issues' },
    { label: 'Settings', icon: '⚙', route: '/settings' }
  ];

  protected readonly quickLinks = [{ label: 'Projects', route: '/projects' }, { label: 'Issue navigator', route: '/issues' }];

  protected currentUrl = this.router.url;
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
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }
}
