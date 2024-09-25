/* eslint-disable @typescript-eslint/no-unused-vars */

import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { useToggleReaction } from '@/features/reactions/api/use-create-reactions';
import { useConfirm } from '@/hooks/use-confirm';
import { usePanel } from '@/hooks/use-panel';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Doc, Id } from '../../convex/_generated/dataModel';
import Hint from './hint';
import Reactions from './reactions';
import Thumbnail from './thumbnail';
import Toolbar from './toolbar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import ThreadBar from './thread-bar';

interface MessageProps {
  id?: Id<'messages'>;
  memberId?: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  isAuthor?: boolean;
  reactions?: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      memberIds: Id<'members'>[];
      count: number;
    }
  >;
  body: Doc<'messages'>['body'];
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestamp?: number;
  threadName?: string;
}

const formatFullTime = (date: Date) =>
  // eslint-disable-next-line
  `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

function Message({
  id,
  memberId,
  authorName = 'Member',
  authorImage,
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  isCompact,
  threadName,
}: MessageProps) {
  const { parentMessageId, onOpenMessage, onOpenProfile, onClose } = usePanel();

  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you absolutely sure?',
    'This action cannot be undone. This will permanently delete the message from our servers.',
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleUpdate = ({ body: newBody }: { body: string }) => {
    updateMessage(
      { id: id!, body: newBody },
      {
        onSuccess: () => {
          toast.success('Message updated!');
          setEditingId(null);
        },
        onError: () => {
          toast.error('Failed to update message');
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id: id! },
      {
        onSuccess: () => {
          toast.success('Message deleted successfully!');

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error('Failed to delete message');
        },
      },
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id!, value },
      {
        onError: () => {
          toast.error('Failed to add reaction');
        },
      },
    );
  };

  if (isCompact) {
    return (
      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage &&
            'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
        )}
      >
        <ConfirmationDialog />
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button
              className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline"
              type="button"
            >
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions || []} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timestamp={threadTimestamp}
                onClick={() => onOpenMessage(id!)}
                name={threadName}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id!)}
            handleReaction={handleReaction}
            handleThread={() => onOpenMessage(id!)}
            handleDelete={handleRemove}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
        isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
        isRemovingMessage &&
          'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200',
      )}
    >
      <ConfirmationDialog />
      <div className="flex items-start gap-2">
        <button type="button" onClick={() => onOpenProfile(memberId!)}>
          <Avatar>
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className="w-full h-full">
            <Editor
              onSubmit={handleUpdate}
              disabled={isPending}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant="update"
            />
          </div>
        ) : (
          <div className="flex flex-col w-full overflow-hidden">
            <div className="text-sm">
              <button
                onClick={() => onOpenProfile(memberId!)}
                type="button"
                className="font-bold text-primary hover:underline"
              >
                {authorName}
              </button>
              <span>&nbsp; &nbsp;</span>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {format(new Date(createdAt), 'h:mm a')}
                </button>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
            <Reactions data={reactions || []} onChange={handleReaction} />
            <ThreadBar
              count={threadCount}
              image={threadImage}
              timestamp={threadTimestamp}
              onClick={() => onOpenMessage(id!)}
              name={threadName}
            />
          </div>
        )}
      </div>
      {!isEditing && (
        <Toolbar
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id!)}
          handleReaction={handleReaction}
          handleThread={() => onOpenMessage(id!)}
          handleDelete={handleRemove}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
}

export default Message;
