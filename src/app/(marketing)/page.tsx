"use client";

import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

export default function HomePage() {
  // const router = useRouter();
  // const { user } = useClerk();

  // useEffect(() => {
  //   if (!user) return;

  //   router.push(`/${user.username}`);
  // }, [user]);

  return (
    <div>
      {/* Nav */}
      <nav className="flex items-center justify-between p-4">
        <Button asChild variant={"ghost"} className="gap-0.5">
          <Link href={`/`} className="text-xl font-bold">
            <Logo size={32} />
            {siteConfig.name.slice(1)}
          </Link>
        </Button>

        <div className="flex items-center gap-1">
          <Button asChild variant={`ghost`}>
            <Link href={`/sign-in`}>Log in</Link>
          </Button>
          <Button asChild>
            <Link href={`/sign-up`}>Get {siteConfig.name} free</Link>
          </Button>
          <ThemeToggle />
        </div>
      </nav>

      {/* Hero */}
      <div className="flex h-[calc(100dvh-68px)] items-center justify-center p-4">
        <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
          <h1 className="text-3xl leading-tight font-bold text-pretty md:text-5xl lg:text-6xl">
            Your Ideas, Documents, Plans. Unified. Welcome to{" "}
            <u>{siteConfig.name}</u>
          </h1>
          <p className="max-w-sm text-pretty">
            {siteConfig.name} is the connected workspace where better, faster
            work happens.
          </p>
          <Button asChild>
            <Link href={`/sign-up`}>
              Get {siteConfig.name} free
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
