'use client';

import MessageList from '@/components/message-list';
import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useGetMessages } from '@/features/messages/api/use-get-message';
import { useChannelId } from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import Header from './_components/header';
import ChatInput from './chat-input';

function ChannelIdPage() {
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({
    channelId,
  });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="size-5 animate-spin shrink-0 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="h-full flex-1 flex flex-col gap-y-2 items-center justify-center">
        <TriangleAlert className="size-5 shrink-0 text-red-600" />
        <span className="text-muted-foreground text-sm">Channel not found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        // eslint-disable-next-line
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />

      <ChatInput
        placeholder={`Type a message to "${channel.name.split('-').join(' ')}"...`}
      />
    </div>
  );
}

export default ChannelIdPage;
