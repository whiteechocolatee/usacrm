import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetCommentsProps {
  projectId: Id<'projects'>;
}

export const useGetComments = ({ projectId }: UseGetCommentsProps) => {
  const data = useQuery(api.projects.getComments, {
    projectId,
  });

  const isLoading = data === undefined;

  return { data, isLoading };
};
