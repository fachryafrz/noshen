"use client";

import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useClerk } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsernameHome() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useClerk();

  const [, username] = pathname.split("/");

  const createDocument = useMutation(api.documents.createDocument);

  const handleCreateDocument = async (parentDocumentId?: Id<"documents">) => {
    const documentId = await createDocument({
      title: "Untitled",
      parentDocumentId: parentDocumentId,
    });

    router.push(`/${user?.username}/${documentId}`);
  };

  useEffect(() => {
    if (!user) return;

    if (user.username !== username) {
      router.push(`/${user.username}`);
    }
  }, [user, username, router]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">{`Welcome to ${user?.firstName}'s ${siteConfig.name}`}</h1>

      <Button className="cursor-pointer" onClick={() => handleCreateDocument()}>
        <CirclePlus /> Create a note
      </Button>
    </div>
  );
}
