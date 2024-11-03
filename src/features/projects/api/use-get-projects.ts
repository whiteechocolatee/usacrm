import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetProjectsProps {
  workspaceId: Id<'workspaces'>;
}

export const useGetProjects = ({ workspaceId }: UseGetProjectsProps) => {
  const data = useQuery(api.projects.get, { workspaceId });

  const isLoading = data === undefined;

  return { data, isLoading };
};
