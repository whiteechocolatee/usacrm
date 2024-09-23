/* eslint-disable @typescript-eslint/no-unused-vars */

import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { Doc, Id } from '../../convex/_generated/dataModel';
import Hint from './hint';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import Thumbnail from './thumbnail';

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
}

const formatFullTime = (date: Date) =>
  // eslint-disable-next-line
  `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });

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
}: MessageProps) {
  if (isCompact) {
    return (
      <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
        <div className="flex items-start gap-2">
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button
              className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline"
              type="button"
            >
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          <div className="flex flex-col w-full">
            <Renderer value={body} />
            <Thumbnail url={image} />
            {updatedAt ? (
              <span className="text-xs text-muted-foreground">(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative">
      <div className="flex items-start gap-2 ">
        <button type="button">
          <Avatar>
            <AvatarImage className="rounded-md" src={authorImage} />
            <AvatarFallback className="rounded-md bg-sky-500 text-white">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </button>
        <div className="flex flex-col w-full overflow-hidden">
          <div className="text-sm">
            <button
              onClick={() => {}}
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
        </div>
      </div>
    </div>
  );
}

export default Message;
