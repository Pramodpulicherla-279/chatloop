import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: "https://chatloop-six.vercel.app/sitemap.xml",
    host: "https://chatloop-six.vercel.app",
  };
}
