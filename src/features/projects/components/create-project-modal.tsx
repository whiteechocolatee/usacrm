'use client';

import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateProjectsModal } from '@/hooks/use-create-project-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCreateProject } from '../api/use-create-project';
import { ProjectImportance } from '../types';

function CreateProjectModal() {
  const workspaceId = useWorkspaceId();

  const [name, setName] = useState<string>('');
  const [caseId, setCaseId] = useState<string>('');
  const [importance, setImportance] = useState<ProjectImportance>(
    ProjectImportance.LOW,
  );
  const [dueDate, setDueDate] = useState<number>(0);

  const { isOpen, close } = useCreateProjectsModal();
  const { mutate, isPending } = useCreateProject();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(
      {
        caseId,
        name,
        importance,
        workspaceId,
        dueDate,
      },
      {
        onSuccess: () => {
          toast.success('Project created!');
          setName('');
          setCaseId('');
          setImportance(ProjectImportance.LOW);
          setDueDate(0);
          close();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-y-1">
            <p className="text-slate-500 text-xs">Enter the project number</p>
            <Input
              placeholder="№0001265"
              value={caseId}
              disabled={isPending}
              min={2}
              max={256}
              required
              onChange={e => setCaseId(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-slate-500 text-xs">
              Enter the name of the project
            </p>
            <Input
              placeholder="Immigration Law"
              value={name}
              required
              disabled={isPending}
              min={2}
              max={256}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-slate-500 text-xs">
              Choose the deadline of the project
            </p>
            <DatePicker disabled={isPending} onChange={setDueDate} required />
          </div>
          <div className="flex flex-col gap-y-1">
            <p className="text-slate-500 text-xs">
              Choose the importance of the project
            </p>
            <Select
              onValueChange={e => setImportance(e as ProjectImportance)}
              defaultValue={importance}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project importance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ProjectImportance.LOW}>Low</SelectItem>
                <SelectItem value={ProjectImportance.MEDIUM}>Medium</SelectItem>
                <SelectItem value={ProjectImportance.HIGH}>High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-x-4 justify-end">
            <Button
              disabled={isPending}
              type="button"
              variant="outline"
              onClick={close}
            >
              Cancel
            </Button>
            <Button disabled={isPending} type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProjectModal;
