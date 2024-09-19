import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code';
import { useConfirm } from '@/hooks/use-confirm';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Copy, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

type InviteModalProps = {
  open: boolean;
  name: string;
  joinCode: string;
  setOpen: (open: boolean) => void;
};

function InviteModal({ open, setOpen, name, joinCode }: InviteModalProps) {
  const workspaceId = useWorkspaceId();
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure?',
    'This will deactivate current invitations.',
  );

  const { mutate, isPending } = useNewJoinCode();

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success('New join code created!');
        },
        onError: () => {
          toast.error('Failed to create new join code');
        },
      },
    );
  };

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        toast.success('Invite link copied to clipboard!');
      })
      .catch(error => {
        toast.error(error.message);
      });
  };

  return (
    <>
      <ConfirmationDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite people to {name}</DialogTitle>
            <DialogDescription>
              Use the code below to invite people to your workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-y-4 items-center justify-center py-10">
            <p className="text-4xl font-bold tracking-widest uppercase">
              {joinCode}
            </p>
            <Button
              disabled={isPending}
              onClick={handleCopy}
              variant="ghost"
              size="sm"
            >
              Copy link <Copy className="size-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isPending}
              onClick={handleNewCode}
              variant="outline"
              size="sm"
            >
              New code
              <RefreshCcw className="size-4 ml-2" />
            </Button>
            <DialogClose asChild>
              <Button disabled={isPending}>Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default InviteModal;
