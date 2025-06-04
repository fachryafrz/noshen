"use client";

import DocumentHeader from "@/components/documents/header";
import DocumentContent from "@/components/documents/content";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { redirect, usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function DocumentPage({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const pathname = usePathname();

  const [, , documentIdPathname] = pathname.split("/");

  const { user } = useClerk();

  const document = useQuery(api.documents.getDocument, {
    documentId,
  });
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const deleteForever = useMutation(api.documents.deleteForever);

  return (
    <>
      {document && (
        <div>
          {/* Deleted Banner */}
          {document.isDeleted && (
            <div className="bg-red-600 p-2 px-4 flex items-center justify-center gap-1">
              This page is in the trash.
              <Button
                variant={"ghost"}
                className="border border-white cursor-pointer"
                onClick={async () => {
                  await restoreDocument({ documentId });
                }}
              >
                Undo
              </Button>
              <Button
                variant={"ghost"}
                className="border border-white cursor-pointer"
                onClick={async () => {
                  await deleteForever({ documentId });
                  if (documentIdPathname === documentId) {
                    if (document.parentDocumentId) {
                      redirect(
                        `/${user?.username}/${document.parentDocumentId}`
                      );
                    } else {
                      redirect(`/${user?.username}`);
                    }
                  }
                }}
              >
                Delete forever
              </Button>
            </div>
          )}

          {/* Header */}
          <DocumentHeader document={document} />

          {/* Content */}
          <DocumentContent document={document} />
        </div>
      )}
    </>
  );
}
