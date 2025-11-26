"use client";

import DocumentContent from "@/components/documents/content";
import { Id } from "../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DocumentPage({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const router = useRouter();

  const user = useQuery(api.users.getCurrentUser);
  const document = useQuery(api.documents.getDocument, {
    documentId,
  });

  useEffect(() => {
    if (document === null) {
      router.push(`/${user?.username}`);
    }
  }, [document, router, user?.username]);

  return <>{document && <DocumentContent document={document} />}</>;
}
