import Hint from '@/components/hint';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Assignee } from '../types';

type UserAvatarsProps = {
  users?: Assignee[];
  type: 'list' | 'grid';
};

function UserAvatars({ users = [], type }: UserAvatarsProps) {
  const maxVisible = 3;

  const visibleUsers = users.slice(0, maxVisible);
  const remainingCount = users.length - maxVisible;

  const getInitials = (name: string) => {
    const [firstName, lastName] = name.split(' ');
    return `${firstName[0] || ''}${lastName ? lastName[0] : firstName[1] || ''}`.toUpperCase();
  };

  return (
    <div className="flex w-[100px] items-center">
      {users.length
        ? visibleUsers.map((user, index) => (
            <div
              key={user._id}
              className={cn(
                'size-6 rounded-full bg-custom-blue flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white',
                type === 'grid' && index !== 0 ? '-ml-2' : '-ml-1',
              )}
            >
              {user.image ? (
                <Image
                  width={40}
                  height={40}
                  src={user?.image || ''}
                  alt={user?.name || ''}
                  className="size-6 rounded-full object-cover"
                />
              ) : (
                <Hint label={user.name}>
                  <span className="text-[10px]">{getInitials(user.name!)}</span>
                </Hint>
              )}
            </div>
          ))
        : 'No assignees'}

      {remainingCount > 0 && (
        <div
          className={cn(
            'size-6 rounded-full bg-custom-blue text-[10px] flex items-center justify-center text-white font-bold -ml-1 border-2 border-white',
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

export default UserAvatars;
