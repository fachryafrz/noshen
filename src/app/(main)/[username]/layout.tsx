"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DocumentHeader from "@/components/documents/header";
import { LoadingSpinner } from "@/components/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
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
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-secondary/20 grow">
        <DocumentHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
