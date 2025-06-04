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
              "inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 h-9 px-4 py-2 has-[>svg]:px-3 cursor-pointer w-full justify-start relative group min-w-[125px]",
              documentId === document._id && "bg-muted dark:bg-muted/50"
            )}
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
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      className="cursor-pointer size-6"
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
                  className="cursor-pointer size-6"
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
        <ul className="ml-5 border-l border-muted-foreground/20 pl-1">
          {document.children.map((child) => (
            <DocumentItem key={child._id} document={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
