import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { ProjectImportance as ProjectImportanceType } from '../types';
import ProjectAssignees from './project-assignees';
import ProjectCategory from './project-category';
import ProjectDeadLine from './project-deadline';
import ProjectImportanceWrapper from './project-importance-wrapper';

type ProjectSidebarProps = {
  importance: ProjectImportanceType;
  dueDate: number;
  createdAt: number;
  category?: string;
  projectId: Id<'projects'>;
};

function ProjectSidebar({
  importance,
  dueDate,
  createdAt,
  projectId,
  category = '',
}: ProjectSidebarProps) {
  return (
    <Card className="w-full border-none rounded-3xl">
      <CardHeader className="text-base font-bold text-black">
        Project Info
      </CardHeader>
      <CardContent>
        <ProjectAssignees projectId={projectId} />
        <ProjectImportanceWrapper
          projectId={projectId}
          importance={importance}
        />
        <ProjectCategory projectId={projectId} category={category} />
        <ProjectDeadLine projectId={projectId} dueDate={dueDate} />
        <p className="text-sm mt-20 text-custom-grey font-semibold flex items-center">
          <Calendar className="mr-4 size-6" />
          Created {format(new Date(createdAt), 'MMM dd, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export default ProjectSidebar;
