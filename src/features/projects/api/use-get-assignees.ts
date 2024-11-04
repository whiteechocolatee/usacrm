import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetProjectAssigneesProps {
  id: Id<'projects'>;
}

export const useGetProjectAssignees = ({ id }: UseGetProjectAssigneesProps) => {
  const data = useQuery(api.projects.getAssignees, { id });

  const isLoading = data === undefined;

  return { data, isLoading };
};
