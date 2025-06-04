"use client";

import { DocumentsTree } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronRight, File, Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function DocumentItem({
  document,
}: {
  document: DocumentsTree;
  onClick?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [, , documentId] = pathname.split("/");

  const { user } = useClerk();

  const [showChild, setShowChild] = useState(true);

  const createDocument = useMutation(api.documents.createDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const handleCreateDocument = async (parentDocumentId?: Id<"documents">) => {
    const documentId = await createDocument({
      title: "Untitled",
      parentDocumentId: parentDocumentId,
    });

    router.push(`/${user?.username}/${documentId}`);
  };

  return (
    <li>
      {/* Document */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer w-full justify-start relative group min-w-[125px]"
            role="button"
            onClick={() => {
              router.push(`/${user?.username}/${document._id}`);
            }}
          >
            <File
              className={cn(
                document.children.length > 0 &&
                  "group-hover:opacity-0 transition-all"
              )}
            />
            <span>{document.title}</span>

            {/* Actions */}
            <div className="absolute flex items-center justify-between p-2 z-10 inset-0 group-hover:opacity-100 opacity-0 transition-all pointer-events-none [&_*]:pointer-events-auto">
              {document.children.length > 0 ? (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="cursor-pointer size-6"
                  onClick={() => setShowChild(!showChild)}
                >
                  <ChevronRight
                    className={cn(
                      showChild ? "rotate-90" : "",
                      "transition-all"
                    )}
                  />
                </Button>
              ) : (
                <div></div>
              )}
              <Button
                size={"icon"}
                variant={"ghost"}
                className="cursor-pointer size-6"
                onClick={() => handleCreateDocument(document._id)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={async () => {
              await deleteDocument({ documentId: document._id });
              if (documentId === document._id) {
                if (document.parentDocumentId) {
                  router.push(
                    `/${user?.username}/${document.parentDocumentId}`
                  );
                } else {
                  router.push(`/${user?.username}`);
                }
              }
            }}
          >
            <Trash2 /> Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {/* Render children jika ada */}
      {showChild && document.children && document.children.length > 0 && (
        <ul className="ml-4 border-l border-muted-foreground/20 pl-2">
          {document.children.map((child) => (
            <DocumentItem key={child._id} document={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
