import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetMembers } from '@/features/channels/api/use-get-members';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from 'lucide-react';
import SidebarItem from './sidebar-item';
import UserItem from './user-item';
import WorkspaceHeader from './workspace-header';
import WorkspaceSection from './workspace-section';

function WorkspaceSidebar() {
  // eslint-disable-next-line
  const [_open, setOpen] = useCreateChannelModal();
  const workspaceId = useWorkspaceId();

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
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem label="Threads" id="threads" icon={MessageSquareText} />
        <SidebarItem label="Drafts & Sent" id="threads" icon={SendHorizontal} />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New Channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channelsIsLoading ? (
          <Loader className="size-5 shrink-0 text-white" />
        ) : (
          channels?.map(item => (
            <SidebarItem
              key={item._id}
              label={item.name}
              id={item._id}
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
            />
          ))
        )}
      </WorkspaceSection>
    </div>
  );
}

export default WorkspaceSidebar;
