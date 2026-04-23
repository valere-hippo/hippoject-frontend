import { Issue } from '../../shared/models/issue.model';
import { Project } from '../../shared/models/project.model';
import { Sprint } from '../../shared/models/sprint.model';
import { User } from '../../shared/models/user.model';

export const currentUser: User = {
  id: 'user-1',
  name: 'Ava Chen',
  email: 'ava.chen@hippoject.app',
  role: 'Product Operations Lead',
  initials: 'AC'
};

export const users: User[] = [
  currentUser,
  { id: 'user-2', name: 'Marco Silva', email: 'marco@hippoject.app', role: 'Frontend Engineer', initials: 'MS' },
  { id: 'user-3', name: 'Priya Nair', email: 'priya@hippoject.app', role: 'Product Designer', initials: 'PN' },
  { id: 'user-4', name: 'Jon Park', email: 'jon@hippoject.app', role: 'Backend Engineer', initials: 'JP' }
];

export const projects: Project[] = [
  {
    id: 'atlas',
    key: 'ATL',
    name: 'Atlas Workspace',
    lead: 'Ava Chen',
    description: 'Unified work management experience for customer delivery teams.',
    progress: 68,
    health: 'on-track',
    teamSize: 8,
    activeSprint: 'Sprint 14',
    targetDate: '2026-05-30'
  },
  {
    id: 'pulse',
    key: 'PLS',
    name: 'Pulse Reporting',
    lead: 'Marco Silva',
    description: 'Operational analytics and executive portfolio reporting.',
    progress: 42,
    health: 'at-risk',
    teamSize: 5,
    activeSprint: 'Sprint 9',
    targetDate: '2026-06-18'
  },
  {
    id: 'orbit',
    key: 'ORB',
    name: 'Orbit Automation',
    lead: 'Jon Park',
    description: 'Automation rules and workflow orchestration for service teams.',
    progress: 81,
    health: 'on-track',
    teamSize: 6,
    activeSprint: 'Sprint 18',
    targetDate: '2026-05-12'
  }
];

export const sprints: Sprint[] = [
  {
    id: 'sprint-atlas-14',
    projectId: 'atlas',
    name: 'Sprint 14',
    goal: 'Stabilize the planning experience and land the new issue drawer.',
    startsAt: '2026-04-20',
    endsAt: '2026-05-03',
    capacity: 72,
    completedPoints: 39
  },
  {
    id: 'sprint-pulse-9',
    projectId: 'pulse',
    name: 'Sprint 9',
    goal: 'Complete KPI tiles and stakeholder export flow.',
    startsAt: '2026-04-22',
    endsAt: '2026-05-05',
    capacity: 54,
    completedPoints: 21
  }
];

export const issues: Issue[] = [
  {
    id: 'issue-1',
    key: 'ATL-128',
    title: 'Launch board filters in the new shell',
    summary: 'Add saved views, assignee filters, and board quick search.',
    status: 'in-progress',
    priority: 'high',
    assigneeId: 'user-2',
    reporterId: 'user-1',
    projectId: 'atlas',
    sprintId: 'sprint-atlas-14',
    estimate: 8,
    labels: ['frontend', 'board'],
    updatedAt: '2h ago'
  },
  {
    id: 'issue-2',
    key: 'ATL-133',
    title: 'Refine issue detail side panel states',
    summary: 'Prepare loading, success, and empty states for backend integration.',
    status: 'in-review',
    priority: 'medium',
    assigneeId: 'user-3',
    reporterId: 'user-1',
    projectId: 'atlas',
    sprintId: 'sprint-atlas-14',
    estimate: 5,
    labels: ['design-system'],
    updatedAt: '5h ago'
  },
  {
    id: 'issue-3',
    key: 'PLS-44',
    title: 'Add portfolio health widgets',
    summary: 'Define layout and placeholder metrics for leadership dashboards.',
    status: 'todo',
    priority: 'critical',
    assigneeId: 'user-4',
    reporterId: 'user-1',
    projectId: 'pulse',
    sprintId: 'sprint-pulse-9',
    estimate: 13,
    labels: ['analytics'],
    updatedAt: '1d ago'
  },
  {
    id: 'issue-4',
    key: 'ORB-77',
    title: 'Map automation rule audit events',
    summary: 'Document audit events and build the review placeholder.',
    status: 'done',
    priority: 'low',
    assigneeId: 'user-4',
    reporterId: 'user-2',
    projectId: 'orbit',
    estimate: 3,
    labels: ['backend', 'audit'],
    updatedAt: 'Yesterday'
  },
  {
    id: 'issue-5',
    key: 'ATL-140',
    title: 'Create backlog prioritization view',
    summary: 'Show intake queue, sequencing notes, and sizing placeholders.',
    status: 'todo',
    priority: 'high',
    assigneeId: 'user-1',
    reporterId: 'user-3',
    projectId: 'atlas',
    estimate: 8,
    labels: ['planning'],
    updatedAt: 'Today'
  }
];
