"use client";

import { useQuery } from "convex/react";
import { Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";

export default function DocumentHeader({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId,
  });

  return <header className="p-4">{document?.title}</header>;
}
