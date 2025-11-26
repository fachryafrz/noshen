"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ConvexError } from "convex/values";
import { LoadingSpinner } from "./spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Input } from "./ui/input";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Button } from "./ui/button";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/"];

export default function ClientAuthorization({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getCurrentUser);
  const setUsernameFn = useMutation(api.auth.setUsername);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    if (!isAuthenticated && !isPublicPath) {
      router.push(`/sign-in?${searchParams.toString()}`);
    } else if (isAuthenticated && isPublicPath) {
      if (!user?.username) {
        router.push(`/?${searchParams.toString()}`);
      } else {
        router.push(`/${user.username}?${searchParams.toString()}`);
      }
    }
  }, [isLoading, isAuthenticated, pathname, router, searchParams, user]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isAuthenticated) {
    if (user === undefined) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (!user?.username) {
      return (
        <div className="bg-background flex h-screen w-full items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-col gap-1">
              <h1 className="text-xl font-bold">Set your username</h1>
              <CardDescription className="text-default-500 text-sm">
                Choose a unique username to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && username.length > 0) {
                    const submitBtn = document.getElementById(
                      "submit-username-btn",
                    );

                    if (submitBtn) submitBtn.click();
                  }
                }}
              />
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                color="primary"
                id="submit-username-btn"
                disabled={loading || username.length < 3}
                onClick={async () => {
                  try {
                    setLoading(true);
                    await setUsernameFn({ username });
                    // No need to redirect, state update will render children
                  } catch (error) {
                    if (error instanceof ConvexError) {
                      toast.error(error.data);
                    } else {
                      toast.error("An unexpected error occurred");
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {loading && <LoadingSpinner />}
                Set Username
              </Button>
            </CardFooter>
          </Card>
        </div>
      );
    }
  }

  return children;
}
