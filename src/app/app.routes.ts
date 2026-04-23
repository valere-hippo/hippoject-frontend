import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { AppShellComponent } from './layout/app-shell.component';
import { BacklogPageComponent } from './pages/backlog/backlog-page.component';
import { BoardPageComponent } from './pages/board/board-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { IssueDetailPageComponent } from './pages/issue-detail/issue-detail-page.component';
import { IssuesPageComponent } from './pages/issues/issues-page.component';
import { ProjectDetailPageComponent } from './pages/project-detail/project-detail-page.component';
import { ProjectsPageComponent } from './pages/projects/projects-page.component';
import { SettingsPageComponent } from './pages/settings/settings-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'projects', component: ProjectsPageComponent },
      { path: 'projects/:projectId', component: ProjectDetailPageComponent },
      { path: 'projects/:projectId/issues/:issueId', component: IssueDetailPageComponent },
      { path: 'projects/:projectId/board', component: BoardPageComponent },
      { path: 'projects/:projectId/backlog', component: BacklogPageComponent },
      { path: 'issues', component: IssuesPageComponent },
      { path: 'settings', component: SettingsPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
