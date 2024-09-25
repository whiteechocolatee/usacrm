'use client';

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation';
import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { AlertTriangle, Loader } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import Conversation from './_components/conversation';

function MemberIdPage() {
  const [conversationId, setConversationId] =
    useState<Id<'conversations'> | null>(null);

  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateOrGetConversation();

  useEffect(() => {
    mutate(
      { memberId, workspaceId },
      {
        onSuccess: conversationData => setConversationId(conversationData),
      },
    );
  }, [memberId, workspaceId, mutate]);

  if (isPending) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="h-full flex gap-y-2 flex-col items-center justify-center">
        <AlertTriangle className="size-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground text-center">
          Failed to create conversation. <br /> Please try again later.
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId} />;
}

export default MemberIdPage;
