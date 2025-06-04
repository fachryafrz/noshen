"use client";

import { Doc } from "../../../convex/_generated/dataModel";

export default function DocumentHeader({
  document,
}: {
  document: Doc<"documents">;
}) {
  return <header className="p-4">{document?.title}</header>;
}
