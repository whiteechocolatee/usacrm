'use client';

import { MultipleUserSelector } from '@/components/multiple-selector';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useProjectId } from '@/hooks/use-project-id';
import { useSetProjectAssigneeModal } from '@/hooks/use-set-project-assignee-modal';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { FaUsers } from 'react-icons/fa';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';
import { useSetProjectAssignees } from '../api/use-set-assignees';
import { useGetProjectAssignees } from '../api/use-get-assignees';

// eslint-disable-next-line
const ModalContent = () => {
  const [selectedUserIdsArray, setSelectedUserIdsArray] = React.useState<
    Id<'users'>[]
  >([]);

  const workspaceId = useWorkspaceId();
  const projectId = useProjectId();

  const { close } = useSetProjectAssigneeModal();

  const { data: assignees, isLoading: assigneesIsLoading } =
    useGetProjectAssignees({
      id: projectId,
    });
  const { data: members, isLoading: membersIsLoading } = useGetMembers({
    workspaceId,
  });
  const { mutate, isPending } = useSetProjectAssignees();

  const isLoading = assigneesIsLoading || membersIsLoading || isPending;

  if (membersIsLoading) {
    return (
      <div className="h-60 flex justify-center items-center">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const remapedMembersArray = members?.map(member => ({
    user: member.user,
    _id: member.user._id,
  }));

  const initialValues = assignees?.map(assignee => assignee.user._id) || [];

  const handleChange = (selectedUserIds: Id<'users'>[]) => {
    setSelectedUserIdsArray(selectedUserIds);
  };

  const handleSubmitAssignees = () => {
    mutate(
      {
        assignees: selectedUserIdsArray,
        id: projectId,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success('Assignees updated!');
          close();
        },
      },
    );
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Choose assignees</DialogTitle>
      </DialogHeader>
      <MultipleUserSelector
        // @ts-expect-error: Type mismatch due to user structure
        users={remapedMembersArray}
        onChange={handleChange}
        initialValues={initialValues}
        placeholder="Select assignees..."
      />
      <Button
        disabled={isLoading}
        className="w-fit ml-auto"
        variant="primary"
        onClick={handleSubmitAssignees}
      >
        <FaUsers className="mr-2 size-4" />
        Set assignees
      </Button>
    </>
  );
};

function SetProjectAssigneeModal() {
  const { isOpen, close } = useSetProjectAssigneeModal();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>{isOpen && <ModalContent />}</DialogContent>
    </Dialog>
  );
}

export default SetProjectAssigneeModal;
