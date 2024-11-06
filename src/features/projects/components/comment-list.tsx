import { formatDateLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetComments } from '../api/use-get-comments';
import Comment from './comment';

type CommentListProps = {
  projectId: Id<'projects'>;
};

function CommentList({ projectId }: CommentListProps) {
  const { data, isLoading } = useGetComments({ projectId });

  const groupedComments = data?.reduce(
    (groups, message) => {
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

  return isLoading ? (
    <div className="h-full flex items-center justify-center">Loading...</div>
  ) : (
    <>
      {Object.entries(groupedComments || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className="text-left my-2 relative">
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map(message => (
            <Comment
              key={message._id}
              createdAt={message._creationTime}
              memberId={message.memberId}
              image={message.image}
              authorName={message.user?.name}
              authorImage={message.user?.image}
              body={message.body}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default CommentList;
