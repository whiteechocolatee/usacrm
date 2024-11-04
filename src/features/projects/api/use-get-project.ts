import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetProjectProps {
  id: Id<'projects'>;
}

export const useGetProject = ({ id }: UseGetProjectProps) => {
  const data = useQuery(api.projects.getById, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};
