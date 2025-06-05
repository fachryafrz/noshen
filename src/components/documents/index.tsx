"use client";

import DocumentHeader from "@/components/documents/header";
import DocumentContent from "@/components/documents/content";
import { Id } from "../../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function DocumentPage({
  documentId,
}: {
  documentId: Id<"documents">;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [, , documentIdPathname] = pathname.split("/");

  const { user } = useClerk();

  const document = useQuery(api.documents.getDocument, {
    documentId,
  });
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const deleteForever = useMutation(api.documents.deleteForever);

  useEffect(() => {
    if (document === null) {
      router.push(`/${user?.username}`);
    }
  }, [document, router, user?.username]);

  return (
    <>
      {document && (
        <div>
          {/* Deleted Banner */}
          {document.isDeleted && (
            <div className="flex items-center justify-center gap-1 bg-red-600 p-2 px-4">
              This page is in the trash.
              <Button
                variant={"ghost"}
                className="cursor-pointer border border-white"
                onClick={async () => {
                  await restoreDocument({ documentId });
                }}
              >
                Undo
              </Button>
              <Button
                variant={"ghost"}
                className="cursor-pointer border border-white"
                onClick={async () => {
                  await deleteForever({ documentId });
                  if (documentIdPathname === documentId) {
                    router.push(`/${user?.username}`);
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
