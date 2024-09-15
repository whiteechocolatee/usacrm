'use client';

import React from 'react';
import Toolbar from './_components/toolbar';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

function WorkspaceIdLayout({ children }: WorkspaceIdLayoutProps) {
  return (
    <div className="h-full ">
      <Toolbar />
      {children}
    </div>
  );
}

export default WorkspaceIdLayout;
