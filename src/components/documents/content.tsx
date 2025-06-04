"use client";

import { useMutation } from "convex/react";
import { Doc } from "../../../convex/_generated/dataModel";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import "@blocknote/core/fonts/inter.css";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

export default function DocumentContent({
  document,
}: {
  document: Doc<"documents">;
}) {
  const { resolvedTheme } = useTheme();

  const updateDocument = useMutation(api.documents.updateDocument);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(document?.title || "");

  const editor = useCreateBlockNote({
    initialContent: document.content && JSON.parse(document.content),
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (!value.trim()) return;

    updateDocument({
      documentId: document._id,
      title: value,
    });
  };

  return (
    <div className="p-4 space-y-2 max-w-4xl mx-auto">
      {/* Title */}
      {isEditing ? (
        <TextareaAutosize
          className="text-5xl px-[54px] font-bold outline-none resize-none"
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
          className="text-5xl px-[54px] font-bold h-[62px]"
          onClick={() => setIsEditing(true)}
        >
          {document?.title}
        </h1>
      )}

      {/* Editor */}
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={(editor) => {
          console.log(editor.document);

          updateDocument({
            documentId: document._id,
            title: document?.title || "",
            content: JSON.stringify(editor.document, null, 2),
          });
        }}
      />
    </div>
  );
}
