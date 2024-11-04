import UserItem from '@/app/workspace/[workspaceId]/_components/user-item';
import { Button } from '@/components/ui/button';
import { useProjectId } from '@/hooks/use-project-id';
import { useSetProjectAssigneeModal } from '@/hooks/use-set-project-assignee-modal';
import { Loader2 } from 'lucide-react';
import { LuUserPlus2 } from 'react-icons/lu';
import { useGetProjectAssignees } from '../api/use-get-assignees';

function ProjectAssignees() {
  const projectId = useProjectId();
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
      <Button variant="link" onClick={open} className="text-xs p-0">
        <LuUserPlus2 className="mr-2 size-4" /> Edit
      </Button>
    </div>
  );
}

export default ProjectAssignees;
