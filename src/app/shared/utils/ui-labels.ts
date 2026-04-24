import { IssuePriority, IssueStatus, IssueType } from '../models/issue.model';
import { ProjectRole } from '../models/project.model';
import { SprintStatus } from '../models/sprint.model';

export const issueStatusLabel = (status: IssueStatus | ''): string => {
  const labels: Record<IssueStatus, string> = {
    TODO: 'Offen',
    IN_PROGRESS: 'In Arbeit',
    IN_REVIEW: 'In Prüfung',
    DONE: 'Erledigt'
  };

  return status ? labels[status] : 'Alle Status';
};

export const issuePriorityLabel = (priority: IssuePriority | ''): string => {
  const labels: Record<IssuePriority, string> = {
    LOW: 'Niedrig',
    MEDIUM: 'Mittel',
    HIGH: 'Hoch',
    CRITICAL: 'Kritisch'
  };

  return priority ? labels[priority] : 'Alle Prioritäten';
};

export const issueTypeLabel = (type: IssueType | ''): string => {
  const labels: Record<IssueType, string> = {
    STORY: 'Story',
    TASK: 'Aufgabe',
    BUG: 'Bug',
    EPIC: 'Epic'
  };

  return type ? labels[type] : 'Alle Typen';
};

export const sprintStatusLabel = (status: SprintStatus): string => {
  const labels: Record<SprintStatus, string> = {
    PLANNED: 'Geplant',
    ACTIVE: 'Aktiv',
    COMPLETED: 'Abgeschlossen'
  };

  return labels[status];
};

export const projectRoleLabel = (role: ProjectRole | string): string => {
  const labels: Record<ProjectRole, string> = {
    PROJECT_ADMIN: 'Projektadmin',
    PROJECT_MANAGER: 'Projektmanager',
    CONTRIBUTOR: 'Mitarbeit',
    VIEWER: 'Lesend'
  };

  return labels[role as ProjectRole] ?? role;
};

export const notificationTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    SPRINT: 'Sprint',
    ASSIGNMENT: 'Zuweisung',
    MENTION: 'Erwähnung'
  };

  return labels[type] ?? type;
};
