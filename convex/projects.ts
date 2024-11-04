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

const populateUser = (ctx: QueryCtx, id: Id<'users'>) => {
  return ctx.db.get(id);
};

const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId);
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

export const getById = query({
  args: {
    id: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    // TODO: check if user is assigned to this workspace

    const projects = await ctx.db.get(args.id);

    if (!projects) {
      return null;
    }

    return projects;
  },
});

export const setAssignees = mutation({
  args: {
    id: v.id('projects'),
    workspaceId: v.id('workspaces'),
    assignees: v.array(v.id('users')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', q =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId),
      )
      .unique();

    if (!member) {
      return null;
    }

    const data = await ctx.db
      .query('members')
      .withIndex('by_workspace_id', q => q.eq('workspaceId', args.workspaceId))
      .collect();

    // @ts-ignore
    const membersToAdd = [];
    const assigneeIds = args.assignees;

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);

      if (user && assigneeIds.includes(member.userId)) {
        membersToAdd.push({
          ...member,
          user,
        });
      }
    }

    const existingParticipants = await ctx.db
      .query('projectParticipants')
      .withIndex('by_project_id', q => q.eq('projectId', args.id))
      .collect();

    const existingMemberIds = existingParticipants.map(p => p.memberId);

    const participantsToRemove = existingParticipants.filter(
      // @ts-ignore
      participant => !membersToAdd.some(m => m._id === participant.memberId),
    );

    await Promise.all(
      participantsToRemove.map(async participant => {
        await ctx.db.delete(participant._id);
      }),
    );

    await Promise.all(
      membersToAdd.map(async member => {
        const alreadyAssigned = existingMemberIds.includes(member._id);

        if (!alreadyAssigned) {
          await ctx.db.insert('projectParticipants', {
            projectId: args.id,
            workspaceId: args.workspaceId,
            addedAt: Date.now(),
            memberId: member._id,
          });
        }
      }),
    );

    return project._id;
  },
});

export const getAssignees = query({
  args: {
    id: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      return null;
    }

    const project = await ctx.db.get(args.id);

    if (!project) {
      return null;
    }

    const assignees = await ctx.db
      .query('projectParticipants')
      .withIndex('by_project_id', q => q.eq('projectId', args.id))
      .collect();

    const members = [];

    for (const assignee of assignees) {
      const member = await populateMember(ctx, assignee.memberId);

      if (member) {
        members.push(member);
      }
    }

    const users = [];

    for (const member of members) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        users.push({
          ...member,
          user,
        });
      }
    }

    return users;
  },
});
