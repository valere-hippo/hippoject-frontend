import { IdentityRealmRole } from '../models/identity.model';
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

export const identityRealmRoleLabel = (role: IdentityRealmRole | string): string => {
  const labels: Record<IdentityRealmRole, string> = {
    'hippoject-admin': 'Hippoject-Admin',
    'project-admin': 'Projektadmin',
    'project-manager': 'Projektmanager',
    developer: 'Entwicklung',
    reporter: 'Reporter'
  };

  return labels[role as IdentityRealmRole] ?? role;
};

export const identityRealmRoleDescription = (role: IdentityRealmRole | string): string => {
  const descriptions: Record<IdentityRealmRole, string> = {
    'hippoject-admin': 'Voller Zugriff auf die gesamte Plattform: Benutzerverwaltung, Projekte, Rollen, Konfiguration und organisatorische Steuerung.',
    'project-admin': 'Verwaltet Projekte und Projektzugriffe, darf Mitglieder organisieren und administrative Entscheidungen im Projektkontext treffen.',
    'project-manager': 'Plant und priorisiert Arbeit, pflegt Backlog, Board, Sprints und Zuständigkeiten innerhalb der betreuten Projekte.',
    developer: 'Bearbeitet fachliche und technische Aufgaben, kommentiert Vorgänge, aktualisiert Status und liefert Umsetzung im Projekt.',
    reporter: 'Hat primär Lese- und Meldezugriff, kann Inhalte einsehen und Rückmeldungen geben, aber keine Projektadministration übernehmen.'
  };

  return descriptions[role as IdentityRealmRole] ?? role;
};
