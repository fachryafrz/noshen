export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Notion",
  description: "No description",
  url:
    process.env.NODE_ENV === "production"
      ? "https://notion.fachryafrz.com"
      : "http://localhost:3000",
  createdAt: "2025-06-04",
};
