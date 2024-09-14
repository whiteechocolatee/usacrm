import React from 'react';

type Props = {
  params: { workspaceId: string };
};

function WorkspaceIdPage({ params: { workspaceId } }: Props) {
  return <div>WorkspaceIdPage {workspaceId}</div>;
}

export default WorkspaceIdPage;
