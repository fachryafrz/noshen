"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { useClerk } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user } = useClerk();

  useEffect(() => {
    if (!user) return;

    router.push(`/${user.username}`);
  }, [user]);

  return (
    <div>
      {/* Nav */}
      <nav className="flex items-center justify-between p-4">
        <Link href={`/`} className="font-bold text-xl">
          {siteConfig.name}
        </Link>

        <div className="flex items-center gap-1">
          <Button asChild variant={`ghost`}>
            <Link href={`/sign-in`}>Log in</Link>
          </Button>
          <Button asChild>
            <Link href={`/sign-in`}>Get {siteConfig.name} free</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <div className="h-[calc(100dvh-68px)] flex justify-center items-center">
        <div className="flex flex-col gap-4 items-center text-center max-w-3xl">
          <h1 className="text-6xl font-bold text-pretty leading-tight">
            Your Ideas, Documents, Plans. Unified. Welcome to{" "}
            <u>{siteConfig.name}</u>
          </h1>
          <p className="text-pretty max-w-sm">
            {siteConfig.name} is the connected workspace where better, faster
            work happens.
          </p>
          <Button asChild>
            <Link href={`/sign-in`}>
              Get {siteConfig.name} free
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
