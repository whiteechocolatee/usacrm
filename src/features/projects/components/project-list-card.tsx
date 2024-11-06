'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Project } from '../types';
import ProjectImportance from './project-importance';
import UserAvatars from './user-avatars';

type ProjectListCardProps = {
  project: Project;
};

function ProjectListCard({ project }: ProjectListCardProps) {
  return (
    <Link
      href={`/workspace/${project.workspaceId}/projects/${project._id}`}
      className="w-full bg-white cursor-pointer flex items-center justify-between rounded-xl py-6 px-7"
    >
      <div className="flex items-center gap-x-4">
        <p className="text-xs text-muted-foreground">#{project.caseId}</p>
        <p className="text-xl font-bold truncate">{project.name}</p>
      </div>
      <div className="flex items-center gap-x-11">
        <p className="text-sm text-custom-grey font-semibold flex items-center">
          <Calendar className="mr-4 size-6" />
          Created {format(new Date(project._creationTime), 'MMM dd, yyyy')}
        </p>
        <p className="font-bold text-sm">
          {project.category ? (
            project.category
          ) : (
            <p className="text-rose-600 underline">No category</p>
          )}
        </p>
        <p>
          <ProjectImportance importance={project.importance} />
        </p>
        <p>
          <Badge variant="status">{snakeCaseToTitleCase(project.status)}</Badge>
        </p>
        <div>
          <UserAvatars type="list" users={project.assignees} />
        </div>
        <p>
          <Button size="iconSm" variant="ghost">
            <MoreVertical className="size-6" />
          </Button>
        </p>
      </div>
    </Link>
  );
}

export default ProjectListCard;
