'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Loader, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

function WorkspaceSwitcher() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  // eslint-disable-next-line
  const [_open, setOpen] = useCreateWorkspaceModal();

  // eslint-disable-next-line
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });

  const filteredWorkspaces = workspaces?.filter(
    workspaceFilter => workspaceFilter._id !== workspaceId,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="size-9 flex items-center relative rounded-md justify-center overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-900 font-semibold text-xl">
        {workspaceLoading ? (
          <Loader className="size-4 animate-spin shrink-0 text-slate-900" />
        ) : (
          workspace?.name.charAt(0).toUpperCase()
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" className="w-64">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex-col justify-start items-start capitalize"
        >
          {workspace?.name}
          <span className="text-xs text-muted-foreground">
            Active workspace
          </span>
        </DropdownMenuItem>
        {filteredWorkspaces?.map(workspaceMap => (
          <DropdownMenuItem
            key={workspaceMap._id}
            className="cursor-pointer capitalize overflow-hidden"
            onClick={() => router.push(`/workspace/${workspaceMap._id}`)}
          >
            <div className="size-9 shrink-0 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2">
              {workspaceMap?.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate">{workspaceMap.name}</p>
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="size-9 relative overflow-hidden bg-[#f2f2f2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2">
            <Plus />
          </div>
          Create a new workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WorkspaceSwitcher;
