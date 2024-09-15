'use client';

import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspaces-by-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import React from 'react';

function WorkspaceIdPage() {
  const workspaceId = useWorkspaceId();
  const { data } = useGetWorkspace({ id: workspaceId });

  return <div>WorkspaceIdPage {JSON.stringify(data)}</div>;
}

export default WorkspaceIdPage;
