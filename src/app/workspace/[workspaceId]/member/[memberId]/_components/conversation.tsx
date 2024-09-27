import MessageList from '@/components/message-list';
import { useGetMember } from '@/features/members/api/use-get-member';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { useMemberId } from '@/hooks/use-member-id';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import ChatInput from './chat-input';
import Header from './header';

type Props = {
  id: Id<'conversations'>;
};

function Conversation({ id }: Props) {
  const memberId = useMemberId();

  const { onOpenProfile } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const { results, status, loadMore } = useGetMessages({
    conversationId: id,
  });

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberImage={Array.isArray(member) ? '' : member?.user?.image}
        memberName={Array.isArray(member) ? '' : member?.user?.name}
        onClick={() => onOpenProfile(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberImage={Array.isArray(member) ? '' : member?.user?.image}
        memberName={Array.isArray(member) ? '' : member?.user?.name}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput
        placeholder={`Message to ${Array.isArray(member) ? '' : member?.user?.name}...`}
        conversationId={id}
      />
    </div>
  );
}

export default Conversation;
