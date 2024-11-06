'use client';

import Editor from '@/components/editor';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import Quill from 'quill';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../convex/_generated/dataModel';
import { useCreateComment } from '../api/use-create-comment';
import CommentList from './comment-list';

type ProjectCommentsProps = {
  projectId: Id<'projects'>;
};

function ProjectComments({ projectId }: ProjectCommentsProps) {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const workspaceId = useWorkspaceId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createComment, isPending: isCommentPending } =
    useCreateComment();

  const editorRef = useRef<Quill | null>(null);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image?: File | null;
  }) => {
    try {
      setIsPending(true);

      editorRef.current?.enable(false);

      const values = {
        projectId,
        body,
        workspaceId,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error('Failed to generate upload url');
        }

        const result = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        });

        if (!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

      await createComment(values, {
        throwError: true,
      });

      setEditorKey(prevKey => prevKey + 1);
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
        <p className="text-2xl font-bold text-black">
          Recent Comments (description)
        </p>
      </div>
      <div className="mt-4">
        <Editor
          key={editorKey}
          variant="create"
          placeholder="Write a new comment..."
          onSubmit={handleSubmit}
          onCancel={() => {}}
          disabled={isPending || isCommentPending}
          innerRef={editorRef}
          isToolbarVisibleProp={false}
        />
      </div>
      <div className="mt-5">
        <CommentList projectId={projectId} />
      </div>
    </div>
  );
}

export default ProjectComments;
