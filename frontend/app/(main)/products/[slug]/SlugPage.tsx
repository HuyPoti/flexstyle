"use client";

import { useState, useMemo } from "react";
// import { useCallback } from "react";
// import { ImagePart, UploadedImage } from "@/lib/types";
// import { fileToBase64, getMimeTypeFromBase64 } from "@/utils/image-utils";
import Image from "next/image";
// import Head from "next/head";
import Link from "next/link";
import {
  // FacebookIcon,
  FacebookShareButton,
  // TwitterIcon,
  TwitterShareButton,
} from "react-share";
import {
  Star,
  ShoppingCart,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  Shield,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { formatPrice } from "@/lib/help";
import { useCart } from "@/contexts/cart-context";
import { useSuKienUuDai } from "@/contexts/sukienuudai-context";
// import ImageUploadCard from "@/components/image-load";
import type { Product, PhanHoi } from "@/lib/types";

export default function SlugPage({
  product,
  relatedProducts,
  feedbacks,
  feedbacksCustomer,
}: {
  product: Product;
  relatedProducts: Product[];
  feedbacks: PhanHoi[];
  feedbacksCustomer: string[];
}) {
  const { addItem } = useCart();
  const { suKienUuDais } = useSuKienUuDai();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showTryOnPopup, setShowTryOnPopup] = useState(false);
  // const [tryOnImage, setTryOnImage] = useState<File | null>(null);
  // const [tryOnPreview, setTryOnPreview] = useState<string | null>(null);
  // const [ apparelImageUrl, setApparelImageUrl ] = useState<string | null>(null); // Sử dụng hook để lấy URL ảnh thử trang phục
  const discountPercentage = suKienUuDais.PhanTramGiam || 0;
  // frontend base used to build full product URL for sharing
  const frontendBase =
    process.env.NEXT_PUBLIC_FRONT_END || "https://flexstyle.vercel.app";
  const productUrl = `${frontendBase}/products/${product.slug}`;

  // useEffect(() => {
  //   setApparelImageUrl(product.HinhAnh[0] || null);
  // }, [product]);
  // const [portraitImage, setPortraitImage] = useState<UploadedImage>(null);
  // const [apparelImage, setApparelImage] = useState<UploadedImage>(null);
  // const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null);

  // const handlePortraitChange = useCallback(async (file: File | null) => {
  //   setError(null);
  //   setGeneratedImage(null);
  //   if (file) {
  //     try {
  //       const base64 = await fileToBase64(file);
  //       setPortraitImage({
  //         data: base64.split(",")[1],
  //         mimeType: getMimeTypeFromBase64(base64),
  //       });
  //     } catch (err) {
  //       setError("Failed to process portrait image. Please try again.");
  //       setPortraitImage(null);
  //     }
  //   } else {
  //     setPortraitImage(null);
  //   }
  // }, []);

  // const handleApparelChange = useCallback(async (file: File | null) => {
  //   setError(null);
  //   setGeneratedImage(null);
  //   if (file) {
  //     try {
  //       const base64 = await fileToBase64(file);
  //       setApparelImage({
  //         data: base64.split(",")[1],
  //         mimeType: getMimeTypeFromBase64(base64),
  //       });
  //     } catch (err) {
  //       setError("Failed to process apparel image. Please try again.");
  //       setApparelImage(null);
  //     }
  //   } else {
  //     setApparelImage(null);
  //   }
  // }, []);

  // const generateCombinedImage = useCallback(async () => {
  //   if (!portraitImage || !apparelImage) {
  //     setError("Please upload both a portrait and an apparel image.");
  //     return;
  //   }

  //   setIsLoading(true);
  //   setError(null);
  //   setGeneratedImage(null);

  //   try {
  //     // Pass the raw ImagePart objects
  //     const result = await fetch("http://localhost:8080/api/gemini/blend", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         portrait: portraitImage,
  //         apparel: apparelImage,
  //       }),
  //     });
  //     if (result.ok) {
  //       const imageUrl = await result.text(); // or result.json() if your API returns JSON
  //       setGeneratedImage(imageUrl);
  //     } else {
  //       setError(
  //         "No combined image was generated. Please try different images."
  //       );
  //     }
  //   } catch (err: any) {
  //     setError(
  //       err.message || "An unknown error occurred during image generation."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [portraitImage, apparelImage]);
  // const resetApplication = useCallback(() => {
  //   setPortraitImage(null);
  //   setApparelImage(null);
  //   setGeneratedImage(null);
  //   setIsLoading(false);
  //   setError(null);
  //   // Reset file input elements manually if needed, or rely on React state clearing previews.
  //   const portraitInput = document.getElementById(
  //     "file-upload-Portrait-Image"
  //   ) as HTMLInputElement;
  //   const apparelInput = document.getElementById(
  //     "file-upload-Apparel-Image"
  //   ) as HTMLInputElement;
  //   if (portraitInput) portraitInput.value = "";
  //   if (apparelInput) apparelInput.value = "";
  // }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size ");
      return;
    }

    addItem({
      productId: String(
        product.CHITIETSANPHAM.find((s) => s.KichCo === selectedSize)?.MaCTSP
      ),
      name: product.TenSP,
      price: product.GiaBan * (1 - discountPercentage / 100),
      image: product.HinhAnh[0],
      size: selectedSize,
      color: product.MauSac,
      quantity,
    });

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % product.HinhAnh.length);
  };

  const prevImage = () => {
    setSelectedImageIndex(
      (prev) => (prev - 1 + product.HinhAnh.length) % product.HinhAnh.length
    );
  };
  // const copyToClipboard = async (text: string) => {
  // copy to clipboard helper
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      alert("Liên kết đã được sao chép vào bộ nhớ tạm!");
    } catch {
      alert("Không thể sao chép liên kết. Vui lòng sao chép thủ công.");
    }
  };

  // const shareWhatsApp = () => {
  //   const title = product.TenSP || "";
  //   const text = `${title}\n${productUrl}`.trim();
  //   const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  //   window.open(wa, "_blank");
  // };

  // Xử lý khi chọn ảnh thử trang phục
  // const handleTryOnImageChange = (file: File | null) => {
  //   setTryOnImage(file);
  //   console.log("tryOnImage", file);
  //   if (file) {
  //     // const url = URL.createObjectURL(file);
  //     // setTryOnPreview(url);
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setTryOnPreview(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   } else {
  //     setTryOnPreview(null);
  //   }
  // };

  // const canGenerate =
  //   portraitImage !== null && apparelImage !== null && !isLoading;

  // // Set apparelImage from product.HinhAnh[0] when popup mở
  // useEffect(() => {
  //   if (showTryOnPopup && product.HinhAnh[0]) {
  //     // Tạo base64 từ URL ảnh sản phẩm
  //     fetch("https:" + product.HinhAnh[0])
  //       .then((res) => res.blob())
  //       .then((blob) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const base64 = reader.result as string;
  //           setApparelImage({
  //             data: base64.split(",")[1],
  //             mimeType: base64.substring(
  //               base64.indexOf(":") + 1,
  //               base64.indexOf(";")
  //             ),
  //           });
  //         };
  //         reader.readAsDataURL(blob);
  //       });
  //   } else {
  //     setApparelImage(null);
  //   }
  // }, [showTryOnPopup, product.HinhAnh]);
  const inStock = product.CHITIETSANPHAM.some((c) => (c.SoLuong ?? 0) > 0);
  const price = product.GiaBan * (1 - discountPercentage / 100);
  const avgRating = useMemo(() => {
    if (!feedbacks || feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((s, f) => s + (Number(f.SoSao) || 0), 0);
    return Math.round((sum / feedbacks.length) * 10) / 10;
  }, [feedbacks]);
  const jsonLd = useMemo(() => {
    const BASE =
      typeof window !== "undefined" && window.location
        ? `${window.location.origin}`
        : "https://flex-style.vercel.app";

    const images =
      Array.isArray(product.HinhAnh) && product.HinhAnh.length
        ? product.HinhAnh.map((img) =>
            String(img).startsWith("http")
              ? String(img)
              : "https:" + String(img)
          )
        : [`${BASE}/og-default.png`];

    const productSchema: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.TenSP ?? "",
      image: images,
      description: product.MoTa ?? "",
      sku: product.MaSP ?? "",
      mpn: product.MaSP ?? "",
      brand: {
        "@type": "Brand",
        name: "FlexStyle",
      },
      offers: {
        "@type": "Offer",
        url: `${BASE}/products/${encodeURIComponent(
          String(product.slug ?? product.MaSP ?? "")
        )}`,
        priceCurrency: "VND",
        price: Number(price || product.GiaBan || 0),
        availability: inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    };

    if (feedbacks && feedbacks.length > 0) {
      productSchema["aggregateRating"] = {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: feedbacks.length,
      };
      productSchema["review"] = feedbacks.slice(0, 5).map((r, i) => ({
        "@type": "Review",
        author: feedbacksCustomer[i] ?? "Khách hàng",
        datePublished: String(r.created_at ?? "").split("T")[0] || undefined,
        reviewBody: r.BinhLuan ?? "",
        reviewRating: {
          "@type": "Rating",
          ratingValue: Number(r.SoSao ?? 0),
        },
      }));
    }

    return JSON.stringify(productSchema);
  }, [product, feedbacks, feedbacksCustomer, avgRating, price, inStock]);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      {/* <Head>
        <meta property="og:title" content={product.TenSP} />
        <meta property="og:description" content={product.MoTa || ""} />
        <meta property="og:image" content={"https:" + product.HinhAnh[0]} />
        <meta property="og:url" content={"https://yame.vn"} />
        <meta property="og:type" content="product" />
      </Head> */}
      <article className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Sản phẩm
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.TenSP}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <figure className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.HinhAnh[selectedImageIndex]}
                alt={product.TenSP}
                fill
                className="object-cover"
                priority
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* Navigation Arrows */}
              {product.HinhAnh.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.HinhAnh.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.HinhAnh.map((image, index) => (
                  <button
                    key={index}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <Image
                      src={image}
                      alt={`${product.TenSP} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </figure>

          {/* Product Info */}
          <section className="space-y-6" aria-label="Product Information">
            <header>
              <h1 className="text-3xl font-bold mb-2">{product.TenSP}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <
                        Math.floor(
                          feedbacks
                            .map((fb) => fb.SoSao)
                            .reduce((a, b) => a + b, 0) / feedbacks.length
                        )
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ( {feedbacks.length} đánh giá)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.GiaBan * (1 - discountPercentage / 100))}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.GiaBan)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">
                    Tiết kiệm {discountPercentage}%
                  </Badge>
                )}
              </div>
            </header>

            {/* Description */}
            <div>
              <p className="text-muted-foreground leading-relaxed">
                {product.MoTa}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="font-semibold mb-3">Kích thước</h3>
              <div className="flex flex-wrap gap-2">
                {product.CHITIETSANPHAM.map((size) => (
                  <Button
                    key={size.KichCo}
                    variant={
                      selectedSize === size.KichCo ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedSize(size.KichCo)}
                    className="min-w-[3rem]"
                  >
                    {size.KichCo}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="font-semibold mb-3">Màu sắc</h3>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm">
                  {product.MauSac}
                </Button>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Số lượng</h3>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-semibold">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleAddToCart}
                disabled={
                  !product.CHITIETSANPHAM.filter(
                    (s) => s.KichCo === selectedSize
                  )[0] ||
                  product.CHITIETSANPHAM.filter(
                    (s) => s.KichCo === selectedSize
                  )[0].SoLuong <= 0
                }
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {selectedSize
                  ? !product.CHITIETSANPHAM.filter(
                      (s) => s.KichCo === selectedSize
                    )[0] ||
                    product.CHITIETSANPHAM.filter(
                      (s) => s.KichCo === selectedSize
                    )[0].SoLuong <= 0
                    ? "Hết hàng"
                    : "Thêm vào giỏ hàng"
                  : "Chọn kích thước để thêm vào giỏ hàng"}
              </Button>

              <div className="flex space-x-3">
                {/* <Button
                variant="outline"
                size="lg"
                className="flex-1 bg-transparent"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 mr-2 ${
                    isWishlisted ? "fill-current text-red-500" : ""
                  }`}
                />
                Yêu thích
              </Button> */}
                {/* --- SHARE BUTTONS (REACT-SHARE) --- */}
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={() => copyToClipboard(productUrl)}
                >
                  <Copy className="h-5 w-5 mr-2" />
                  Sao chép liên kết
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowTryOnPopup(true)}
                >
                  Thử trang phục
                </Button>
              </div>
              <div className="flex space-x-3">
                {/* FACEBOOK */}
                <FacebookShareButton
                  url={productUrl}
                  title={product.TenSP}
                  hashtag="#FlexStyle"
                  className="flex-1"
                >
                  <div
                    className="
                      flex flex-row items-center justify-center 
                      gap-2 border p-2 rounded-md
                      transition-all duration-200
                      hover:bg-blue-600 hover:text-white
                      hover:border-blue-600
                      cursor-pointer select-none
                    "
                  >
                    {/* Facebook Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.325 
                      24h11.494v-9.294H9.691v-3.622h3.128V8.413c0-3.1 1.893-4.788 
                      4.659-4.788 1.325 0 2.464.099 2.795.143v3.24l-1.918.001c-1.504 
                      0-1.796.715-1.796 1.764v2.314h3.587l-.467 3.622h-3.12V24h6.116C23.403 
                      24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
                    </svg>

                    Chia sẻ Facebook
                  </div>
                </FacebookShareButton>

                {/* X (TWITTER) */}
                <TwitterShareButton
                  url={productUrl}
                  title={product.TenSP}
                  className="flex-1"
                >
                  <div
                    className="
                      flex flex-row items-center justify-center 
                      gap-2 border p-2 rounded-md
                      transition-all duration-200
                      hover:bg-black hover:text-white
                      hover:border-black
                      cursor-pointer select-none
                    "
                  >
                    {/* X Icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M18.244 2H21.5l-7.4 8.466L23 22h-7.682l-5.01-6.527L4.4 
                      22H1.143l7.93-9.066L1 2h7.74l4.56 6.038L18.244 2z" />
                    </svg>
                              
                    Chia sẻ X
                  </div>
                </TwitterShareButton>
              </div>
            </div>

            {/* Features */}
            <section aria-label="Services" className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Giao hàng miễn phí</p>
                  <p className="text-xs text-muted-foreground">
                    Những khách hàng thân thuộc
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Đổi trả dễ dàng</p>
                  <p className="text-xs text-muted-foreground">
                    Trong vòng 7 ngày
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Bảo hành chính hãng</p>
                  <p className="text-xs text-muted-foreground">
                    100% hàng thật
                  </p>
                </div>
              </div>
            </section>
          </section>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
              <TabsTrigger value="specifications">Thông số</TabsTrigger>
              <TabsTrigger value="reviews">
                Đánh giá ({feedbacks.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose max-w-none">
                    <h4 className="font-semibold mb-2">Đặc điểm nổi bật:</h4>

                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {product.MoTa ? (
                        product.MoTa.split(" | ").map((line, index) => (
                          <li key={index}>{line}</li>
                        ))
                      ) : (
                        <>
                          <li>Chất liệu cao cấp, bền đẹp theo thời gian</li>
                          <li>Thiết kế hiện đại, phù hợp nhiều dịp</li>
                          <li>Form dáng chuẩn, tôn dáng người mặc</li>
                          <li>Dễ dàng phối đồ với nhiều trang phục khác</li>
                          <li>Chăm sóc đơn giản, giặt máy được</li>
                          <li>
                            Thân thiện với môi trường, sử dụng chất liệu tái chế
                          </li>
                          <li>Được sản xuất bởi các nhà thiết kế hàng đầu</li>
                          <li>Phù hợp với mọi độ tuổi và giới tính</li>
                          <li>
                            Được kiểm tra chất lượng nghiêm ngặt trước khi xuất
                            xưởng
                          </li>
                          <li>Hỗ trợ bảo hành sản phẩm trong vòng 1 năm</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Thông tin sản phẩm</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Chất liệu:
                          </span>
                          <span>Cotton 100%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Xuất xứ:
                          </span>
                          <span>Việt Nam</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Thương hiệu:
                          </span>
                          <span>FlexStyle</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Hướng dẫn bảo quản</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <li>
                          Không sử dụng chất tẩy rửa mạnh để tránh làm hỏng vải.
                        </li>
                        <li>
                          Giặt sản phẩm bằng nước lạnh để giữ màu sắc lâu bền.
                        </li>
                        <li>
                          Không vắt sản phẩm quá mạnh để tránh làm mất form
                          dáng.
                        </li>
                        <li>
                          Phơi sản phẩm trên bề mặt phẳng để tránh bị giãn.
                        </li>
                        <li>
                          Tránh để sản phẩm tiếp xúc với ánh nắng mặt trời trực
                          tiếp.
                        </li>
                        <li>
                          Không sử dụng bàn ủi ở nhiệt độ cao trên các chi tiết
                          in.
                        </li>
                        <li>
                          Giặt sản phẩm ngay sau khi bị bẩn để tránh vết ố.
                        </li>
                        <li>
                          Không sử dụng máy giặt chế độ mạnh để giặt sản phẩm.
                        </li>
                        <li>Phơi sản phẩm ở nơi thoáng mát, tránh ẩm ướt.</li>
                        <li>
                          Không để sản phẩm tiếp xúc với các vật sắc nhọn.
                        </li>
                        <li>
                          Giặt riêng các sản phẩm có màu đậm để tránh lem màu.
                        </li>
                        
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Review Summary */}
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold">
                          {feedbacks.length ? feedbacks.length : 0}
                        </div>
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i <
                                Math.floor(
                                  feedbacks
                                    .map((fb) => fb.SoSao)
                                    .reduce((a, b) => a + b, 0) /
                                    feedbacks.length
                                )
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {feedbacks.length} đánh giá
                        </div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map((stars) => (
                          <div
                            key={stars}
                            className="flex items-center space-x-2 mb-1"
                          >
                            <span className="text-sm w-8">{stars}★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full">
                              <div
                                className="h-2 bg-yellow-400 rounded-full"
                                style={{
                                  width: `${
                                    (feedbacks.filter(
                                      (fb) => fb.SoSao === stars
                                    ).length /
                                      feedbacks.length) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {feedbacks.map((review, index) => (
                        <div
                          key={index}
                          className="border-b pb-4 last:border-b-0"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold">
                              {feedbacksCustomer[index] || "Khách hàng"}
                            </span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.SoSao
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {review.created_at.split("T")[0]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {review.BinhLuan}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Product Story - SEO Content */}
        <section className="mb-16 py-8 px-6 border-l-4 border-primary bg-muted/10">
          <h2 className="text-2xl font-bold mb-4">Câu chuyện sản phẩm</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Mỗi sản phẩm tại FlexStyle không chỉ là một món đồ thời trang, mà là kết tinh của quá trình nghiên cứu và sáng tạo không ngừng nghỉ. 
            <strong>{product.TenSP}</strong> được lấy cảm hứng từ nhịp sống năng động của thành phố hiện đại, nơi sự tiện dụng và phong cách cá nhân luôn được đề cao.
            Chúng tôi muốn tạo ra một sản phẩm có thể đồng hành cùng bạn từ văn phòng đến những buổi dạo phố cuối tuần, xóa nhòa ranh giới giữa trang phục công sở và thường ngày.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Đội ngũ thiết kế đã dành hàng trăm giờ để thử nghiệm các loại vải khác nhau, tìm kiếm sự cân bằng hoàn hảo giữa độ bền, khả năng thấm hút và cảm giác mềm mại trên da.
            Từng đường may, mũi chỉ đều được chăm chút tỉ mỉ để đảm bảo form dáng chuẩn xác nhất, tôn lên vẻ đẹp tự nhiên của người mặc.
            Khi bạn chọn <strong>{product.TenSP}</strong>, bạn không chỉ chọn một sản phẩm thời trang, mà bạn đang chọn một phong cách sống hiện đại, tự tin và đầy cảm hứng.
          </p>
        </section>

        {/* Material Science - SEO Content */}
        {/* Material Science - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-background border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Tiêu chuẩn Chất lượng & Thiết kế</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Chất liệu tuyển chọn (Premium Materials)</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Sản phẩm <strong>{product.TenSP}</strong> được chế tác từ những chất liệu cao cấp, được tuyển chọn kỹ lưỡng để đảm bảo sự thoải mái tối đa cho người mặc. 
                Chúng tôi ưu tiên các loại vải có độ bền cao, khả năng giữ form tốt và an toàn cho làn da.
                Dù là chất liệu tự nhiên hay tổng hợp, FlexStyle luôn đặt tiêu chí &quot;Cảm giác người dùng&quot; lên hàng đầu, giúp bạn luôn cảm thấy tự tin và dễ chịu trong mọi hoạt động.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Quy trình gia công tỉ mỉ</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Mỗi sản phẩm tại FlexStyle đều trải qua quy trình sản xuất và kiểm tra chất lượng nghiêm ngặt. 
                Từ đường may mũi chỉ đến các chi tiết nhỏ nhất như khuy áo, khóa kéo đều được chăm chút để đạt độ hoàn thiện cao nhất.
                Chúng tôi áp dụng các công nghệ sản xuất hiện đại kết hợp với tay nghề thủ công của những người thợ lành nghề, đảm bảo sản phẩm đến tay bạn luôn là phiên bản hoàn hảo nhất.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section - SEO Content */}
        <section className="mb-16 py-8 bg-muted/30 rounded-lg px-6">
          <h2 className="text-2xl font-bold mb-6">Tại sao nên chọn FlexStyle?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Chất lượng vượt trội & Kiểm định nghiêm ngặt</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Tại FlexStyle, &quot;chất lượng&quot; không chỉ là một lời hứa, mà là tôn chỉ hoạt động. Chúng tôi cam kết mang đến những sản phẩm thời trang chất lượng cao nhất thị trường. 
                Mỗi sản phẩm <strong>{product.TenSP}</strong> đều phải trải qua quy trình kiểm tra chất lượng (QC) 3 bước nghiêm ngặt: kiểm tra nguyên liệu đầu vào, kiểm tra bán thành phẩm và kiểm tra thành phẩm cuối cùng.
                Chúng tôi sử dụng các chất liệu vải cao cấp, được nhập khẩu từ các nhà cung cấp uy tín, đảm bảo độ bền màu, không bai dão và an toàn tuyệt đối cho làn da nhạy cảm.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Công nghệ dệt may và in ấn tiên tiến nhất được áp dụng để đảm bảo từng chi tiết nhỏ nhất cũng đạt độ hoàn thiện cao. 
                Sự tỉ mỉ trong từng đường kim mũi chỉ là minh chứng rõ ràng nhất cho tâm huyết mà đội ngũ thợ lành nghề của chúng tôi dành cho mỗi sản phẩm.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Cam kết bền vững & Trách nhiệm xã hội</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi hiểu rằng thời trang không chỉ là vẻ đẹp bên ngoài mà còn là trách nhiệm với môi trường và cộng đồng. 
                FlexStyle đang tiên phong trong việc chuyển đổi sang quy trình sản xuất xanh (Green Manufacturing). Chúng tôi tối ưu hóa quy trình cắt vải để giảm thiểu rác thải, 
                sử dụng bao bì đóng gói có thể phân hủy sinh học và ưu tiên các loại vải tái chế hoặc vải sợi tự nhiên thân thiện với môi trường.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Bên cạnh đó, dịch vụ chăm sóc khách hàng tận tâm luôn sẵn sàng hỗ trợ bạn 24/7. 
                Chính sách đổi trả linh hoạt trong 30 ngày và giao hàng hỏa tốc giúp bạn an tâm tuyệt đối khi mua sắm tại FlexStyle. 
                Chúng tôi tin rằng, sự hài lòng của bạn chính là thước đo thành công của chúng tôi.
              </p>
            </div>
          </div>
        </section>

        {/* Style Guide - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-muted/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Gợi ý phong cách (Style Guide)</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Phong cách Hàng ngày (Daily Casual)</h3>
              <p className="text-muted-foreground leading-relaxed">
                <strong>{product.TenSP}</strong> là sự lựa chọn hoàn hảo cho phong cách thường ngày. 
                Bạn có thể dễ dàng kết hợp sản phẩm này với các trang phục cơ bản khác trong tủ đồ của mình. 
                Sự đơn giản nhưng tinh tế của thiết kế giúp bạn luôn trông gọn gàng và thời trang mà không cần tốn quá nhiều công sức phối đồ.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Phong cách Hiện đại & Thanh lịch</h3>
              <p className="text-muted-foreground leading-relaxed">
                Để nâng tầm phong cách, hãy thử kết hợp <strong>{product.TenSP}</strong> với các phụ kiện tối giản hoặc khoác thêm một lớp áo ngoài (layering). 
                Sự linh hoạt của sản phẩm cho phép bạn biến hóa từ phong cách năng động sang thanh lịch chỉ trong tích tắc, phù hợp cho cả đi làm, đi học hay những buổi gặp gỡ bạn bè.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Tự do thể hiện cá tính</h3>
              <p className="text-muted-foreground leading-relaxed">
                Thời trang là không giới hạn. Đừng ngần ngại thử nghiệm <strong>{product.TenSP}</strong> với những cách phối đồ mới lạ. 
                Dù bạn yêu thích sự tối giản (Minimalism) hay phá cách (Street Style), sản phẩm này đều có thể trở thành một mảnh ghép thú vị trong outfit của bạn. 
                Hãy để FlexStyle đồng hành cùng bạn trên hành trình khẳng định chất riêng.
              </p>
            </div>
          </div>
        </section>

        {/* Sustainability Deep Dive - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-background border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Cam kết phát triển bền vững</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Tại FlexStyle, chúng tôi tin rằng tương lai của thời trang phải là sự cộng sinh hài hòa với thiên nhiên. 
              Chúng tôi không ngừng nỗ lực để giảm thiểu tác động tiêu cực lên môi trường thông qua việc tối ưu hóa quy trình vận hành và đóng gói.
              Mỗi lựa chọn của bạn tại FlexStyle đều góp phần ủng hộ xu hướng thời trang có trách nhiệm.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Bên cạnh đó, chúng tôi cam kết xây dựng một môi trường làm việc công bằng và an toàn cho tất cả nhân viên và đối tác trong chuỗi cung ứng. 
              Sự minh bạch và đạo đức kinh doanh là nền tảng cốt lõi trong mọi hoạt động của FlexStyle.
              Chúng tôi hy vọng sẽ cùng bạn kiến tạo nên một tương lai xanh hơn, nơi thời trang và sự bền vững song hành cùng nhau.
            </p>
          </div>
        </section>

        {/* Community & Lifestyle - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-muted/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Cộng đồng FlexStyle & Phong cách sống</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Kết nối những tâm hồn đồng điệu</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                FlexStyle không chỉ bán quần áo, chúng tôi xây dựng một cộng đồng những người trẻ năng động, tự tin và dám nghĩ dám làm. 
                Sở hữu <strong>{product.TenSP}</strong> là bạn đã gia nhập vào đại gia đình #FlexStyleCrew - nơi chia sẻ niềm đam mê thời trang và phong cách sống tích cực.
                Hàng tháng, chúng tôi tổ chức các workshop về thời trang, nghệ thuật và bảo vệ môi trường để kết nối các thành viên.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Lan tỏa cảm hứng tích cực</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Chúng tôi tin rằng mỗi bộ trang phục đều mang một câu chuyện và năng lượng riêng. 
                Khi bạn khoác lên mình sản phẩm của FlexStyle, chúng tôi hy vọng bạn sẽ cảm thấy được tiếp thêm sức mạnh để chinh phục mọi thử thách.
                Hãy chia sẻ câu chuyện của bạn cùng hashtag #MyFlexStyle trên mạng xã hội để lan tỏa cảm hứng đến hàng triệu người khác. 
                Những câu chuyện hay nhất sẽ được chúng tôi vinh danh và trao tặng những phần quà giá trị.
              </p>
            </div>
          </div>
        </section>

        {/* Expert Care Guide - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-background border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Chuyên gia bảo quản (Expert Care Guide)</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Để sản phẩm <strong>{product.TenSP}</strong> luôn bền đẹp như mới, việc bảo quản đúng cách là vô cùng quan trọng. 
              Các chuyên gia thời trang tại FlexStyle khuyên bạn nên giặt sản phẩm bằng nước lạnh để bảo vệ cấu trúc sợi vải và màu sắc. 
              Luôn lộn trái sản phẩm trước khi giặt để giảm thiểu ma sát bề mặt, giúp hình in (nếu có) và bề mặt vải không bị trầy xước.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Về việc phơi phóng, hãy tránh ánh nắng trực tiếp gay gắt vì tia UV có thể làm bạc màu vải nhanh chóng. 
              Phơi ở nơi thoáng mát, có gió tự nhiên là lý tưởng nhất. 
              Đối với việc ủi (là), hãy chọn nhiệt độ vừa phải và ủi mặt trái của sản phẩm. 
              Một chút lưu ý nhỏ trong quá trình chăm sóc sẽ giúp món đồ yêu thích đồng hành cùng bạn dài lâu hơn.
            </p>
          </div>
        </section>

        {/* The Perfect Gift - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-muted/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Món quà ý nghĩa (The Perfect Gift)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Sự lựa chọn tinh tế</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Bạn đang tìm kiếm một món quà vừa thiết thực vừa thời trang cho người thân, bạn bè hay &quot;người ấy&quot;? 
                <strong>{product.TenSP}</strong> chính là câu trả lời hoàn hảo. 
                Với thiết kế hiện đại, dễ mặc và chất lượng cao cấp, đây là món quà thể hiện sự quan tâm tinh tế của bạn đến phong cách và sự thoải mái của người nhận.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Trao gửi yêu thương</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Không chỉ là một món đồ, mỗi sản phẩm FlexStyle được trao đi còn gói ghém trong đó những thông điệp yêu thương. 
                Dù là dịp sinh nhật, kỷ niệm hay chỉ đơn giản là một ngày bình thường muốn tạo bất ngờ, 
                hãy để FlexStyle giúp bạn gửi gắm những tình cảm chân thành nhất qua những sản phẩm chất lượng.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Content */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Câu hỏi thường gặp (FAQ)</h2>
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-semibold mb-2">Làm sao để chọn size {product.TenSP} phù hợp nhất?</h3>
              <p className="text-muted-foreground">
                Để chọn được size vừa vặn nhất, bạn vui lòng tham khảo &quot;Bảng quy đổi kích cỡ&quot; chi tiết được đặt ngay bên cạnh phần chọn size. 
                Bảng size của chúng tôi được xây dựng dựa trên số đo chuẩn của người Việt Nam.
                Nếu bạn vẫn còn phân vân giữa hai size, hoặc có số đo đặc biệt, đừng ngần ngại nhắn tin trực tiếp cho đội ngũ tư vấn viên của FlexStyle. 
                Chúng tôi sẽ dựa trên chiều cao, cân nặng và sở thích mặc (ôm body hay rộng rãi) để tư vấn size chính xác nhất cho bạn.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-semibold mb-2">Chính sách đổi trả của FlexStyle như thế nào?</h3>
              <p className="text-muted-foreground">
                Chúng tôi cam kết quyền lợi tối đa cho khách hàng với chính sách đổi trả linh hoạt. 
                Bạn có thể yêu cầu đổi trả sản phẩm trong vòng <strong>7 ngày</strong> kể từ ngày nhận hàng. 
                Điều kiện đổi trả áp dụng cho các sản phẩm còn nguyên tem mác, chưa qua sử dụng, giặt ủi và không có mùi lạ.
                Chúng tôi hỗ trợ đổi size, đổi màu hoặc đổi sang sản phẩm khác có giá trị tương đương hoặc cao hơn. 
                Trong trường hợp sản phẩm có lỗi từ nhà sản xuất, FlexStyle sẽ chịu hoàn toàn phí vận chuyển đổi trả.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-semibold mb-2">Thời gian giao hàng dự kiến là bao lâu?</h3>
              <p className="text-muted-foreground">
                FlexStyle hợp tác với các đơn vị vận chuyển uy tín nhất để đảm bảo hàng hóa đến tay bạn nhanh chóng.
                Thời gian giao hàng tiêu chuẩn là từ <strong>2-4 ngày làm việc</strong> đối với các tỉnh thành khác.
                Đặc biệt, đối với khách hàng tại khu vực nội thành Hà Nội và TP.HCM, chúng tôi cung cấp dịch vụ giao hàng hỏa tốc, nhận hàng ngay trong ngày hoặc sau 24h.
                Bạn có thể theo dõi hành trình đơn hàng trực tiếp trên website hoặc qua mã vận đơn được gửi về email/SMS.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-semibold mb-2">Sản phẩm có bị phai màu hay co rút khi giặt không?</h3>
              <p className="text-muted-foreground">
                Sản phẩm <strong>{product.TenSP}</strong> của FlexStyle được sản xuất từ chất liệu vải cao cấp đã qua xử lý wash công nghiệp, giúp hạn chế tối đa tình trạng co rút sau khi giặt.
                Về độ bền màu, chúng tôi sử dụng công nghệ nhuộm hoạt tính tiên tiến, giúp màu sắc bám sâu vào sợi vải. 
                Tuy nhiên, để sản phẩm luôn bền đẹp như mới, chúng tôi khuyên bạn nên: giặt bằng nước lạnh, lộn trái sản phẩm khi giặt, không sử dụng chất tẩy rửa mạnh và tránh phơi trực tiếp dưới ánh nắng gắt.
              </p>
            </div>
            <div className="border rounded-lg p-4 bg-background">
              <h3 className="font-semibold mb-2">Tôi có được kiểm tra hàng trước khi thanh toán không?</h3>
              <p className="text-muted-foreground">
                Hoàn toàn được! FlexStyle luôn khuyến khích khách hàng kiểm tra sản phẩm trước khi nhận. 
                Bạn có thể mở gói hàng, kiểm tra màu sắc, chất liệu, size số và tình trạng sản phẩm. 
                Nếu sản phẩm đúng như mô tả và đơn đặt hàng, bạn mới cần thanh toán cho shipper. 
                Nếu có bất kỳ vấn đề gì, bạn có thể từ chối nhận hàng và liên hệ ngay với hotline của chúng tôi để được hỗ trợ.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Sizing Guide - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-background border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Hướng dẫn chọn size chi tiết</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Việc chọn đúng size là yếu tố quan trọng nhất để bạn cảm thấy thoải mái và tự tin khi mặc <strong>{product.TenSP}</strong>. 
              Dưới đây là hướng dẫn chi tiết cách đo các chỉ số cơ thể để đối chiếu với bảng size của FlexStyle:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>
                <strong>Vòng ngực (Chest):</strong> Dùng thước dây đo vòng quanh phần rộng nhất của ngực. Đảm bảo thước dây đi qua dưới nách và nằm ngang sau lưng. 
                Đừng giữ hơi quá chặt, hãy để thước dây vừa vặn thoải mái.
              </li>
              <li>
                <strong>Chiều dài áo (Length):</strong> Đo từ điểm cao nhất của vai (gần cổ) xuống đến gấu áo (vị trí bạn muốn áo kết thúc). 
                Bạn có thể lấy một chiếc áo thun cũ mà bạn cảm thấy vừa vặn nhất để đo chiều dài này và so sánh.
              </li>
              <li>
                <strong>Chiều rộng vai (Shoulder):</strong> Đo khoảng cách giữa hai điểm đầu vai. Đây là chỉ số quan trọng để áo lên form chuẩn, không bị xệ vai hoặc kích nách.
              </li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              <strong>Lưu ý:</strong> Bảng size của FlexStyle là bảng size chuẩn Regular Fit. 
              Nếu bạn có thân hình mảnh khảnh, hãy chọn đúng size theo chiều cao. 
              Nếu bạn có thân hình đầy đặn hoặc có bụng, hãy ưu tiên chọn size theo cân nặng hoặc vòng bụng. 
              Trong trường hợp số đo của bạn nằm giữa hai size, chúng tôi khuyên bạn nên chọn size lớn hơn để mặc thoải mái hơn (bạn có thể sửa nhỏ lại nếu cần, nhưng không thể nới rộng ra).
            </p>
          </div>
        </section>

        {/* SEO Footer Text */}
        <section className="mb-16 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground mb-2">Mua sắm {product.TenSP} chính hãng tại FlexStyle</h2>
          <p>
            Bạn đang tìm kiếm <strong>{product.TenSP}</strong> chất lượng cao với thiết kế thời thượng? 
            FlexStyle là điểm đến lý tưởng dành cho bạn. Sản phẩm <strong>{product.TenSP}</strong> của chúng tôi không chỉ nổi bật với kiểu dáng đẹp mắt 
            mà còn mang lại sự thoải mái tối đa nhờ chất liệu cao cấp. 
            Dù bạn đi làm, đi chơi hay tham gia các hoạt động thể thao, <strong>{product.TenSP}</strong> đều là sự lựa chọn hoàn hảo. 
            Đặt mua ngay hôm nay để nhận được nhiều ưu đãi hấp dẫn và trải nghiệm dịch vụ mua sắm trực tuyến tuyệt vời tại FlexStyle.
          </p>
        </section>

        {/* Fashion Trends & Styling Advice - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-muted/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Xu hướng thời trang & Tư vấn phối đồ chuyên sâu</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Quy tắc phối màu (Color Coordination)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Khi phối đồ với <strong>{product.TenSP}</strong>, việc nắm vững quy tắc bánh xe màu sắc là vô cùng hữu ích. 
                Bạn có thể áp dụng quy tắc phối màu tương đồng (Analogous) để tạo nên sự hài hòa, nhẹ nhàng, hoặc phối màu tương phản (Complementary) để tạo điểm nhấn ấn tượng. 
                Ví dụ, nếu sản phẩm có tông màu trung tính (đen, trắng, xám, be), bạn có thể dễ dàng kết hợp với bất kỳ màu sắc nào khác. 
                Ngược lại, nếu sản phẩm có màu sắc nổi bật, hãy tiết chế bằng cách kết hợp với các item màu đơn sắc để tổng thể trang phục không bị rối mắt.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Nghệ thuật Layering (Phối lớp)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Layering là chìa khóa để biến hóa trang phục trở nên thú vị hơn. 
                Với <strong>{product.TenSP}</strong>, bạn có thể thử nghiệm mặc bên trong áo khoác denim, blazer hoặc cardigan mỏng tùy theo thời tiết. 
                Đừng quên chú ý đến độ dày mỏng của từng lớp áo để đảm bảo sự thoải mái và không làm mất đi form dáng của sản phẩm chính. 
                Sự kết hợp khéo léo giữa các lớp trang phục (textures) khác nhau cũng sẽ giúp outfit của bạn trông có chiều sâu và sành điệu hơn.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Phụ kiện - Điểm nhấn hoàn hảo</h3>
              <p className="text-muted-foreground leading-relaxed">
                Đừng bao giờ đánh giá thấp sức mạnh của phụ kiện. Một chiếc đồng hồ, dây chuyền mảnh hay một chiếc mũ lưỡi trai phù hợp có thể nâng tầm set đồ với <strong>{product.TenSP}</strong> lên một đẳng cấp mới. 
                Tuy nhiên, hãy nhớ quy tắc &quot;Less is More&quot; - đừng lạm dụng quá nhiều phụ kiện khiến tổng thể trở nên rườm rà. 
                Hãy chọn những món phụ kiện phản ánh đúng cá tính và phong cách mà bạn đang hướng tới.
              </p>
            </div>
          </div>
        </section>

        {/* Material Dictionary - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-background border rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Từ điển chất liệu & Công nghệ dệt may</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-3">Cotton - Vua của các loại vải</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cotton là chất liệu tự nhiên phổ biến nhất trong ngành thời trang nhờ khả năng thấm hút mồ hôi tuyệt vời và độ thoáng khí cao. 
                Sợi cotton mềm mại, thân thiện với làn da, đặc biệt phù hợp với khí hậu nhiệt đới nóng ẩm. 
                Tại FlexStyle, chúng tôi sử dụng các loại cotton cao cấp (như Cotton USA, Cotton Pima) để đảm bảo độ bền và hạn chế tình trạng xù lông sau thời gian dài sử dụng.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">Polyester & Spandex - Sự bền bỉ và đàn hồi</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Polyester mang lại độ bền vượt trội, khả năng chống nhăn và giữ màu tốt, trong khi Spandex (Elastane) cung cấp độ co giãn cần thiết cho sự vận động thoải mái. 
                Sự pha trộn tỷ lệ vàng giữa các loại sợi này trong <strong>{product.TenSP}</strong> giúp sản phẩm vừa giữ được form dáng đứng form, vừa mang lại cảm giác dễ chịu khi mặc. 
                Công nghệ dệt hiện đại giúp vải có bề mặt mịn màng và khả năng kháng khuẩn, khử mùi hiệu quả.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Shipping Policy - SEO Content */}
        <section className="mb-16 py-8 px-6 bg-muted/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Chi tiết chính sách vận chuyển & Đóng gói</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              FlexStyle hiểu rằng cảm giác chờ đợi món đồ yêu thích thật sự rất hồi hộp. 
              Vì vậy, chúng tôi đã tối ưu hóa quy trình kho vận để đảm bảo đơn hàng được xử lý nhanh nhất có thể. 
              Ngay khi bạn đặt hàng thành công, hệ thống sẽ tự động chuyển yêu cầu đến kho gần nhất. 
              Nhân viên kho sẽ tiến hành nhặt hàng, kiểm tra kỹ lưỡng lần cuối (QC) và đóng gói cẩn thận.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Quy cách đóng gói của FlexStyle luôn tuân thủ tiêu chuẩn cao: sản phẩm được gấp gọn gàng, bọc trong giấy pelure chống ẩm, đặt trong hộp carton cứng cáp hoặc túi niêm phong chuyên dụng (tùy loại sản phẩm). 
              Điều này đảm bảo <strong>{product.TenSP}</strong> đến tay bạn vẫn giữ nguyên form dáng và không bị ảnh hưởng bởi các tác động bên ngoài trong quá trình vận chuyển.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Chúng tôi hợp tác với các đối tác vận chuyển hàng đầu như Giao Hàng Nhanh (GHN), Giao Hàng Tiết Kiệm (GHTK), Viettel Post... để phủ sóng giao hàng toàn quốc. 
              Bạn có thể dễ dàng tra cứu hành trình đơn hàng mọi lúc mọi nơi. 
              Nếu có bất kỳ vấn đề gì phát sinh trong quá trình vận chuyển (hàng chậm, thất lạc...), đội ngũ CSKH của FlexStyle sẽ chủ động làm việc với đơn vị vận chuyển để giải quyết thỏa đáng nhất cho bạn.
            </p>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <aside aria-label="Related Products">
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.MaSP}
                  product={relatedProduct}
                />
              ))}
            </div>
          </aside>
        )}

        {/* Try On Popup */}
        {showTryOnPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl p-8 shadow-2xl relative w-1/4 flex flex-col items-center">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
                onClick={() => setShowTryOnPopup(false)}
                aria-label="Đóng popup"
              >
                ×
              </button>
              <p className="text-center text-gray-600 text-lg max-w-2xl">
                Chức năng hiện{" "}
                <span className="font-semibold text-green-600">
                  đang được phát triển
                </span>
                . Vui lòng quay lại sau!
              </p>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
