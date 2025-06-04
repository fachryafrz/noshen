"use client";

import Sidebar from "@/components/sidebar";
import { LoadingSpinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="bg-secondary/20 grow">{children}</main>
    </div>
  );
}
