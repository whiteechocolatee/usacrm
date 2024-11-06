import Hint from '@/components/hint';
import Thumbnail from '@/components/thumbnail';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePanel } from '@/hooks/use-panel';
import { cn } from '@/lib/utils';
import { format, isToday, isYesterday } from 'date-fns';
import dynamic from 'next/dynamic';
import { Doc, Id } from '../../../../convex/_generated/dataModel';

interface MessageProps {
  createdAt: Doc<'comments'>['_creationTime'];
  authorName?: string;
  body: Doc<'comments'>['body'];
  authorImage?: string;
  image: string | null | undefined;
  memberId?: Id<'members'>;
}

const formatFullTime = (date: Date) =>
  // eslint-disable-next-line
  `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });

function Comment({
  memberId,
  authorName = 'Member',
  authorImage,
  body,
  image,
  createdAt,
}: MessageProps) {
  const { onOpenProfile } = usePanel();

  const avatarFallback = authorName.charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-1.5 px-5 pl-0 hover:bg-gray-100/60 group relative',
      )}
    >
      <div className="flex items-start gap-2">
        <button type="button" onClick={() => onOpenProfile(memberId!)}>
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
        </div>
      </div>
    </div>
  );
}

export default Comment;
