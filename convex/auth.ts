import {
  AuthFunctions,
  createClient,
  type GenericCtx,
} from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { ConvexError, v } from "convex/values";

import { components, internal } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import authSchema from "./betterAuth/schema";
import { mutation } from "./_generated/server";
import { getUser } from "./utils";

const siteUrl = process.env.SITE_URL!;
const authFunctions: AuthFunctions = internal.auth;

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel, typeof authSchema>(
  components.betterAuth,
  {
    authFunctions,
    local: {
      schema: authSchema,
    },
    triggers: {
      user: {
        onCreate: async (ctx, doc) => {
          // check if user already exists with the same email
          const existingUser = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", doc.email))
            .unique();

          // if user already exists, update image if it's not set
          if (existingUser) {
            await ctx.db.patch(existingUser._id, {
              avatarUrl: doc.image || undefined,
              tokenIdentifier: undefined,
            });

            // set user id on betterAuth component
            await ctx.runMutation(components.betterAuth.auth.setUserId, {
              authId: doc._id,
              userId: existingUser._id,
              username: existingUser.username,
            });

            return;
          }

          // create user
          const userId = await ctx.db.insert("users", {
            email: doc.email,
            avatarUrl: doc.image || "",
            name: doc.name,
            username: doc.username || undefined,
          });

          // set user id on betterAuth component
          await ctx.runMutation(components.betterAuth.auth.setUserId, {
            authId: doc._id,
            userId,
          });
        },
        // onUpdate: async (ctx, newDoc, oldDoc) => {
        //   //
        // },
        // onDelete: async (ctx, doc) => {
        //   //
        // },
      },
    },
  },
);

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

export const createAuth = (
  ctx: GenericCtx<DataModel>,
  { optionsOnly } = { optionsOnly: false },
) => {
  return betterAuth({
    // disable logging when createAuth is called just to generate options.
    // this is not required, but there's a lot of noise in logs without it.
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
    },
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      },
    },
    logger: {
      disabled: optionsOnly,
    },
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    plugins: [
      // The Convex plugin is required for Convex compatibility
      convex(),
      username(),
    ],
  });
};

export const setUsername = mutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);

    if (!user) return;

    const username = args.username.toLowerCase();

    const userExists = await ctx.db
      .query("users")
      .withIndex("username", (q) => q.eq("username", username))
      .unique();

    if (userExists) throw new ConvexError("Username already exists");

    await ctx.db.patch(user._id, {
      username,
    });

    await ctx.runMutation(components.betterAuth.auth.setUsername, {
      userId: user._id,
      username,
    });
  },
});
