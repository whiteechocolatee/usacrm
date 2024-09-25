import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Loader, MailIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/use-get-member';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

function Profile({ memberId, onClose }: ProfileProps) {
  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  if (memberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
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

  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5" />
          <p className="text-center text-sm text-muted-foreground">
            No member or profile
          </p>
        </div>
      </div>
    );
  }

  const avatarFallback = Array.isArray(member)
    ? ''
    : member?.user?.name!.charAt(0).toUpperCase();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center h-[49px] px-4 border-b">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size="iconSm" variant="ghost">
          <XIcon className="size-5 stroke-1.5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center p-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full">
          <AvatarImage src={Array.isArray(member) ? '' : member?.user?.image} />
          <AvatarFallback className="rounded-md text-6xl bg-sky-500 text-white aspect-square">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-col p-4">
        <p className="text-xl font-bold">
          {Array.isArray(member) ? '' : member?.user?.name}
        </p>
      </div>
      <Separator />
      <div className="flex flex-col p-4">
        <p className="text-sm font-bold mb-4">Contact information</p>
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-md bg-muted flex items-center justify-center">
            <MailIcon className="size-4 stroke-1.5" />
          </div>
          <div className="flex flex-col">
            <p className="text-[13px] font-semibold text-muted-foreground">
              E-mail
            </p>
            <Link
              href={`mailto:${Array.isArray(member) ? '' : member?.user?.email}`}
              className="text-sm hover:underline text-[#1264a3]"
            >
              {Array.isArray(member) ? '' : member?.user?.email}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
