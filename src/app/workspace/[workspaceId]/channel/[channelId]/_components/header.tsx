import { Button } from '@/components/ui/button';
import { FaChevronDown } from 'react-icons/fa';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useChannelId } from '@/hooks/use-channel-id';
import { TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { toast } from 'sonner';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';

type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you absolutely sure?',
    'This action cannot be undone. This will permanently delete channel and remove channel data from servers.',
  );

  const router = useRouter();

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [value, setValue] = useState(title);
  const [editOpen, setEditOpen] = useState(false);

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: isUpdatePending } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovePending } =
    useRemoveChannel();

  const handleEditOpen = (editValue: boolean) => {
    if (member?.role !== 'admin') {
      return;
    }

    setEditOpen(editValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\s+/g, '-').toLowerCase();

    setValue(newValue);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      { id: channelId, name: value },
      {
        onSuccess: () => {
          toast.success('Channel updated!');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel');
        },
      },
    );
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel deleted!');
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to delete channel');
        },
      },
    );
  };

  return (
    <div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
      <ConfirmationDialog />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-lg font-semibold px-2 overflow-hidden w-auto"
            size="sm"
          >
            <span className="truncate"># {title}</span>
            <FaChevronDown className="size-2.5 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle className="text-lg font-semibold">
              # {title}
            </DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-slate-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold ">Channel name</p>
                    {member?.role === 'admin' && (
                      <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                        Edit
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground"># {title}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    value={value}
                    disabled={isUpdatePending}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g. plan-budget"
                  />
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline" disabled={isUpdatePending}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatePending}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                onClick={handleDelete}
                disabled={isRemovePending}
                type="button"
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-slate-50 text-rose-600"
              >
                <TrashIcon className="size-4 " />
                <p className="text-sm font-semibold">Delete channel</p>
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;