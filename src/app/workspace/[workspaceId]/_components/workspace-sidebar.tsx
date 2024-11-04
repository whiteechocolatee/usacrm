import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, HashIcon, Loader } from 'lucide-react';
import SidebarItem from './sidebar-item';
import UserItem from './user-item';
import WorkspaceHeader from './workspace-header';
import WorkspaceSection from './workspace-section';

function WorkspaceSidebar() {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const memberId = useMemberId();

  const { data: member, isLoading: memberIsLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceIsLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsIsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersIsLoading } = useGetMembers({
    workspaceId,
  });

  if (memberIsLoading || workspaceIsLoading) {
    return (
      <div className="flex flex-col bg-custom-blue h-full items-center justify-center">
        <Loader className="size-5 animate-spin shrink-0 text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-custom-blue h-full items-center justify-center">
        <AlertTriangle className="size-5 shrink-0 " />
        <p className="text-white text-sm">Something went wrong</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-custom-blue h-full">
      <WorkspaceHeader
        isAdmin={member.role === 'admin'}
        workspace={workspace}
      />
      <WorkspaceSection label="Projects" hint="New Channel" onNew={undefined}>
        {channelsIsLoading ? (
          <Loader className="size-5 shrink-0 text-white" />
        ) : (
          channels?.map(item => (
            <SidebarItem
              key={item._id}
              label={item.name}
              id={item._id}
              variant={channelId === item._id ? 'active' : 'default'}
              icon={HashIcon}
            />
          ))
        )}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Messages"
        hint="New Direct Message"
        onNew={() => {}}
      >
        {membersIsLoading ? (
          <Loader className="size-5 shrink-0 text-white" />
        ) : (
          members?.map(item => (
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? 'active' : 'default'}
            />
          ))
        )}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSidebar;
