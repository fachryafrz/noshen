"use client";

import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "./ui/card";
import { Input } from "./ui/input";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { ConvexError } from "convex/values";
import { LoadingSpinner } from "./spinner";

export default function SetUsername() {
  const setUsernameFn = useMutation(api.auth.setUsername);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="bg-background flex min-h-svh items-center justify-center p-4">
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
