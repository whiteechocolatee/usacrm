'use client';

import Editor from '@/components/editor';
import Hint from '@/components/hint';
import Renderer from '@/components/renderer';
import { Edit, X } from 'lucide-react';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { useUpdateDescription } from '../api/use-update-description';

type ProjectDescriptionProps = {
  projectId: Id<'projects'>;
  description?: Doc<'projects'>['description'] | undefined;
};

function ProjectDescription({
  projectId,
  description,
}: ProjectDescriptionProps) {
  const [isEdit, setIsEdit] = useState<boolean>(!description);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const { mutate: updateDescription } = useUpdateDescription();

  const editorRef = useRef<Quill | null>(null);

  const toggleEdit = () => setIsEdit(!isEdit);

  const handleSubmit = async ({ body }: { body: string }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values = {
        id: projectId,
        description: body,
      };

      await updateDescription(values, {
        throwError: true,
      });

      setEditorKey(prevKey => prevKey + 1);
      toggleEdit();
      toast.success('Description saved!');
    } catch (error) {
      toast.error(`Failed to create description - ${error}`);
    } finally {
      editorRef.current?.enable(true);
      setIsPending(false);
    }
  };

  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-bold text-black">Description</p>
        {isEdit ? (
          <Hint label="Cancel Editing">
            <X
              onClick={toggleEdit}
              className="size-6 text-muted-foreground cursor-pointer"
            />
          </Hint>
        ) : (
          <Hint label="Edit Description">
            <Edit
              onClick={toggleEdit}
              className="size-6 text-muted-foreground cursor-pointer"
            />
          </Hint>
        )}
      </div>
      <div className="mt-4">
        {description && !isEdit ? (
          <Renderer value={description} />
        ) : (
          <Editor
            key={editorKey}
            variant="update"
            placeholder="Write a description..."
            onSubmit={handleSubmit}
            onCancel={toggleEdit}
            disabled={isPending}
            defaultValue={description && JSON.parse(description)}
            innerRef={editorRef}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectDescription;
