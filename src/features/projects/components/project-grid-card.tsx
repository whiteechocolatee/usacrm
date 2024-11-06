'use client';

import Hint from '@/components/hint';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar, MoreVertical } from 'lucide-react';
import Link from 'next/link';
import { Project } from '../types';
import ProjectImportance from './project-importance';
import UserAvatars from './user-avatars';

type ProjectGridCardProps = {
  project: Project;
};

function ProjectGridCard({ project }: ProjectGridCardProps) {
  return (
    <Link
      href={`/workspace/${project.workspaceId}/projects/${project._id}`}
      className="w-full bg-white cursor-pointer flex flex-col rounded-xl py-6 px-7"
    >
      <div className="flex items-center justify-between w-full">
        <p className="text-xs text-muted-foreground">#{project.caseId}</p>
        <Hint label="Actions">
          <MoreVertical className="size-6" />
        </Hint>
      </div>
      <div className="flex flex-col gap-y-4">
        <h3 className="text-2xl font-bold line-clamp-1 truncate">
          {project.name}
        </h3>
        <p className="text-sm text-custom-grey font-semibold flex items-center">
          <Calendar className="mr-2 size-6" />
          Created {format(new Date(project._creationTime), 'MMM dd, yyyy')}
        </p>
      </div>
      <div className="mt-12">
        <div className="flex w-full justify-between">
          <p className="font-bold text-sm">
            {project.category ? (
              project.category
            ) : (
              <p className="text-rose-600 underline">No category</p>
            )}
          </p>
          <Badge variant="status">{snakeCaseToTitleCase(project.status)}</Badge>
        </div>
        <div className="flex justify-between items-center mt-5">
          <ProjectImportance
            fallbackClasses="w-fit"
            importance={project.importance}
          />
          <UserAvatars type="grid" users={project.assignees} />
        </div>
      </div>
    </Link>
  );
}

export default ProjectGridCard;
