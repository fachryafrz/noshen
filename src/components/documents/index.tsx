"use client";

import DocumentHeader from "@/components/documents/header";
import DocumentContent from "@/components/documents/content";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function DocumentPage({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const document = useQuery(api.documents.getDocument, {
    documentId,
  });

  return (
    <>
      {document && (
        <div>
          {/* Header */}
          <DocumentHeader document={document} />

          {/* Content */}
          <DocumentContent document={document} />
        </div>
      )}
    </>
  );
}
