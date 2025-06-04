"use client";

import { CirclePlus } from "lucide-react";
import { Button } from "../ui/button";
import { useClerk } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";
import { toast } from "sonner";

export default function UsernameHome() {
  const { user } = useClerk();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">{`Welcome to ${user?.firstName}'s ${siteConfig.name}`}</h1>

      <Button
        className="cursor-pointer"
        onClick={() => {
          toast.info("Not implemented yet");
        }}
      >
        <CirclePlus /> Create a note
      </Button>
    </div>
  );
}
