'use client';

import UserItem from '@/app/workspace/[workspaceId]/_components/user-item';
import Hint from '@/components/hint';
import { useSetProjectAssigneeModal } from '@/hooks/use-set-project-assignee-modal';
import { Edit, Loader2 } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetProjectAssignees } from '../api/use-get-assignees';

type ProjectAssigneesProps = {
  projectId: Id<'projects'>;
};

function ProjectAssignees({ projectId }: ProjectAssigneesProps) {
  const { open } = useSetProjectAssigneeModal();

  const { data: assignees, isLoading: isAssigneesLoading } =
    useGetProjectAssignees({ id: projectId });

  if (isAssigneesLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="size-4 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-custom-grey">Assignees:</p>
        <Hint side="left" label="Edit assignees">
          <Edit
            onClick={open}
            className="size-4 cursor-pointer text-muted-foreground"
          />
        </Hint>
      </div>
      {assignees?.map(assignee => (
        <UserItem
          wrapperClassName="pl-0"
          variant="project"
          key={assignee._id}
          image={assignee.user.image}
          label={assignee.user.name}
          id={assignee._id}
        />
      ))}
    </div>
  );
}

export default ProjectAssignees;
