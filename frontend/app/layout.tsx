import type React from "react";
import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";
import { Suspense } from "react";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONT_END || "http://localhost:3000"),
  title: "FlexStyle - Thời trang hiện đại",
  description:
    "Cửa hàng thời trang trực tuyến hàng đầu Việt Nam với những sản phẩm chất lượng cao",
  openGraph: {
    title: "FlexStyle - Thời trang hiện đại",
    description:
      "Cửa hàng thời trang trực tuyến hàng đầu Việt Nam với những sản phẩm chất lượng cao",
    url: process.env.NEXT_PUBLIC_FRONT_END || "http://localhost:3000",
    siteName: "FlexStyle",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "FlexStyle",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlexStyle - Thời trang hiện đại",
    description:
      "Cửa hàng thời trang trực tuyến hàng đầu Việt Nam với những sản phẩm chất lượng cao",
    images: ["/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <Suspense>
              <main className="min-h-screen">{children}</main>
            </Suspense>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
