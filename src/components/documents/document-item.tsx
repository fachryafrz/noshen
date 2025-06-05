"use client";

import { DocumentsTree } from "@/lib/types";
import { Button } from "../ui/button";
import { ChevronRight, Ellipsis, File, Plus, Trash2 } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DocumentItem({
  document,
}: {
  document: DocumentsTree;
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

  const options: {
    icon: React.ReactNode;
    title: string;
    onClick: () => Promise<void>;
    variant?: "destructive" | "default";
  }[] = [
    {
      icon: <Trash2 />,
      title: "Move to trash",
      onClick: async () => {
        await deleteDocument({ documentId: document._id });

        router.push(`/${user?.username}`);
      },
      variant: "destructive",
    },
  ];

  return (
    <li>
      {/* Document */}
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className={cn(
              "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/30 group relative inline-flex h-9 w-full min-w-[125px] shrink-0 cursor-pointer items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              documentId === document._id && "bg-muted dark:bg-muted/50",
            )}
            role="button"
            onClick={() => {
              router.push(`/${user?.username}/${document._id}`);
            }}
          >
            <File
              className={cn(
                document.children.length > 0 &&
                  "transition-all group-hover:opacity-0",
              )}
            />
            <span>{document.title}</span>

            {/* Actions */}
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between p-2 opacity-0 transition-all group-hover:opacity-100 [&_*]:pointer-events-auto">
              {document.children.length > 0 ? (
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="hover:!bg-accent/100 size-6 cursor-pointer"
                  onClick={() => setShowChild(!showChild)}
                >
                  <ChevronRight
                    className={cn(
                      showChild ? "rotate-90" : "",
                      "transition-all",
                    )}
                  />
                </Button>
              ) : (
                <div></div>
              )}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="hover:!bg-accent/100 size-6 cursor-pointer"
                    >
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {options.map((option) => (
                      <DropdownMenuItem
                        key={option.title}
                        className="cursor-pointer"
                        onClick={option.onClick}
                        variant={option.variant}
                      >
                        {option.icon} {option.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="hover:!bg-accent/100 size-6 cursor-pointer"
                  onClick={() => handleCreateDocument(document._id)}
                >
                  <Plus />
                </Button>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {options.map((option) => (
            <ContextMenuItem
              key={option.title}
              className="cursor-pointer"
              onClick={option.onClick}
              variant={option.variant}
            >
              {option.icon} {option.title}
            </ContextMenuItem>
          ))}
        </ContextMenuContent>
      </ContextMenu>

      {/* Render children jika ada */}
      {showChild && document.children && document.children.length > 0 && (
        <ul className="border-muted-foreground/20 ml-5 border-l pl-1">
          {document.children.map((child) => (
            <DocumentItem key={child._id} document={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
