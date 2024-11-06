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

    const populatedProjects = await Promise.all(
      projects.map(async project => {
        const assignees = await ctx.db
          .query('projectParticipants')
          .withIndex('by_project_id', q => q.eq('projectId', project._id))
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
            users.push(user);
          }
        }

        return {
          ...project,
          assignees: users,
        };
      }),
    );

    return populatedProjects;
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

export const updateImportance = mutation({
  args: {
    id: v.id('projects'),
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

    const user = await ctx.db
      .query('members')
      .withIndex('by_user_id', q => q.eq('userId', userId))
      .unique();

    if (!user) {
      throw new Error('Not found');
    }

    if (user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error('Not found');
    }

    await ctx.db.patch(project._id, {
      importance: args.importance,
    });

    return project._id;
  },
});

export const updateDeadline = mutation({
  args: {
    id: v.id('projects'),
    dueDate: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const user = await ctx.db
      .query('members')
      .withIndex('by_user_id', q => q.eq('userId', userId))
      .unique();

    if (!user) {
      throw new Error('Not found');
    }

    if (user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error('Not found');
    }

    await ctx.db.patch(project._id, {
      dueDate: args.dueDate,
    });

    return project._id;
  },
});

export const updateDescription = mutation({
  args: {
    id: v.id('projects'),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const user = await ctx.db
      .query('members')
      .withIndex('by_user_id', q => q.eq('userId', userId))
      .unique();

    if (!user) {
      throw new Error('Not found');
    }

    if (user.role !== 'admin') {
      throw new Error('Not authorized');
    }

    const project = await ctx.db.get(args.id);

    if (!project) {
      throw new Error('Not found');
    }

    await ctx.db.patch(project._id, {
      description: args.description,
    });

    return project._id;
  },
});

export const createComment = mutation({
  args: {
    projectId: v.id('projects'),
    workspaceId: v.id('workspaces'),
    body: v.string(),
    image: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error('Not authorized');
    }

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new Error('Not found');
    }

    const comment = await ctx.db.insert('comments', {
      body: args.body,
      image: args.image,
      projectId: args.projectId,
      memberId: member._id,
    });

    return comment;
  },
});

export const getComments = query({
  args: {
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);

    if (!userId) {
      throw new Error('Not signed in');
    }

    const user = await ctx.db
      .query('members')
      .withIndex('by_user_id', q => q.eq('userId', userId))
      .unique();

    if (!user) {
      throw new Error('Not found');
    }

    const comments = await ctx.db
      .query('comments')
      .withIndex('by_project_id', q => q.eq('projectId', args.projectId))
      .collect();

    const populatedComments = await Promise.all(
      comments.map(async comment => {
        const member = await ctx.db
          .query('members')
          .withIndex('by_id', q => q.eq('_id', comment.memberId))
          .unique();

        if (!member) {
          throw new Error('Not found');
        }

        const image = comment.image
          ? await ctx.storage.getUrl(comment.image)
          : undefined;

        const user = await ctx.db
          .query('users')
          .withIndex('by_id', q => q.eq('_id', member.userId))
          .unique();

        return {
          ...comment,
          member,
          user,
          image,
        };
      }),
    );

    return populatedComments;
  },
});
