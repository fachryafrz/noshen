import { getStaticAuth } from "@convex-dev/better-auth";
import { v } from "convex/values";

import { createAuth } from "../auth";

import { mutation } from "./_generated/server";

// Export a static instance for Better Auth schema generation
export const auth = getStaticAuth(createAuth);

export const setUserId = mutation({
  args: {
    authId: v.id("user"),
    userId: v.string(),
    username: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.authId, {
      userId: args.userId,
      username: args.username,
      displayUsername: args.username,
    });
  },
});

export const setUsername = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("user")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!user) return;

    await ctx.db.patch(user._id, {
      username: args.username,
      displayUsername: args.username,
    });
  },
});
