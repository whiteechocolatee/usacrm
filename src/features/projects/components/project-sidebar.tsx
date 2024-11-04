import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { ProjectImportance as ProjectImportanceType } from '../types';
import ProjectAssignees from './project-assignees';
import ProjectImportance from './project-importance';

type ProjectSidebarProps = {
  assignees?: string[];
  importance: ProjectImportanceType;
  dueDate: number;
  createdAt: number;
  category?: string;
};

function ProjectSidebar({
  assignees = [],
  importance,
  dueDate,
  createdAt,
  category = '',
}: ProjectSidebarProps) {
  return (
    <Card className="w-full border-none rounded-3xl">
      <CardHeader className="text-base font-bold text-black">
        Project Info
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-1">
          <p className="text-custom-grey">Assignees:</p>
          <ProjectAssignees assignees={assignees} />
        </div>
        <div className="flex items-center gap-x-2 mt-11">
          <p className="text-custom-grey">Priority:</p>
          <ProjectImportance fallbackClasses="w-fit" importance={importance} />
        </div>
        <div className="mt-8 bg-custom-white flex gap-x-4 items-center rounded-xl py-2 px-4">
          <p className="text-custom-grey">Category:</p>
          <p>{category || 'No category'}</p>
        </div>
        <div className="flex flex-col gap-y-2 mt-8">
          <p className="text-custom-grey">Dead Line:</p>
          <p>{format(new Date(dueDate), 'MMM dd, yyyy')}</p>
        </div>
        <p className="text-sm mt-20 text-custom-grey font-semibold flex items-center">
          <Calendar className="mr-4 size-6" />
          Created {format(new Date(createdAt), 'MMM dd, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}

export default ProjectSidebar;
