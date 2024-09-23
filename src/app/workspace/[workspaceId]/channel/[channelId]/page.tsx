'use client';

import { useGetChannel } from '@/features/channels/api/use-get-channel';
import { useGetMessages } from '@/features/messages/api/use-get-message';
import { useChannelId } from '@/hooks/use-channel-id';
import { Loader, TriangleAlert } from 'lucide-react';
import Header from './_components/header';
import ChatInput from './chat-input';

function ChannelIdPage() {
  const channelId = useChannelId();

  const { results } = useGetMessages({
    channelId,
  });
  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  if (channelLoading) {
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
      <div className="flex-1">{JSON.stringify(results)}</div>

      <ChatInput
        placeholder={`Type a message to "${channel.name.split('-').join(' ')}"...`}
      />
    </div>
  );
}

export default ChannelIdPage;
