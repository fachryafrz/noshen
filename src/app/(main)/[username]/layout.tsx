"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DocumentHeader from "@/components/documents/header";
import { LoadingSpinner } from "@/components/spinner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useConvexAuth } from "convex/react";
import { useEffect, useState } from "react";

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useConvexAuth();
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  if (isLoading) {
    return (
      <div className="bg-secondary/20 flex h-dvh items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar />
      <main className="bg-secondary/20 grow">
        <DocumentHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
