import Hint from '@/components/hint';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';
import { useUpdateImportance } from '../api/use-update-importance';
import { ProjectImportance as ProjectImportanceType } from '../types';
import ProjectImportance from './project-importance';

type ProjectImportanceWrapperProps = {
  importance: ProjectImportanceType;
  projectId: Id<'projects'>;
};

function ProjectImportanceWrapper({
  importance,
  projectId,
}: ProjectImportanceWrapperProps) {
  const [isEdit, setIsEdit] = useState(false);

  const { mutate: updateImportance, isPending: isUpdating } =
    useUpdateImportance();

  const toggleEdit = () => setIsEdit(!isEdit);

  const handleUpdateImportance = (importanceValue: ProjectImportanceType) => {
    updateImportance(
      {
        id: projectId,
        importance: importanceValue,
      },
      {
        onSuccess: () => {
          toast.success('Importance updated!');
          setIsEdit(false);
        },
      },
    );
  };

  return (
    <div className="flex items-center gap-x-2 mt-11">
      <p className="text-custom-grey">Priority:</p>
      {isEdit ? (
        <Select
          disabled={isUpdating}
          onValueChange={handleUpdateImportance}
          defaultValue={importance}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ProjectImportanceType.HIGH}>
              <ProjectImportance
                fallbackClasses="w-fit"
                importance={ProjectImportanceType.HIGH}
              />
            </SelectItem>
            <SelectItem value={ProjectImportanceType.MEDIUM}>
              <ProjectImportance
                fallbackClasses="w-fit"
                importance={ProjectImportanceType.MEDIUM}
              />
            </SelectItem>
            <SelectItem value={ProjectImportanceType.LOW}>
              <ProjectImportance
                fallbackClasses="w-fit"
                importance={ProjectImportanceType.LOW}
              />
            </SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <ProjectImportance fallbackClasses="w-fit" importance={importance} />
      )}
      <div className="ml-auto">
        <Hint label={isEdit ? 'Cancel' : 'Edit priority'} side="left">
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
    </div>
  );
}

export default ProjectImportanceWrapper;
