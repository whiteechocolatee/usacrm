'use client';

import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';

function WorkspaceIdPage() {
  const [open, setOpen] = useCreateChannelModal();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { data: member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceIsLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsIsLoading } = useGetChannels({
    workspaceId,
  });

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);
  const isAdmin = useMemo(() => member?.role === 'admin', [member?.role]);

  useEffect(() => {
    if (
      workspaceIsLoading ||
      channelsIsLoading ||
      memberIsLoading ||
      !member ||
      !workspace
    )
      return;

    if (channelId) {
      router.replace(`/workspace/${workspaceId}/channel/${channelId}`);
    } else if (!open && isAdmin) {
      setOpen(true);
    }
  }, [
    memberIsLoading,
    member,
    isAdmin,
    workspaceIsLoading,
    channelsIsLoading,
    workspace,
    channelId,
    workspaceId,
    router,
    open,
    setOpen,
  ]);

  if (workspaceIsLoading || channelsIsLoading || memberIsLoading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-5 animate-spin shrink-0 text-muted-foreground" />
      </div>
    );
  }

  if (!workspace || !member) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <AlertTriangle className="size-5 shrink-0 text-red-600" />
        Workspace not found
      </div>
    );
  }

  return (
    <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
      <AlertTriangle className="size-5 shrink-0 text-red-600" />
      No channel found
    </div>
  );
}

export default WorkspaceIdPage;
