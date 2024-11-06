'use client';

import Thread from '@/components/thread';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Profile from '@/features/members/components/profile';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Id } from '../../../../convex/_generated/dataModel';
import Sidebar from './_components/sidebar';
import Toolbar from './_components/toolbar';
import WorkspaceSidebar from './_components/workspace-sidebar';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

function WorkspaceIdLayout({ children }: WorkspaceIdLayoutProps) {
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const showPanel = !!parentMessageId || !!profileMemberId;

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="ls-workspace-layout"
        >
          <ResizablePanel
            defaultSize={20}
            minSize={11}
            maxSize={17}
            className="bg-custom-blue"
          >
            <WorkspaceSidebar />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel className="relative" minSize={20} defaultSize={80}>
            <Image
              src="/bordered.png"
              width={16}
              height={16}
              className="size-4 absolute top-0 left-0"
              alt="logo"
            />
            <div className="pt-2 h-full">{children}</div>
          </ResizablePanel>
          {showPanel && (
            <ResizablePanel minSize={20} maxSize={20}>
                {/* eslint-disable-next-line */}
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;
