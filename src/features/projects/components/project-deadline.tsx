import { DatePicker } from '@/components/date-picker';
import Hint from '@/components/hint';
import { format } from 'date-fns';
import { Edit, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';
import { useUpdateDueDate } from '../api/use-update-due-date';

type ProjectDeadLineProps = {
  dueDate: number;
  projectId: Id<'projects'>;
};

function ProjectDeadLine({ dueDate, projectId }: ProjectDeadLineProps) {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const toggleEdit = () => setIsEdit(!isEdit);

  const { mutate: updateDueDate, isPending: isDueDateUpdating } =
    useUpdateDueDate();

  const handleChange = (newDueDate: number) => {
    updateDueDate(
      {
        id: projectId,
        dueDate: newDueDate,
      },
      {
        onSuccess: () => {
          toast.success('Deadline updated!');
          setIsEdit(false);
        },
      },
    );
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-y-2 mt-8">
        {isEdit ? (
          <>
            <p className="text-custom-grey">Choose a new dead line:</p>
            <DatePicker
              disabled={isDueDateUpdating}
              onChange={handleChange}
              initialValue={dueDate}
            />
          </>
        ) : (
          <>
            <p className="text-custom-grey">Dead Line:</p>
            <p>{format(new Date(dueDate), 'MMM dd, yyyy')}</p>
          </>
        )}
      </div>
      <Hint label={isEdit ? 'Cancel' : 'Edit dead line'} side="left">
        {isEdit ? (
          <X
            onClick={toggleEdit}
            className="size-4 cursor-pointer text-muted-foreground"
          />
        ) : (
          <Edit
            onClick={toggleEdit}
            className="size-4 cursor-pointer text-muted-foreground"
          />
        )}
      </Hint>
    </div>
  );
}

export default ProjectDeadLine;
