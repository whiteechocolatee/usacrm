import { defineSchema, defineTable } from 'convex/server';
import { authTables } from '@convex-dev/auth/server';
import { v } from 'convex/values';
import {
  ProjectImportance,
  ProjectStatus,
} from '../src/features/projects/types';

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    name: v.string(),
    userId: v.id('users'),
    joinCode: v.string(),
  }),
  members: defineTable({
    userId: v.id('users'),
    workspaceId: v.id('workspaces'),
    role: v.union(v.literal('admin'), v.literal('member')),
  })
    .index('by_user_id', ['userId'])
    .index('by_workspace_id', ['workspaceId'])
    .index('by_workspace_id_user_id', ['workspaceId', 'userId']),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id('workspaces'),
  }).index('by_workspace_id', ['workspaceId']),
  conversations: defineTable({
    workspaceId: v.id('workspaces'),
    memberOneId: v.id('members'),
    memberTwoId: v.id('members'),
  }).index('by_workspace_id', ['workspaceId']),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id('_storage')),
    memberId: v.id('members'),
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    parentMessageId: v.optional(v.id('messages')),
    conversationId: v.optional(v.id('conversations')),
    updatedAt: v.optional(v.number()),
  })
    .index('by_conversation_id', ['conversationId'])
    .index('by_workspace_id', ['workspaceId'])
    .index('by_parent_message_id', ['parentMessageId'])
    .index('by_member_id', ['memberId'])
    .index('by_channel_id', ['channelId'])
    .index('by_channel_id_parent_message_id_conversation_id', [
      'channelId',
      'parentMessageId',
      'conversationId',
    ]),
  reactions: defineTable({
    workspaceId: v.id('workspaces'),
    memberId: v.id('members'),
    messageId: v.id('messages'),
    value: v.string(),
  })
    .index('by_workspace_id', ['workspaceId'])
    .index('by_message_id', ['messageId'])
    .index('by_member_id', ['memberId']),
  projects: defineTable({
    name: v.string(),
    workspaceId: v.id('workspaces'),
    description: v.optional(v.string()),
    caseId: v.string(),
    category: v.optional(v.string()),
    dueDate: v.number(),
    status: v.union(
      v.literal(ProjectStatus.FILED_IN_COURT),
      v.literal(ProjectStatus.IN_REVIEW),
      v.literal(ProjectStatus.DONE),
    ),
    importance: v.optional(
      v.union(
        v.literal(ProjectImportance.LOW),
        v.literal(ProjectImportance.MEDIUM),
        v.literal(ProjectImportance.HIGH),
      ),
    ),
  }).index('by_workspace_id', ['workspaceId']),
  events: defineTable({
    name: v.string(),
    workspaceId: v.id('workspaces'),
    dueDate: v.number(),
    description: v.optional(v.string()),
    importance: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    ),
  }),
  eventParticipants: defineTable({
    eventId: v.id('events'),
    memberId: v.id('members'),
    workspaceId: v.id('workspaces'),
    importance: v.optional(
      v.union(v.literal('low'), v.literal('medium'), v.literal('high')),
    ),
    role: v.union(
      v.literal('organizer'),
      v.literal('participant'),
      v.literal('observer'),
    ),
    addedAt: v.number(),
    dueDate: v.number(),
  })
    .index('by_event', ['eventId'])
    .index('by_member', ['memberId'])
    .index('by_workspace', ['workspaceId'])
    .index('by_event_member', ['eventId', 'memberId'])
    .index('by_workspace_member', ['workspaceId', 'memberId']),
});

export default schema;
