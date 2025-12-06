"use client";

import { AppSidebar } from "@/components/app-sidebar";
import DocumentHeader from "@/components/documents/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

export default function UsernameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

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
