import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGetMessage } from '@/features/messages/api/use-get-message';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { AlertTriangle, Loader, XIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';
import Message from './message';
import { Button } from './ui/button';
import { TIME_THRESHOLD } from './message-list';

type Props = {
  messageId: Id<'messages'>;
  onClose: () => void;
};

type CreateMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  parentMessageId: Id<'messages'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

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

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

function Thread({ messageId, onClose }: Props) {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const channelId = useChannelId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({
    workspaceId,
  });
  const { data: message, isLoading: isMessageLoading } = useGetMessage({
    id: messageId,
  });

  const { results, status, loadMore } = useGetMessages({
    channelId,
    parentMessageId: messageId,
  });

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image?: File | null;
  }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        parentMessageId: messageId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error('Failed to generate upload url');
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createMessage(values, {
        throwError: true,
      });

      setEditorKey(prevKey => prevKey + 1);
    } catch (error) {
      toast.error(`Failed to send message - ${error}`);
    } finally {
      editorRef.current?.enable(true);
      setIsPending(false);
    }
  };

  const groupedMessages = results?.reduce(
    (groups, threadMessage) => {
      // eslint-disable-next-line
      const date = new Date(threadMessage?._creationTime ?? Date.now());
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      groups[dateKey].unshift(threadMessage);

      return groups;
    },
    {} as Record<string, typeof results>,
  );

  if (isMessageLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5" />
          <p className="text-center text-sm text-muted-foreground">
            No messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] px-4 border-b">
        <p className="text-lg font-bold">Thread</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-x-auto messages-scrollbar">
        {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            <div className="text-center my-2 relative">
              <hr className="absolute top-3.5 left-0 right-0 border-t border-gray-300" />
              <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
                {formatDateLabel(dateKey)}
              </span>
            </div>
            {messages.map((threadMessage, index) => {
              const prevMessage = messages[index - 1];

              const isCompact =
                prevMessage &&
                threadMessage?.user?._id === prevMessage.user?._id &&
                differenceInMinutes(
                  // eslint-disable-next-line
                  new Date(message?._creationTime || 0),
                  // eslint-disable-next-line
                  new Date(prevMessage._creationTime || 0),
                ) < TIME_THRESHOLD;

              return (
                <Message
                  key={threadMessage?._id}
                  id={threadMessage?._id}
                  memberId={threadMessage?.memberId}
                  authorImage={threadMessage?.user?.image}
                  authorName={threadMessage?.user?.name}
                  isAuthor={threadMessage?.memberId === currentMember?._id}
                  reactions={threadMessage?.reactions}
                  body={threadMessage?.body || ''}
                  isEditing={editingId === threadMessage?._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact!}
                  hideThreadButton
                  image={threadMessage?.image}
                  updatedAt={threadMessage?.updatedAt}
                  // eslint-disable-next-line
                  createdAt={threadMessage?._creationTime!}
                  threadCount={threadMessage?.threadCount}
                  threadImage={threadMessage?.threadImage}
                  threadTimestamp={threadMessage?.threadTimestamp}
                  threadName={threadMessage?.threadName}
                />
              );
            })}
          </div>
        ))}
        {loadMore && canLoadMore && (
          <div
            className="h-1"
            // eslint-disable-next-line
            ref={el => {
              if (el) {
                const observer = new IntersectionObserver(
                  ([entry]) => {
                    if (entry.isIntersecting && canLoadMore) {
                      loadMore();
                    }
                  },
                  {
                    threshold: 1.0,
                  },
                );

                observer.observe(el);

                return () => observer.disconnect();
              }
            }}
          />
        )}
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-3.5 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="w-4 h-4 animate-spin" />
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorName={message.user.name}
          authorImage={message.user.image}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
      <div className="px-4">
        <Editor
          onSubmit={handleSubmit}
          key={editorKey}
          disabled={isPending}
          innerRef={editorRef}
          placeholder="Reply...."
        />
      </div>
    </div>
  );
}

export default Thread;
