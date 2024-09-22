import { v } from 'convex/values';
import { mutation, QueryCtx } from './_generated/server';
import { auth } from './auth';
import { Id } from './_generated/dataModel';

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
    body: v.string(),
    image: v.optional(v.id('_storage')),
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    parentMessageId: v.optional(v.id('messages')),
    // TODO: add conversation id
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

    // TODO: handle conversation id

    const messageId = await ctx.db.insert('messages', {
      memberId: member._id,
      workspaceId: args.workspaceId,
      image: args.image,
      body: args.body,
      channelId: args.channelId,
      parentMessageId: args.parentMessageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});
