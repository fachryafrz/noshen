"use client";

import DocumentHeader from "@/components/documents/header";
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
      <div className="bg-secondary/20 flex h-dvh items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-secondary/20 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Content */}
      <main className="max-h-dvh min-h-dvh grow overflow-y-auto">
        {/* Header */}
        <DocumentHeader />

        {children}
      </main>
    </div>
  );
}
