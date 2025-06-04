import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    userId: v.id("users"),
    content: v.optional(v.string()),
    converImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isArchived: v.boolean(),
    isPublished: v.boolean(),
    parentDocumentId: v.optional(v.id("documents")),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocumentId"]),
});
