import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, combineLatest, map, startWith, switchMap, tap } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { WorkspaceService } from '../../core/services/workspace.service';
import { CreateIssueRequest, IssuePriority, IssueStatus, IssueType } from '../../shared/models/issue.model';
import { CreateProjectMemberRequest, ProjectRole, UpdateProjectRequest } from '../../shared/models/project.model';
import { resolveProjectPermissions } from '../../shared/utils/project-permissions';

@Component({
  selector: 'app-project-detail-page',
  imports: [AsyncPipe, DatePipe, FormsModule, RouterLink],
  templateUrl: './project-detail-page.component.html',
  styleUrl: './project-detail-page.component.scss'
})
export class ProjectDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly workspaceService = inject(WorkspaceService);
  private readonly refresh$ = new Subject<void>();

  protected readonly priorities: IssuePriority[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  protected readonly statuses: IssueStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];
  protected readonly issueTypes: IssueType[] = ['STORY', 'TASK', 'BUG', 'EPIC'];
  protected readonly projectRoles: ProjectRole[] = ['PROJECT_ADMIN', 'PROJECT_MANAGER', 'CONTRIBUTOR', 'VIEWER'];

  protected readonly issueForm: CreateIssueRequest = {
    title: '',
    description: '',
    issueType: 'TASK',
    priority: 'MEDIUM',
    status: 'TODO',
    labels: [],
    sprintId: null,
    epicId: null,
    assigneeId: ''
  };
  protected issueLabelsText = '';

  protected readonly projectForm: UpdateProjectRequest = {
    name: '',
    description: ''
  };

  protected readonly memberForm: CreateProjectMemberRequest = {
    userId: '',
    displayName: '',
    role: 'CONTRIBUTOR'
  };

  protected isSavingIssue = false;
  protected isSavingProject = false;
  protected isSavingMember = false;
  protected removingMemberId: number | null = null;

  private readonly projectId$ = this.route.paramMap.pipe(map((params) => Number(params.get('projectId'))));

  protected readonly vm$ = combineLatest({
    projectId: this.projectId$,
    _: this.refresh$.pipe(startWith(void 0))
  }).pipe(
    switchMap(({ projectId }) =>
      combineLatest({
        project: this.workspaceService.getProject(projectId),
        issues: this.workspaceService.getProjectIssues(projectId),
        sprints: this.workspaceService.getSprints(projectId),
        members: this.workspaceService.getProjectMembers(projectId),
        activity: this.workspaceService.getProjectActivity(projectId)
      }).pipe(
        map((data) => ({
          ...data,
          epics: data.issues.filter((issue) => issue.issueType === 'EPIC'),
          permissions: resolveProjectPermissions(this.auth.userId(), data.members, {
            workspaceAdmin: this.auth.hasAnyRole('hippoject-admin'),
            projectAdmin: this.auth.hasAnyRole('project-admin'),
            projectManager: this.auth.hasAnyRole('project-manager')
          })
        }))
      )
    ),
    tap(({ project }) => {
      this.projectForm.name = project.name;
      this.projectForm.description = project.description;
    })
  );

  protected createIssue(projectId: number): void {
    this.isSavingIssue = true;
    this.workspaceService.createIssue(projectId, { ...this.issueForm, labels: this.parseLabels(this.issueLabelsText) }).subscribe({
      next: () => {
        this.issueForm.title = '';
        this.issueForm.description = '';
        this.issueForm.issueType = 'TASK';
        this.issueForm.priority = 'MEDIUM';
        this.issueForm.status = 'TODO';
        this.issueForm.labels = [];
        this.issueForm.sprintId = null;
        this.issueForm.epicId = null;
        this.issueForm.assigneeId = '';
        this.issueLabelsText = '';
        this.isSavingIssue = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingIssue = false;
      }
    });
  }

  private parseLabels(value: string): string[] {
    return value
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean);
  }

  protected updateProject(projectId: number): void {
    this.isSavingProject = true;
    this.workspaceService.updateProject(projectId, this.projectForm).subscribe({
      next: () => {
        this.isSavingProject = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingProject = false;
      }
    });
  }

  protected addMember(projectId: number): void {
    this.isSavingMember = true;
    this.workspaceService.addProjectMember(projectId, this.memberForm).subscribe({
      next: () => {
        this.memberForm.userId = '';
        this.memberForm.displayName = '';
        this.memberForm.role = 'CONTRIBUTOR';
        this.isSavingMember = false;
        this.refresh$.next();
      },
      error: () => {
        this.isSavingMember = false;
      }
    });
  }

  protected removeMember(projectId: number, memberId: number): void {
    this.removingMemberId = memberId;
    this.workspaceService.removeProjectMember(projectId, memberId).subscribe({
      next: () => {
        this.removingMemberId = null;
        this.refresh$.next();
      },
      error: () => {
        this.removingMemberId = null;
      }
    });
  }
}
