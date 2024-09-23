/* eslint-disable @typescript-eslint/no-unused-vars */

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { GetMessagesReturnType } from '@/features/messages/api/use-get-message';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { Id } from '../../convex/_generated/dataModel';
import ChannelHero from './channel-hero';
import Message from './message';

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
  data: GetMessagesReturnType | undefined;
  loadMore?: () => void;
  isLoadingMore?: boolean;
  canLoadMore?: boolean;
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'EEEE, MMMM d');
};

function MessageList({
  memberImage,
  memberName,
  channelName,
  channelCreationTime,
  data,
  variant = 'channel',
  loadMore,
  isLoadingMore,
  canLoadMore,
}: MessageListProps) {
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const groupedMessages = data?.reduce(
    (groups, message) => {
      // eslint-disable-next-line
      const date = new Date(message?._creationTime ?? Date.now());
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof data>,
  );

  return (
    <div className="flex-1 flex flex-col-reverse pb-4 overflow-x-auto messages-scrollbar">
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-center my-2 relative">
            <hr className="absolute top-3.5 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];

            const isCompact =
              prevMessage &&
              message?.user?._id === prevMessage.user?._id &&
              differenceInMinutes(
                // eslint-disable-next-line
                new Date(message?._creationTime || 0),
                // eslint-disable-next-line
                new Date(prevMessage._creationTime || 0),
              ) < TIME_THRESHOLD;

            return (
              <Message
                key={message?._id}
                id={message?._id}
                memberId={message?.memberId}
                authorImage={message?.user?.image}
                authorName={message?.user?.name}
                isAuthor={message?.memberId === currentMember?._id}
                // @ts-expect-error: message.reactions may be undefined
                reactions={message?.reactions}
                body={message?.body || ''}
                isEditing={editingId === message?._id}
                setEditingId={setEditingId}
                isCompact={isCompact!}
                hideThreadButton={variant === 'thread'}
                image={message?.image}
                updatedAt={message?.updatedAt}
                // eslint-disable-next-line
                createdAt={message?._creationTime!}
                threadCount={message?.threadCount}
                threadImage={message?.threadImage}
                threadTimestamp={message?.threadTimestamp}
              />
            );
          })}
        </div>
      ))}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
}

export default MessageList;
