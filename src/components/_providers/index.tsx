"use client";

import { Suspense } from "react";
import ClientAuthorization from "../client-authorization";
import { ConvexClientProvider } from "../convex-client-provider";
import { ThemeProvider } from "../theme-provider";
import { Toaster } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Providers({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ConvexClientProvider>
        <ClientAuthorization>
          <Suspense>{children}</Suspense>
        </ClientAuthorization>
        <Toaster position={isMobile ? "top-center" : "bottom-right"} />
      </ConvexClientProvider>
    </ThemeProvider>
  );
}
