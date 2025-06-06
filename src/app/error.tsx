"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import { siteConfig } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div
      className={`absolute inset-0 z-10 flex h-dvh flex-1 flex-col items-center justify-center gap-4 bg-white md:static dark:bg-black`}
    >
      <div className="flex items-end gap-0.5 text-5xl font-bold">
        <Logo size={50} />
        {siteConfig.name.slice(1)}
      </div>
      <h2 className={`text-2xl font-bold`}>Something went wrong!</h2>
      <Button
        className="cursor-pointer"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  );
}
