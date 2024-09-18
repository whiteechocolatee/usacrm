import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useState } from 'react';
import { useCreateChannel } from '../api/use-create-channel';
import { useCreateChannelModal } from '../store/use-create-channel-modal';

function CreateChannelModal() {
  const { isPending, mutate } = useCreateChannel();
  const workspaceId = useWorkspaceId();

  const [name, setName] = useState('');
  const [open, setOpen] = useCreateChannelModal();

  const handleClose = () => {
    setName('');
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();

    setName(value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      { name, workspaceId },
      {
        // eslint-disable-next-line
        onSuccess: id => {
          // TODO: do something with id

          handleClose();
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a channel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={name}
            disabled={isPending}
            onChange={handleChange}
            required
            placeholder="e.g. plan-budget"
            autoFocus
            minLength={3}
            maxLength={80}
          />
          <div className="flex justify-end">
            <Button disabled={isPending}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateChannelModal;
