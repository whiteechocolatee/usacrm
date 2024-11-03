'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateProjectsModal } from '@/hooks/use-create-project-modal';
import { useState } from 'react';

function CreateProjectModal() {
  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');

  const { isOpen, close } = useCreateProjectsModal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="№0001265"
            value={id}
            min={2}
            max={256}
            required
            onChange={e => setId(e.target.value)}
          />
          <Input
            placeholder="Case name"
            value={name}
            required
            min={2}
            max={256}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex gap-x-4 justify-end">
            <Button variant="outline" onClick={close}>
              Cancel
            </Button>
            <Button type="submit" className="bg-custom-blue" disabled={false}>
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectModal;
