"use client";

import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import { siteConfig } from "@/config/site";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UsernameHome() {
  const router = useRouter();
  const pathname = usePathname();

  const [, username] = pathname.split("/");

  const user = useQuery(api.users.getCurrentUser);
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
    <div className="flex h-[calc(100%-52px)] w-full flex-col items-center justify-center gap-4 p-4">
      {user && (
        <h1 className="text-center text-xl font-bold text-pretty sm:text-2xl md:text-3xl">{`Welcome to ${user.name.split(" ")[0]}'s ${siteConfig.name}`}</h1>
      )}

      <Button className="cursor-pointer" onClick={() => handleCreateDocument()}>
        <CirclePlus /> Create a note
      </Button>
    </div>
  );
}
