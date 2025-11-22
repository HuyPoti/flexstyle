import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham?skip=0&take=10000`,
    {
      cache: "no-store",
    }
  );
  const { data } = await response.clone().json();
  const slug = data.map((product: { slug: string }) => product.slug);
  return [
    {
      url: "",
      priority: 1,
    },
    {
      url: "/products",
      priority: 1,
    },
    {
      url: "/products/ao",
      priority: 0.9,
    },
    {
      url: "/products/quan",
      priority: 0.9,
    },
    {
      url: "/phukien",
      priority: 0.9,
    },
    {
      url: "/sale",
      priority: 0.9,
    },
    ...slug.map((sl: string) => ({
      url: `/products/${sl}`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    })),
  ];
}
