"use client";

import { Unauthenticated } from "convex/react";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Unauthenticated>{children}</Unauthenticated>;
}
