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
  const [value, setValue] = useState(document?.title || "");

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevStorageIdsRef = useRef<Set<string>>(new Set());

  const editor = useCreateBlockNote({
    initialContent: document.content && JSON.parse(document.content),
    uploadFile: async (file) => {
      if (file.size > 1 * 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return "";
      }

      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file!.type },
        body: file,
      });

      const { storageId } = await result.json();

      // Step 3: Generate URL public dari storageId
      const url = await getStorageUrl({ storageId }); // fungsi dari Convex untuk dapatkan URL

      // Step 4: Return object yang sesuai format BlockNote
      return `${url}?sid=${storageId}`; // embed storageId di URL
    },
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!value.trim()) return;

    updateDocument({
      documentId: document._id,
      title: value,
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
      title: document?.title || "",
      content: JSON.stringify(blocks, null, 2),
    });
  };

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
    <div className="mx-auto max-w-4xl space-y-2 p-4">
      {/* Title */}
      {isEditing ? (
        <TextareaAutosize
          ref={inputRef}
          className="resize-none px-[54px] text-5xl font-bold outline-none"
          value={value}
          onBlur={() => setIsEditing(false)}
          autoFocus
          placeholder="Untitled"
          onChange={(e) => {
            setValue(e.target.value);
            handleTitleChange(e);
          }}
        />
      ) : (
        <h1
          className="h-[62px] px-[54px] text-5xl font-bold"
          onClick={() => setIsEditing(true)}
        >
          {document?.title}
        </h1>
      )}

      {/* Editor */}
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
      />
    </div>
  );
}
