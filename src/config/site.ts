export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Noshen",
  description: "A minimal Notion-like notes app that supports structured pages, nested navigation, and rich text editing.",
  url:
    process.env.NODE_ENV === "production"
      ? "https://noshen.fachryafrz.com"
      : "http://localhost:3000",
  createdAt: "2025-06-04",
};
