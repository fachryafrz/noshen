import { MutationCtx, QueryCtx } from "./_generated/server";

export const getUser = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return;

  const user = await ctx.db
    .query("users")
    .withIndex("email", (q) => q.eq("email", identity.email!))
    .first();

  return user;
};
