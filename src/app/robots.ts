import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://planning.paduaweddings.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tour", "/privacy"],
        disallow: ["/planning/", "/staff/", "/admin/", "/auth/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
