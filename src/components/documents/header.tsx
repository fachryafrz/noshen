"use client";

import { useEffect, useState } from "react";
import { Doc } from "../../../convex/_generated/dataModel";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
import { File } from "lucide-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useTheme } from "next-themes";

export default function DocumentHeader({
  document,
}: {
  document: Doc<"documents">;
}) {
  const { resolvedTheme } = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title || "");

  const updateDocument = useMutation(api.documents.updateDocument);

  const handleTitleChange = async (value: string) => {
    if (!value.trim()) return;

    await updateDocument({
      documentId: document._id,
      title: value,
      icon: document.icon,
    });
  };

  const handleIconChange = async (emoji: string) => {
    await updateDocument({
      documentId: document._id,
      title: title,
      icon: emoji,
    });
  };

  useEffect(() => {
    if (!isEditing) {
      setTitle(document.title || "");
    }
  }, [document.title, isEditing]);

  return (
    <header className="p-2">
      <Popover onOpenChange={setIsEditing}>
        <PopoverTrigger asChild>
          <Button variant={"ghost"} className="cursor-pointer p-2">
            {document.icon ? (
              <span>{document.icon}</span>
            ) : (
              <File className="size-5" />
            )}
            <span>{document?.title}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="!p-1">
          <div className="flex items-center gap-1">
            {/* Icon */}

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  {document.icon ? (
                    <span>{document.icon}</span>
                  ) : (
                    <File className="size-5" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="!w-auto !border-0 !p-0">
                <EmojiPicker
                  theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                  onEmojiClick={(e) => handleIconChange(e.emoji)}
                />
              </PopoverContent>
            </Popover>

            {/* Input */}
            <Input
              value={title}
              placeholder={document.title}
              onChange={(e) => {
                setTitle(e.target.value);

                handleTitleChange(e.target.value);
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
