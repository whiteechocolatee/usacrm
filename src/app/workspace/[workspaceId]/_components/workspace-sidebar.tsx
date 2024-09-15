import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, Loader } from 'lucide-react';
import WorkspaceHeader from './workspace-header';

function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();

  const { data: member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceIsLoading } = useGetWorkspace({
    id: workspaceId,
  });

  if (memberIsLoading || workspaceIsLoading) {
    return (
      <div className="flex flex-col bg-[#5e2c5f] h-full items-center justify-center">
        <Loader className="size-5 animate-spin shrink-0 text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5e2c5f] h-full items-center justify-center">
        <AlertTriangle className="size-5 shrink-0 " />
        <p className="text-white text-sm">Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5e2c5f] h-full">
      <WorkspaceHeader
        isAdmin={member.role === 'admin'}
        workspace={workspace}
      />
    </div>
  );
}

export default WorkspaceSidebar;
