import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';
import { useCurrentMember } from '../api/use-current-member';
import { useGetMember } from '../api/use-get-member';
import { useRemoveMember } from '../api/use-remove-member';
import { useUpdateMember } from '../api/use-update-member';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

function Profile({ memberId, onClose }: ProfileProps) {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: currentMemberLoading } =
    useCurrentMember({ workspaceId });

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });

  const [LeaveDialog, confirmLeave] = useConfirm(
    'Leave workspace',
    'Are you sure you want to leave this workspace?',
  );
  const [UpdateDialog, confirmUpdate] = useConfirm(
    'Update role',
    'Are you sure you want to update this member role?',
  );
  const [RemoveDialog, confirmRemove] = useConfirm(
    'Remove member',
    'Are you sure you want to remove this member?',
  );

  const { mutate: updateMember } = useUpdateMember();
  const { mutate: removeMember } = useRemoveMember();

  const onRemove = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success('Member removed!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to remove member');
        },
      },
    );
  };

  const onLeave = async () => {
    const ok = await confirmLeave();

    if (!ok) return;

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          router.replace('/');
          toast.success('You left the workspace!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to leave workspace');
        },
      },
    );
  };

  const onUpdate = async (role: 'admin' | 'member') => {
    const ok = await confirmUpdate();

    if (!ok) return;

    updateMember(
      {
        id: memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success('Role changed!');
          onClose();
        },
        onError: () => {
          toast.error('Failed to change role');
        },
      },
    );
  };

  if (memberLoading || currentMemberLoading) {
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
    <>
      <RemoveDialog />
      <UpdateDialog />
      <LeaveDialog />
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center h-[49px] px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-1.5" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage
              src={Array.isArray(member) ? '' : member?.user?.image}
            />
            <AvatarFallback className="rounded-md text-6xl bg-sky-500 text-white aspect-square">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col p-4">
          <p className="text-xl font-bold">
            {Array.isArray(member) ? '' : member?.user?.name}
          </p>
          {/* eslint-disable-next-line */}
          {currentMember?.role === 'admin' && currentMember._id !== memberId ? (
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full capitalize">
                    {Array.isArray(member) ? '' : member?.role}{' '}
                    <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={Array.isArray(member) ? '' : member?.role}
                    onValueChange={role => onUpdate(role as 'admin' | 'member')}
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={onRemove}
                variant="outline"
                className="w-full capitalize"
              >
                Remove
                <XIcon className="size-4 ml-2" />
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember.role !== 'admin' ? (
            <div className="mt-4">
              <Button onClick={onLeave} className="w-full" variant="outline">
                Leave
              </Button>
            </div>
          ) : null}
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
    </>
  );
}

export default Profile;
