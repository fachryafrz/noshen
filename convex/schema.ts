import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    username: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("email", ["email"])
    .index("username", ["username"]),

  documents: defineTable({
    title: v.string(),
    userId: v.id("users"),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isDeleted: v.boolean(),
    isPublished: v.boolean(),
    parentDocumentId: v.optional(v.id("documents")),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocumentId"])
    .index("by_user_deleted", ["userId", "isDeleted"])
    .searchIndex("by_title", {
      searchField: "title",
      filterFields: ["isDeleted"],
    }),
});
