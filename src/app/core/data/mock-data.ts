import { Issue } from '../../shared/models/issue.model';
import { Project } from '../../shared/models/project.model';
import { Sprint } from '../../shared/models/sprint.model';
import { User } from '../../shared/models/user.model';

export const currentUser: User = {
  id: 'local-dev',
  name: 'Valere',
  email: 'v.youbi@hipposideros.de',
  role: 'Administrator',
  initials: 'VA'
};

export const users: User[] = [currentUser];

export const projects: Project[] = [];

export const sprints: Sprint[] = [];

export const issues: Issue[] = [];
