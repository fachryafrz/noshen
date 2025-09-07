/* eslint-disable @next/next/no-img-element */
"use client";

import { useMutation } from "convex/react";
import { Doc, Id } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ToolbarCover from "./toolbar-cover";
import ToolbarIcon from "./toolbar-icon";

export default function DocumentContent({
  document,
}: {
  document: Doc<"documents">;
}) {
  const { resolvedTheme } = useTheme();

  const updateDocument = useMutation(api.documents.updateDocument);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const getStorageUrl = useMutation(api.storage.getStorageUrl);
  const deleteStorage = useMutation(api.storage.deleteStorage);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(document.title || "");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevStorageIdsRef = useRef<Set<string>>(new Set());

  const editor = useCreateBlockNote({
    initialContent: document.content && JSON.parse(document.content),
    uploadFile: async (file) => {
      if (!file) return "";

      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return "";
      }

      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Step 3: Generate URL public dari storageId
      const url = await getStorageUrl({ storageId }); // fungsi dari Convex untuk dapatkan URL

      // Step 4: Return object yang sesuai format BlockNote
      return `${url}?sid=${storageId}`; // embed storageId di URL
    },
  });

  const handleTitleChange = async (value: string) => {
    if (!value.trim()) return;

    await updateDocument({
      documentId: document._id,
      title: value,
    });
  };

  const handleIconChange = async (emoji: string) => {
    await updateDocument({
      documentId: document._id,
      icon: emoji,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractStorageIds = (blocks: any[]) => {
    const ids = new Set<string>();
    for (const block of blocks) {
      if (typeof block.props.url === "string") {
        try {
          const sid = new URL(block.props.url).searchParams.get("sid");
          if (sid) ids.add(sid);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
          continue;
        }
      }
    }
    return ids;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorChange = async (editor: any) => {
    const blocks = editor.document;
    const currentStorageIds = extractStorageIds(blocks);

    // Hapus storageId yang sudah tidak dipakai
    for (const sid of prevStorageIdsRef.current) {
      if (!currentStorageIds.has(sid)) {
        await deleteStorage({ storageId: sid as Id<"_storage"> });
      }
    }

    prevStorageIdsRef.current = currentStorageIds;

    await updateDocument({
      documentId: document._id,
      content: JSON.stringify(blocks, null, 2),
    });
  };

  useEffect(() => {
    if (!isEditing) {
      setTitle(document.title || "");
    }
  }, [document.title, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      const el = inputRef.current;
      // Pindahkan cursor ke akhir teks
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [isEditing]);

  useEffect(() => {
    if (document.content) {
      const blocks = JSON.parse(document.content);
      prevStorageIdsRef.current = extractStorageIds(blocks);
    }
  }, [document.content]);

  return (
    <div>
      {/* Cover */}
      {document.coverImage && (
        <div className="group relative h-[30dvh]">
          <img
            src={document.coverImage}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />

          <div className="absolute right-2 bottom-2 opacity-0 transition-all group-hover:opacity-100">
            <ToolbarCover
              document={document}
              title="Change Cover"
              variant={"secondary"}
            />
          </div>
        </div>
      )}

      <div
        className={cn(
          "pointer-events-none mx-auto max-w-4xl space-y-2 p-4 [&_*]:pointer-events-auto",
          document.coverImage && document.icon && "-translate-y-14",
        )}
      >
        {document.icon && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="mb-0 ml-[44px] !size-20 cursor-pointer !p-0 text-6xl"
              >
                {document.icon}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="!w-auto !border-0 !p-0">
              <EmojiPicker
                theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
                onEmojiClick={(e) => handleIconChange(e.emoji)}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Icon & Title */}
        <div className="group">
          {/* Icon */}
          <div className="px-[44px] transition-all group-hover:opacity-100 md:opacity-0">
            {!document.icon && (
              <ToolbarIcon onEmojiClick={(e) => handleIconChange(e.emoji)} />
            )}

            {!document.coverImage && (
              <ToolbarCover
                document={document}
                title="Add cover"
                variant={"ghost"}
              />
            )}
          </div>

          {/* Title */}
          {isEditing ? (
            <TextareaAutosize
              ref={inputRef}
              className="w-full resize-none px-[54px] text-5xl font-bold outline-none"
              value={title}
              onBlur={() => setIsEditing(false)}
              autoFocus
              placeholder="Untitled"
              onChange={(e) => {
                setTitle(e.target.value);
                handleTitleChange(e.target.value);
              }}
            />
          ) : (
            <h1
              className="px-[54px] pb-[13px] text-5xl font-bold"
              onClick={() => setIsEditing(true)}
            >
              {document?.title}
            </h1>
          )}
        </div>

        {/* Editor */}
        <BlockNoteView
          editor={editor}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          onChange={handleEditorChange}
        />
      </div>
    </div>
  );
}
