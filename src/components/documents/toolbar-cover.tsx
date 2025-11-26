"use client";

import { ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { VariantProps } from "class-variance-authority";
import { Doc } from "../../../convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { LoadingSpinner } from "../spinner";

export default function ToolbarCover({
  document,
  title,
  variant,
}: {
  document: Doc<"documents">;
  title: string;
  variant: VariantProps<typeof Button>["variant"];
}) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [embed, setEmbed] = useState<string>("");
  const [isLoading, setIsLoading] = useTransition();

  const updateDocument = useMutation(api.documents.updateDocument);
  const deleteCoverImage = useMutation(api.documents.deleteCoverImage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const handleFileChange = async () => {
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      toast.error("File size must be less than 1MB");
      return;
    }

    setIsLoading(async () => {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await result.json();

      await updateDocument({
        documentId: document._id,
        coverImageUpload: storageId,
      });

      setPopoverOpen(false);
    });
  };

  const handleEmbed = async () => {
    if (!embed) return;

    if (!embed.startsWith("http")) {
      toast.error("Invalid URL");
      return;
    }

    setIsLoading(async () => {
      await updateDocument({
        documentId: document._id,
        coverImageEmbed: embed,
      });

      setPopoverOpen(false);
    });
  };

  return (
    <Popover onOpenChange={setPopoverOpen} open={popoverOpen}>
      <PopoverTrigger asChild>
        <Button variant={variant} className="cursor-pointer">
          <ImageIcon /> {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="relative !w-auto !border-0 p-1">
        <Tabs defaultValue="upload" className="w-[400px]">
          <TabsList className="bg-transparent p-0">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="embed">Embed</TabsTrigger>
          </TabsList>
          <TabsContent value="upload" className="space-y-2 p-4">
            <Input type="file" onChange={(e) => setFile(e.target.files![0])} />
            <Button
              variant={"outline"}
              className="w-full cursor-pointer"
              onClick={handleFileChange}
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner />}
              Set as cover
            </Button>
          </TabsContent>
          <TabsContent value="embed" className="space-y-2 p-4">
            <Input
              placeholder="https://example.com/image.jpg"
              onChange={(e) => setEmbed(e.target.value)}
            />
            <Button
              variant={"outline"}
              className="w-full cursor-pointer"
              onClick={handleEmbed}
              disabled={isLoading}
            >
              {isLoading && <LoadingSpinner />}
              Set as cover
            </Button>
          </TabsContent>
        </Tabs>

        {document.coverImage && (
          <Button
            size={"sm"}
            variant={"ghost"}
            className="absolute top-1 right-1 cursor-pointer"
            onClick={async () => {
              await deleteCoverImage({ documentId: document._id });

              setPopoverOpen(false);
            }}
          >
            Remove
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
