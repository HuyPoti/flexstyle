import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SlugPage from "./SlugPage";

// Helper to ensure we have a usable absolute base URL
const getBaseUrl = () =>
  (process.env.NEXT_PUBLIC_FRONT_END || "").replace(/\/+$/, "") ||
  "https://flexstyle.vercel.app"; // fallback if env not set

async function getRelatedProducts(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/related/${encodeURIComponent(
      slug
    )}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch related products");
  }
  const data = await res.json();
  if (!data || !Array.isArray(data.data)) {
    throw new Error("Invalid related products data");
  }
  return data;
}
async function getReply(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/phanhoi?slug=${encodeURIComponent(
      slug
    )}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch related reply");
  }
  const data = await res.json();
  return data;
}

// Dynamic Open Graph / Twitter metadata per product
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug?.trim();
  if (!slug) return {};
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${encodeURIComponent(
        slug
      )}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) return {};
    const json = await res.json();
    const product = json?.data;
    if (!product) return {};

    const title = product.TenSP || "Sản phẩm FlexStyle";
    const description =
      (product.MoTa && String(product.MoTa).slice(0, 160)) ||
      `Xem chi tiết ${title} trên FlexStyle`;

    const base = getBaseUrl();

    // pick first image and normalize to absolute https URL
    const rawImage = product.HinhAnh && product.HinhAnh[0];
    const imageUrl =
      rawImage
        ? `${base}/api/proxy-image?url=${encodeURIComponent(rawImage)}`
        : `${base}/default-og.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        siteName: "FlexStyle",
        type: "website",
        url: `${base}/products/${encodeURIComponent(slug)}`,
        images: [
          {
            url: imageUrl,
            secureUrl: imageUrl,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: "vi_VN",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {};
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trimmedSlug = String(slug).trim();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham/${encodeURIComponent(
        trimmedSlug
      )}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch product: ${res.status}`);
    }

    const productData = await res.json();
    if (!productData || !productData.data) {
      throw new Error("Invalid product data");
    }

    const relatedProducts = await getRelatedProducts(trimmedSlug);
    const feedbacks = await getReply(trimmedSlug);
    console.log("Product Data:", productData);
    return (
      <>
        <SlugPage
          product={productData.data}
          relatedProducts={relatedProducts.data}
          feedbacks={feedbacks.data.feedbacks}
          feedbacksCustomer={feedbacks.data.feedbacksCustomer}
        />
      </>
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound(); // Fallback chung
  }
}
