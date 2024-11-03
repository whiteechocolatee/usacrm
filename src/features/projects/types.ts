// eslint-disable-next-line
import { Id } from '../../../convex/_generated/dataModel';

export enum ProjectStatus {
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
  FILED_IN_COURT = 'FILED_IN_COURT',
}

export enum ProjectImportance {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Project {
  _creationTime: number;
  _id: Id<'projects'>;
  caseId: string;
  dueDate: number;
  importance: ProjectImportance;
  name: string;
  status: ProjectStatus;
  workspaceId: Id<'workspaces'>;
  category?: string;
}
