import { v } from 'convex/values';
import {
  ProjectImportance,
  ProjectStatus,
} from './../src/features/projects/types';
import { Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { auth } from './auth';

const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<'workspaces'>,
  userId: Id<'users'>,
) => {
  return ctx.db
    .query('members')
    .withIndex('by_workspace_id_user_id', q => {
      return q.eq('workspaceId', workspaceId).eq('userId', userId);
    })
    .unique();
};

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces'),
    caseId: v.string(),
    dueDate: v.number(),
    importance: v.union(
      v.literal(ProjectImportance.LOW),
      v.literal(ProjectImportance.MEDIUM),
      v.literal(ProjectImportance.HIGH),
    ),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member || member.role !== 'admin') {
      throw new Error('Not signed in');
    }

    const projectId = await ctx.db.insert('projects', {
      name: args.name,
      caseId: args.caseId,
      workspaceId: args.workspaceId,
      importance: args.importance,
      dueDate: args.dueDate,
      status: ProjectStatus.FILED_IN_COURT,
    });

    const channelId = await ctx.db.insert('channels', {
      name: args.name,
      workspaceId: args.workspaceId,
    });

    return {
      projectId,
      channelId,
    };
  },
});

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return [];
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', q =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique();

    if (!member) {
      return [];
    }

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
      .collect();

    return projects;
  },
});
