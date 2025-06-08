import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
      {
        userAgent: [
          "Twitterbot",
          "facebookexternalhit",
          "facebot",
          "Slackbot",
          "Discordbot",
          "WhatsApp",
          "WhatsAppBot",
          "vercel-og",
          "vercel-favicon",
          "vercel-screenshot",
          "LinkedInBot",
        ],
        disallow: [" "],
      },
    ],
  };
}
