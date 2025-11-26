"use client";

import { useEffect, useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { File } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export default function DocumentHeader() {
  const router = useRouter();
  const pathname = usePathname();

  
  const [, , documentId] = pathname.split("/");
  
  const user = useQuery(api.users.getCurrentUser);
  const document = useQuery(api.documents.getDocument, {
    documentId: documentId as Id<"documents">,
  });

  const { resolvedTheme } = useTheme();
  const { isMobile, open } = useSidebar();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document?.title || "");

  const updateDocument = useMutation(api.documents.updateDocument);
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const deleteForever = useMutation(api.documents.deleteForever);

  const handleTitleChange = async (value: string) => {
    if (!value.trim()) return;

    await updateDocument({
      documentId: document?._id as Id<"documents">,
      title: value,
      icon: document?.icon,
    });
  };

  const handleIconChange = async (emoji: string) => {
    await updateDocument({
      documentId: document?._id as Id<"documents">,
      title: title,
      icon: emoji,
    });
  };

  useEffect(() => {
    if (!isEditing) {
      setTitle(document?.title || "");
    }
  }, [document?.title, isEditing]);

  return (
    <>
      {/* Deleted Banner */}
      {document?.isDeleted && (
        <div className="flex items-center justify-center gap-1 bg-red-500 p-2">
          This page is in the trash.
          <Button
            variant={"ghost"}
            className="cursor-pointer border border-white"
            onClick={async () => {
              await restoreDocument({ documentId: document?._id });
            }}
          >
            Undo
          </Button>
          <Button
            variant={"ghost"}
            className="cursor-pointer border border-white"
            onClick={async () => {
              await deleteForever({ documentId: document?._id });
              if (documentId === document?._id) {
                router.push(`/${user?.username}`);
              }
            }}
          >
            Delete forever
          </Button>
        </div>
      )}

      <header className="min-h-[52px] p-2">
        <div className="flex items-center">
          {(isMobile || !open) && <SidebarTrigger />}

          {document && (
            <Popover onOpenChange={setIsEditing}>
              <PopoverTrigger asChild>
                <Button variant={"ghost"} className="cursor-pointer p-2">
                  {document?.icon ? (
                    <span>{document?.icon}</span>
                  ) : (
                    <File className="size-5" />
                  )}
                  <span>{document?.title}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="!p-1" align="start">
                <div className="flex items-center gap-1">
                  {/* Icon */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="cursor-pointer"
                      >
                        {document?.icon ? (
                          <span>{document?.icon}</span>
                        ) : (
                          <File className="size-5" />
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="!w-auto !border-0 !p-0"
                    >
                      <EmojiPicker
                        theme={
                          resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT
                        }
                        onEmojiClick={(e) => handleIconChange(e.emoji)}
                      />
                    </PopoverContent>
                  </Popover>

                  {/* Input */}
                  <Input
                    value={title}
                    placeholder={document?.title}
                    onChange={(e) => {
                      setTitle(e.target.value);

                      handleTitleChange(e.target.value);
                    }}
                  />
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>
    </>
  );
}
