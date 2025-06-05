import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getDocuments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return documents.filter((doc) => !doc.isDeleted);
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    return await ctx.db.get(args.documentId);
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    parentDocumentId: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    return await ctx.db.insert("documents", {
      title: "Untitled",
      userId: user._id,
      parentDocumentId: args.parentDocumentId,
      isPublished: false,
      isDeleted: false,
    });
  },
});

export const getDeleted = query({
  args: {
    query: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    if (args.query) {
      return await ctx.db
        .query("documents")
        .withSearchIndex("by_title", (q) =>
          q.search("title", args.query ?? "").eq("isDeleted", true),
        )
        .collect();
    } else {
      return await ctx.db
        .query("documents")
        .withIndex("by_user_deleted", (q) =>
          q.eq("userId", user._id).eq("isDeleted", true),
        )
        .order("desc")
        .collect();
    }
  },
});

export const updateDocument = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    content: v.optional(v.string()),
    icon: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    const document = await ctx.db.get(args.documentId);

    return await ctx.db.patch(args.documentId, {
      title: args.title,
      content: args.content,
      icon: args.icon || document?.icon,
    });
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    const document = await ctx.db.get(args.documentId);
    if (!document || document.userId !== user._id) return;

    // hapus rekursif langsung di dalam handler
    const deleteRecursively = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", user._id).eq("parentDocumentId", documentId),
        )
        .collect();

      for (const child of children) {
        await deleteRecursively(child._id);
      }

      await ctx.db.patch(documentId, { isDeleted: true });
    };

    await deleteRecursively(args.documentId);
  },
});

export const restoreDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    const document = await ctx.db.get(args.documentId);
    if (document?.parentDocumentId) {
      await ctx.db.patch(args.documentId, { parentDocumentId: undefined });
    }

    const restoreRecursively = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", user._id).eq("parentDocumentId", documentId),
        )
        .collect();

      for (const child of children) {
        await restoreRecursively(child._id);
      }

      await ctx.db.patch(documentId, { isDeleted: false });
    };

    await restoreRecursively(args.documentId);
  },
});

export const deleteForever = mutation({
  args: {
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier),
      )
      .unique();
    if (!user) return;

    await ctx.db.delete(args.documentId);
  },
});
