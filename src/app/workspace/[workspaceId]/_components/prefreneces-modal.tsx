import { Button } from '@/components/ui/button';
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
import { useRemoveWorkspace } from '@/features/workspaces/api/use-remove-workspace';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';

import { useConfirm } from '@/hooks/use-confirm';
import { Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../../convex/_generated/dataModel';

type PreferencesModalProps = {
  open: boolean;
  workspaceId: Id<'workspaces'>;
  initialValue: string;
  setOpen: (open: boolean) => void;
};

function PreferencesModal({
  open,
  setOpen,
  initialValue,
  workspaceId,
}: PreferencesModalProps) {
  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure you want to remove this workspace?',
    'This action is irreversible. You will remove the workspace and all its data.',
  );

  const router = useRouter();

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();
  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEditOpen(false);

    updateWorkspace(
      { name: value, id: workspaceId },
      {
        onSuccess: () => {
          toast.success('Workspace updated!');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update workspace');
        },
      },
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success('Workspace removed!');
          router.replace('/');
          setOpen(false);
        },
        onError: () => {
          toast.error('Failed to remove workspace');
        },
      },
    );
  };

  return (
    <>
      <ConfirmationDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 bg-gray-50 overflow-hidden">
          <DialogHeader className="p-4 border-b bg-white">
            <DialogTitle>{value}</DialogTitle>
          </DialogHeader>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Workspace name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                  <p className="text-sm">{value}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleEdit}>
                  <Input
                    value={value}
                    disabled={isUpdatingWorkspace}
                    required
                    autoFocus
                    minLength={3}
                    placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    maxLength={80}
                    onChange={e => setValue(e.target.value)}
                  />
                  <DialogFooter>
                    <DialogClose>
                      <Button variant="outline" disabled={isUpdatingWorkspace}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={isUpdatingWorkspace}>
                      {isUpdatingWorkspace ? 'Renaming...' : 'Rename'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <button
              type="button"
              disabled={isRemovingWorkspace}
              onClick={handleRemove}
              className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600"
            >
              <Trash className="size-4 " />
              <p className="text-sm font-semibold">Delete workspace</p>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PreferencesModal;
