import Hint from '@/components/hint';
import { Edit } from 'lucide-react';
import React from 'react';
import { Id } from '../../../../convex/_generated/dataModel';

type ProjectCategoryProps = {
  category: string;
  projectId: Id<'projects'>;
};

// TODO: Add project category modal
// eslint-disable-next-line
function ProjectCategory({ category, projectId }: ProjectCategoryProps) {
  return (
    <div className="flex mt-8 items-center justify-between gap-x-2">
      <div className="bg-custom-white flex gap-x-4 items-center rounded-xl py-2 px-4">
        <p className="text-custom-grey">Category:</p>
        <p>{category || 'No category'}</p>
      </div>
      <Hint label="Edit category" side="left">
        <Edit className="size-4 cursor-pointer text-muted-foreground" />
      </Hint>
    </div>
  );
}

export default ProjectCategory;
