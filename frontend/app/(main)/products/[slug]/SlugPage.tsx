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
      <div className="container mx-auto px-4 py-8">
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
          <div className="space-y-4">
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
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {product.TenSP} lorem30
              </h1>

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
            </div>

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
                <FacebookShareButton
                  url={productUrl}
                  title={product.TenSP}
                  hashtag="#FlexStyle"
                  className="flex-1"
                >
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent"
                  > */}
                  <div className="flex flex-row items-center justify-center border p-2 rounded-md">
                    {/* <FacebookIcon size={32} round /> */}
                    Chia sẻ Facebook
                  </div>

                  {/* </Button> */}
                </FacebookShareButton>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={shareWhatsApp}
                >
                  {/* small WhatsApp icon */}
                {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    className="mr-2"
                    fill="currentColor"
                  >
                    <path d="M20.5 3.5A11 11 0 1012 23a10.7 10.7 0 005.7-1.6L22 22l-1.6-4.3A10.7 10.7 0 0023 12 11 11 0 0020.5 3.5zM12 20a8 8 0 118-8 8 8 0 01-8 8zm4-6.6c-.2-.1-1.2-.6-1.4-.6s-.4 0-.6.2c-.2.2-.8.6-1 1-.2.4-.4.2-.8.1s-1-.5-2-1.5-1.1-1.8-1.3-2.1c-.2-.3 0-.4.1-.6s.4-.6.6-.9.2-.4.3-.6c.1-.2 0-.4-.1-.6-.1-.2-.8-1.8-1-2.4-.2-.6-.4-.5-.6-.5h-.6c-.2 0-.6.1-.9.5s-1.2 1.2-1.2 3.1c0 1.8 1.3 3.6 1.5 3.8s2.6 4 6.3 5.3c.9.4 1.5.3 1.9.2s2.2-.9 2.5-1.7c.3-.8.3-1.5.2-1.7-.1-.2-.4-.3-.6-.4z" />
                  </svg>
                  Chia sẻ WhatsApp
                </Button> */}
                <TwitterShareButton
                  url={productUrl}
                  title={product.TenSP}
                  className="flex-1"
                >
                  {/* <Button
                    variant="outline"
                    size="lg"
                    className="w-full bg-transparent"
                  > */}
                  {/* X logo simple SVG */}
                  <div className="flex flex-row items-center justify-center border p-2 rounded-md">
                    {/* <TwitterIcon size={32} round /> */}
                    Chia sẻ Twitter
                  </div>
                </TwitterShareButton>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
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
            </div>
          </div>
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
                        <li>
                          Không sử dụng nước xả vải có mùi quá nồng để tránh ảnh
                          hưởng đến chất liệu.
                        </li>
                        <li>Ủi sản phẩm từ mặt trái để bảo vệ bề mặt vải.</li>
                        <li>Không để sản phẩm trong túi nilon kín quá lâu.</li>
                        <li>Giặt sản phẩm bằng dung dịch giặt nhẹ nhàng.</li>
                        <li>Không sử dụng máy sấy để làm khô sản phẩm.</li>
                        <li>
                          Tránh để sản phẩm tiếp xúc với dầu mỡ hoặc hóa chất.
                        </li>
                        <li>
                          Kiểm tra nhãn hướng dẫn giặt trước khi làm sạch sản
                          phẩm.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong tủ quần áo khô ráo, thoáng
                          mát.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc với lửa hoặc nhiệt độ cao.
                        </li>
                        <li>Giặt sản phẩm bằng tay để giữ độ bền lâu dài.</li>
                        <li>
                          Không sử dụng bàn chải cứng để chà xát sản phẩm.
                        </li>
                        <li>Phơi sản phẩm trên móc treo để giữ form dáng.</li>
                        <li>Tránh để sản phẩm tiếp xúc với hóa chất mạnh.</li>
                        <li>
                          Không giặt sản phẩm cùng các vật dụng có khóa kéo.
                        </li>
                        <li>
                          Ủi sản phẩm từ mặt trái để tránh làm hỏng bề mặt vải.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc trực tiếp với ánh nắng mặt
                          trời quá lâu.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong túi vải để tránh bụi bẩn.
                        </li>
                        <li>
                          Tránh giặt sản phẩm bằng nước nóng để bảo vệ chất
                          liệu.
                        </li>
                        <li>Không sử dụng máy sấy để làm khô sản phẩm.</li>
                        <li>Giặt sản phẩm bằng tay để giữ độ bền lâu dài.</li>
                        <li>
                          Không sử dụng bàn chải cứng để chà xát sản phẩm.
                        </li>
                        <li>Phơi sản phẩm trên móc treo để giữ form dáng.</li>
                        <li>Tránh để sản phẩm tiếp xúc với hóa chất mạnh.</li>
                        <li>
                          Không giặt sản phẩm cùng các vật dụng có khóa kéo.
                        </li>
                        <li>
                          Ủi sản phẩm từ mặt trái để tránh làm hỏng bề mặt vải.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc trực tiếp với ánh nắng mặt
                          trời quá lâu.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong túi vải để tránh bụi bẩn.
                        </li>
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
                        <li>
                          Không sử dụng nước xả vải có mùi quá nồng để tránh ảnh
                          hưởng đến chất liệu.
                        </li>
                        <li>Ủi sản phẩm từ mặt trái để bảo vệ bề mặt vải.</li>
                        <li>Không để sản phẩm trong túi nilon kín quá lâu.</li>
                        <li>Giặt sản phẩm bằng dung dịch giặt nhẹ nhàng.</li>
                        <li>Không sử dụng máy sấy để làm khô sản phẩm.</li>
                        <li>
                          Tránh để sản phẩm tiếp xúc với dầu mỡ hoặc hóa chất.
                        </li>
                        <li>
                          Kiểm tra nhãn hướng dẫn giặt trước khi làm sạch sản
                          phẩm.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong tủ quần áo khô ráo, thoáng
                          mát.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc với lửa hoặc nhiệt độ cao.
                        </li>
                        <li>Giặt sản phẩm bằng tay để giữ độ bền lâu dài.</li>
                        <li>
                          Không sử dụng bàn chải cứng để chà xát sản phẩm.
                        </li>
                        <li>Phơi sản phẩm trên móc treo để giữ form dáng.</li>
                        <li>Tránh để sản phẩm tiếp xúc với hóa chất mạnh.</li>
                        <li>
                          Không giặt sản phẩm cùng các vật dụng có khóa kéo.
                        </li>
                        <li>
                          Ủi sản phẩm từ mặt trái để tránh làm hỏng bề mặt vải.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc trực tiếp với ánh nắng mặt
                          trời quá lâu.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong túi vải để tránh bụi bẩn.
                        </li>
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
                        <li>
                          Không sử dụng nước xả vải có mùi quá nồng để tránh ảnh
                          hưởng đến chất liệu.
                        </li>
                        <li>Ủi sản phẩm từ mặt trái để bảo vệ bề mặt vải.</li>
                        <li>Không để sản phẩm trong túi nilon kín quá lâu.</li>
                        <li>Giặt sản phẩm bằng dung dịch giặt nhẹ nhàng.</li>
                        <li>Không sử dụng máy sấy để làm khô sản phẩm.</li>
                        <li>
                          Tránh để sản phẩm tiếp xúc với dầu mỡ hoặc hóa chất.
                        </li>
                        <li>
                          Kiểm tra nhãn hướng dẫn giặt trước khi làm sạch sản
                          phẩm.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong tủ quần áo khô ráo, thoáng
                          mát.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc với lửa hoặc nhiệt độ cao.
                        </li>
                        <li>Giặt sản phẩm bằng tay để giữ độ bền lâu dài.</li>
                        <li>
                          Không sử dụng bàn chải cứng để chà xát sản phẩm.
                        </li>
                        <li>Phơi sản phẩm trên móc treo để giữ form dáng.</li>
                        <li>Tránh để sản phẩm tiếp xúc với hóa chất mạnh.</li>
                        <li>
                          Không giặt sản phẩm cùng các vật dụng có khóa kéo.
                        </li>
                        <li>
                          Ủi sản phẩm từ mặt trái để tránh làm hỏng bề mặt vải.
                        </li>
                        <li>
                          Không để sản phẩm tiếp xúc trực tiếp với ánh nắng mặt
                          trời quá lâu.
                        </li>
                        <li>
                          Bảo quản sản phẩm trong túi vải để tránh bụi bẩn.
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.MaSP}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
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
              {/* {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full mb-4">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline ml-2">{error}</span>
              </div>
            )}
            <div className="flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-6">
                <ImageUploadCard
                  label="Portrait Image"
                  onImageChange={handlePortraitChange}
                  previewUrl={
                    portraitImage
                      ? `data:${portraitImage.mimeType};base64,${portraitImage.data}`
                      : null
                  }
                  disabled={isLoading}
                />
                <div className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <label className="text-lg font-semibold text-gray-700 mb-2">
                    Apparel Image
                  </label>
                  <img
                    src={"https:" + (product.HinhAnh[0] || "/placeholder.svg")}
                    alt="Apparel"
                    className="max-w-full h-auto rounded-md shadow-md object-contain max-h-40 md:max-h-56"
                  />
                </div>
              </div>
              <div className="flex sm:flex-row gap-4 justify-center w-full mt-2 mb-2">
                <button
                  onClick={generateCombinedImage}
                  disabled={!canGenerate}
                  className={`w-full sm:w-auto px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 flex items-center justify-center
              ${
                canGenerate
                  ? "bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:from-green-600 hover:to-teal-600 hover:shadow-xl"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate Combined Image"
                  )}
                </button>
                <button
                  onClick={resetApplication}
                  className="w-full sm:w-auto px-8 py-3 rounded-full text-lg font-bold bg-gray-200 text-gray-700 transition-colors duration-300 hover:bg-gray-300 flex items-center justify-center"
                  disabled={isLoading}
                >
                  Reset
                </button>
              </div>
              {generatedImage && (
                <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-lg w-full max-w-xl flex flex-col items-center">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">
                    Your AI Try-On Result
                  </h2>
                  <img
                    src={generatedImage}
                    alt="Combined AI Generated"
                    className="max-w-full h-auto rounded-lg shadow-xl object-contain border-4 border-blue-300"
                    style={{ maxHeight: "400px" }}
                  />
                  <a
                    href={generatedImage}
                    download="ai_tryon_result.png"
                    className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors duration-300"
                  >
                    Download Image
                  </a>
                </div>
              )}
            </div>*/}
            </div>
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Giới thiệu về FlexStyle</h2>
          <p>
            FlexStyle là thương hiệu thời trang hàng đầu, mang đến cho bạn những
            sản phẩm chất lượng cao với thiết kế hiện đại và phong cách. Chúng
            tôi luôn nỗ lực để đáp ứng mọi nhu cầu của khách hàng, từ chất liệu
            đến kiểu dáng.
          </p>
          <p>
            Với đội ngũ thiết kế chuyên nghiệp và quy trình sản xuất nghiêm
            ngặt, FlexStyle cam kết mang đến cho bạn những sản phẩm không chỉ
            đẹp mắt mà còn bền bỉ theo thời gian. Hãy để chúng tôi giúp bạn tự
            tin hơn trong mọi hoàn cảnh.
          </p>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Câu chuyện thương hiệu</h3>
            <p>
              FlexStyle được thành lập với sứ mệnh mang đến cho khách hàng những
              sản phẩm thời trang chất lượng cao, phù hợp với mọi phong cách và
              cá tính. Chúng tôi tự hào là thương hiệu thời trang hàng đầu, luôn
              đổi mới và sáng tạo để đáp ứng nhu cầu ngày càng cao của khách
              hàng.
            </p>
            <p>
              Với đội ngũ thiết kế tài năng và quy trình sản xuất hiện đại, mỗi
              sản phẩm của FlexStyle đều được chăm chút tỉ mỉ từ khâu ý tưởng
              đến khi hoàn thiện. Chúng tôi không chỉ mang đến những bộ trang
              phục đẹp mắt mà còn là sự kết hợp hoàn hảo giữa chất lượng và
              phong cách.
            </p>
            <p>
              FlexStyle luôn đặt khách hàng làm trung tâm trong mọi hoạt động.
              Chúng tôi lắng nghe ý kiến của bạn để không ngừng cải thiện và
              mang đến những trải nghiệm mua sắm tốt nhất. Hãy để FlexStyle đồng
              hành cùng bạn trên hành trình thể hiện phong cách riêng.
            </p>
            <h3 className="text-lg font-semibold">Cam kết của chúng tôi</h3>
            <p>
              Chúng tôi cam kết sử dụng các chất liệu thân thiện với môi trường
              và quy trình sản xuất bền vững. FlexStyle luôn hướng đến việc giảm
              thiểu tác động tiêu cực đến môi trường, đồng thời mang lại giá trị
              lâu dài cho cộng đồng.
            </p>
            <p>
              Mỗi sản phẩm đều được kiểm tra nghiêm ngặt trước khi đến tay khách
              hàng. Chúng tôi đảm bảo rằng bạn sẽ nhận được những sản phẩm hoàn
              hảo nhất, từ chất lượng đến thiết kế. Sự hài lòng của bạn là động
              lực để chúng tôi không ngừng phát triển.
            </p>
            <p>
              FlexStyle không chỉ là một thương hiệu thời trang, mà còn là người
              bạn đồng hành đáng tin cậy của bạn. Chúng tôi luôn sẵn sàng hỗ trợ
              và giải đáp mọi thắc mắc của bạn trong suốt quá trình mua sắm.
            </p>
            <h3 className="text-lg font-semibold">Tầm nhìn và giá trị</h3>
            <p>
              Tầm nhìn của FlexStyle là trở thành thương hiệu thời trang được
              yêu thích nhất, không chỉ tại Việt Nam mà còn trên toàn thế giới.
              Chúng tôi tin rằng thời trang không chỉ là quần áo, mà còn là cách
              bạn thể hiện bản thân và tạo dấu ấn riêng.
            </p>
            <p>
              Giá trị cốt lõi của chúng tôi bao gồm sự sáng tạo, chất lượng và
              sự tận tâm. Chúng tôi luôn nỗ lực để mang đến những sản phẩm độc
              đáo, chất lượng cao và dịch vụ khách hàng xuất sắc. FlexStyle tin
              rằng mỗi khách hàng đều xứng đáng nhận được những điều tốt đẹp
              nhất.
            </p>
            <p>
              Hãy cùng FlexStyle khám phá thế giới thời trang và tạo nên những
              khoảnh khắc đáng nhớ. Chúng tôi luôn đồng hành cùng bạn trên hành
              trình chinh phục mọi thử thách và tỏa sáng theo cách riêng của
              bạn.
            </p>
            <h3 className="text-lg font-semibold">Lý do chọn FlexStyle</h3>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>
                Chất lượng sản phẩm vượt trội, đảm bảo sự hài lòng tuyệt đối.
              </li>
              <li>Thiết kế đa dạng, phù hợp với mọi phong cách và cá tính.</li>
              <li>Giá cả hợp lý, mang lại giá trị cao cho khách hàng.</li>
              <li>Dịch vụ khách hàng tận tâm, luôn sẵn sàng hỗ trợ bạn.</li>
              <li>Cam kết bảo vệ môi trường và phát triển bền vững.</li>
              <li>
                Thương hiệu uy tín, được khách hàng tin tưởng và yêu thích.
              </li>
              <li>
                Chính sách đổi trả linh hoạt, mang lại sự an tâm khi mua sắm.
              </li>
              <li>
                Đội ngũ nhân viên chuyên nghiệp, thân thiện và nhiệt tình.
              </li>
              <li>Luôn cập nhật xu hướng thời trang mới nhất.</li>
              <li>Hỗ trợ giao hàng nhanh chóng và tiện lợi.</li>
            </ul>
            <h3 className="text-lg font-semibold">Cảm nhận từ khách hàng</h3>
            <p>
              Tôi rất hài lòng với sản phẩm của FlexStyle. Chất lượng tuyệt
              vời, thiết kế đẹp mắt và dịch vụ khách hàng rất chuyên nghiệp. Tôi
              chắc chắn sẽ tiếp tục ủng hộ thương hiệu này. - Khách hàng A.
            </p>
            <p>
              FlexStyle thực sự là một thương hiệu thời trang đáng tin cậy. Tôi
              rất ấn tượng với sự tận tâm và chu đáo của đội ngũ nhân viên. Sản
              phẩm không chỉ đẹp mà còn rất bền. - Khách hàng B.
            </p>
            <p>
              Tôi đã mua rất nhiều sản phẩm từ FlexStyle và chưa bao giờ thất
              vọng. Thời trang đẹp, giá cả hợp lý và dịch vụ tuyệt vời. Tôi rất
              khuyến khích mọi người thử trải nghiệm. - Khách hàng C.
            </p>
          </div>
          {/* Outfit Styling Tips */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold">Hướng dẫn phối đồ</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 list-disc list-inside text-muted-foreground mt-4">
              <li>Phối áo thun trắng với quần jeans xanh cơ bản.</li>
              <li>Kết hợp áo sơ mi kẻ caro với quần kaki tối màu.</li>
              <li>Áo hoodie oversize đi cùng quần jogger.</li>
              <li>Áo croptop phối với quần ống rộng.</li>
              <li>Áo blazer khoác ngoài áo thun đơn giản.</li>
              <li>Đầm midi kết hợp với giày sneaker trắng.</li>
              <li>Áo len cổ lọ với chân váy chữ A.</li>
              <li>Áo polo phối quần short kaki.</li>
              <li>Áo tanktop và quần jeans rách.</li>
              <li>Áo sơ mi trắng phối với chân váy đen cơ bản.</li>

              <li>Áo cardigan dài khoác ngoài váy liền.</li>
              <li>Áo bomber jacket với quần jeans skinny.</li>
              <li>Áo sweater và quần tây dáng suông.</li>
              <li>Đầm maxi kết hợp với sandal dây.</li>
              <li>Áo khoác da với quần jeans tối màu.</li>
              <li>Áo vest dáng rộng với quần ống loe.</li>
              <li>Áo croptop với quần short lưng cao.</li>
              <li>Áo sơ mi lụa với quần tây cao cấp.</li>
              <li>Áo hoodie với chân váy xếp ly.</li>
              <li>Áo thun in hình với quần cargo.</li>

              <li>Áo denim jacket với váy body.</li>
              <li>Áo phông form rộng phối quần legging.</li>
              <li>Áo khoác gió với quần thể thao.</li>
              <li>Áo sweater kẻ sọc với quần jean trắng.</li>
              <li>Áo len mỏng với chân váy ngắn.</li>
              <li>Áo blazer màu pastel với quần jean.</li>
              <li>Váy hoa vintage kết hợp mũ beret.</li>
              <li>Áo gile len với sơ mi trắng.</li>
              <li>Áo cổ yếm với quần culottes.</li>
              <li>Áo sát nách với chân váy midi.</li>

              <li>Áo bomber phối hoodie bên trong.</li>
              <li>Áo cardigan cài một nút với quần ống rộng.</li>
              <li>Áo sơ mi sọc xanh với quần trắng.</li>
              <li>Áo phao ngắn với quần skinny.</li>
              <li>Áo denim với quần denim tông chồng tông.</li>
              <li>Áo khoác trench coat cùng váy ôm.</li>
              <li>Áo cổ tim với quần tây màu be.</li>
              <li>Áo sweater in chữ và chân váy tennis.</li>
              <li>Áo polo form slim với quần jeans.</li>
              <li>Sơ mi đen với quần tây xám.</li>

              <li>Hoodie màu pastel với quần trắng.</li>
              <li>Áo blazer đen với áo cổ lọ trắng.</li>
              <li>Áo tanktop đen với quần jogger xám.</li>
              <li>Áo sơ mi sọc dọc với quần short jeans.</li>
              <li>Áo khoác bomber da lộn với quần jeans xanh.</li>
              <li>Áo thun xám với quần ống đứng.</li>
              <li>Áo sweater cổ tròn với quần baggy.</li>
              <li>Áo croptop ôm với quần legging.</li>
              <li>Áo khoác tweed với chân váy tweed đồng bộ.</li>
              <li>Áo thun form regular với quần chino.</li>

              <li>Áo hoodie đen với quần jeans xám.</li>
              <li>Áo phông trắng với chân váy denim.</li>
              <li>Áo len oversize với quần tây.</li>
              <li>Áo cardigan croptop với quần ống loe.</li>
              <li>Áo khoác varsity với quần jeans.</li>
              <li>Áo sơ mi linen với quần short.</li>
              <li>Váy suông tối màu với giày sneaker chunky.</li>
              <li>Áo phông graphic với quần baggy.</li>
              <li>Áo blazer beige với chân váy bút chì.</li>
              <li>Áo cổ vuông với quần jeans ống rộng.</li>

              <li>Áo hoodie beige với quần ống đứng nâu.</li>
              <li>Áo cardigan lửng với chân váy xếp ly dài.</li>
              <li>Áo sơ mi đen với chân váy da.</li>
              <li>Áo croptop thể thao với quần jogger.</li>
              <li>Áo khoác bomber ngắn với váy ôm dài.</li>
              <li>Áo sweater đỏ với quần jean đen.</li>
              <li>Áo blazer kẻ caro với quần tây đen.</li>
              <li>Áo sơ mi trắng oversize với quần short biker.</li>
              <li>Áo thun đen với quần jeans trắng.</li>
              <li>Áo croptop denim với chân váy denim.</li>

              <li>Áo cardigan dáng dài với quần skinny.</li>
              <li>Váy liền họa tiết với áo khoác jean.</li>
              <li>Áo polo rộng với quần jogger.</li>
              <li>Áo len cổ lọ với quần jeans mom.</li>
              <li>Áo blazer đen với váy midi.</li>
              <li>Áo sweater pastel với chân váy lụa.</li>
              <li>Áo khoác bomber xanh olive với quần kaki.</li>
              <li>Áo sơ mi basic với quần baggy đen.</li>
              <li>Áo hoodie trắng với quần jeans xanh nhạt.</li>
              <li>Áo phông vintage với quần ống suông.</li>

              <li>Áo dệt kim ôm với chân váy ngắn chữ A.</li>
              <li>Áo khoác gile phao với hoodie bên trong.</li>
              <li>Áo blazer pastel với váy body ngắn.</li>
              <li>Áo sweater cổ lọ với chân váy da.</li>
              <li>Áo thun cổ tim với quần short vải.</li>
              <li>Áo cardigan họa tiết với quần jeans đơn giản.</li>
              <li>Áo sơ mi denim với quần linen.</li>
              <li>Áo khoác len dày với váy maxi.</li>
              <li>Áo croptop trắng với quần ống rộng kem.</li>
              <li>Áo polo đen với quần tây trắng.</li>
              <li>Áo blazer dáng dài với quần jean rách nhẹ.</li>
              <li>Áo hoodie tím pastel cùng quần trắng ống suông.</li>
              <li>Áo gile dệt kim với váy xếp ly dài.</li>
              <li>Áo cổ lọ mỏng với áo khoác da ngoài.</li>
              <li>Áo tanktop trắng với quần jeans xanh đậm.</li>
              <li>Áo sơ mi họa tiết nhỏ với quần tây đen.</li>
              <li>Áo len mỏng form rộng với quần short kaki.</li>
              <li>Áo phông vintage với chân váy midi hoa.</li>
              <li>Áo khoác dù với quần jean skinny.</li>
              <li>Áo polo pastel với quần baggy jean.</li>

              <li>Áo sơ mi linen trắng với chân váy kaki.</li>
              <li>Áo khoác bomber kẻ với quần tây xám.</li>
              <li>Áo vest lửng với quần jean cạp cao.</li>
              <li>Áo croptop ren với chân váy ôm.</li>
              <li>Áo thun đen đơn giản với chân váy xếp ly ngắn.</li>
              <li>Áo sơ mi cổ nơ với váy midi.</li>
              <li>Áo cardigan basic với quần jean tối màu.</li>
              <li>Áo khoác tweed sáng màu với quần ống đứng.</li>
              <li>Áo len cổ tròn với quần short jeans.</li>
              <li>Áo thun kẻ ngang với quần chinos be.</li>

              <li>Áo hoodie xanh rêu với quần jogger đen.</li>
              <li>Áo blazer xanh navy với áo thun bên trong.</li>
              <li>Áo sơ mi cotton với quần short lưng cao.</li>
              <li>Áo sweater dày với quần jean trắng ống đứng.</li>
              <li>Áo phông trơn với váy bút chì.</li>
              <li>Áo croptop nhung với quần da.</li>
              <li>Áo cổ vuông với chân váy hoa vintage.</li>
              <li>Áo cardigan màu kem với quần linen trắng.</li>
              <li>Áo sơ mi caro đỏ với quần jean đen.</li>
              <li>Áo khoác phao dài với legging đen.</li>

              <li>Áo hoodie cam với quần jean xanh.</li>
              <li>Áo thun in chữ với quần tây suông.</li>
              <li>Áo blazer sọc dọc với váy ôm dài.</li>
              <li>Áo len họa tiết với quần jean baggy.</li>
              <li>Áo khoác denim đen với váy xếp ly.</li>
              <li>Áo sơ mi cổ rộng với quần ống loe.</li>
              <li>Áo tanktop ôm với chân váy tennis.</li>
              <li>Áo polo trắng với quần kaki nâu.</li>
              <li>Áo khoác bomber đen với váy body.</li>
              <li>Áo cardigan mảnh với quần jeans bạc màu.</li>

              <li>Áo sweater kem với quần da đen.</li>
              <li>Áo thun cổ lọ với chân váy xòe.</li>
              <li>Áo blazer đen dài với quần jeans xanh nhạt.</li>
              <li>Áo hoodie xám với quần short thể thao.</li>
              <li>Áo cardigan dài với váy maxi boho.</li>
              <li>Áo phông xám với quần tây xanh navy.</li>
              <li>Áo sơ mi xanh pastel với quần jean trắng.</li>
              <li>Áo khoác varsity xanh với chân váy ngắn.</li>
              <li>Áo tanktop đen với quần short da.</li>
              <li>Áo len cổ lọ mỏng với quần jean đậm.</li>

              <li>Áo sơ mi denim đen với quần jogger.</li>
              <li>Áo blazer hồng pastel với quần trắng.</li>
              <li>Áo khoác gió xám với chân váy chữ A.</li>
              <li>Áo sweater croptop với quần ống loe.</li>
              <li>Áo thun họa tiết với quần culottes.</li>
              <li>Áo cardigan dệt kim với váy midi xếp ly.</li>
              <li>Áo hoodie graphic với quần jeans sáng.</li>
              <li>Áo sơ mi lụa đen với quần suông trắng.</li>
              <li>Áo tanktop pastel với chân váy hoa.</li>
              <li>Áo blazer dày với quần baggy đen.</li>

              <li>Áo phông pastel với quần jean rách gối.</li>
              <li>Áo cardigan xanh biển với váy suông.</li>
              <li>Áo khoác phao ngắn với váy midi ôm.</li>
              <li>Áo croptop cotton với quần wide leg.</li>
              <li>Áo sơ mi cổ tròn với chân váy maxi.</li>
              <li>Áo hoodie đỏ với quần thể thao xám.</li>
              <li>Áo sweater màu be với quần jeans đen.</li>
              <li>Áo blazer caro với váy midi.</li>
              <li>Áo polo đen với quần jean xanh đậm.</li>
              <li>Áo cardigan đen với chân váy da.</li>

              <li>Áo len oversize với quần legging da.</li>
              <li>Áo sơ mi ngắn tay với quần short jean.</li>
              <li>Áo thun ôm với váy xòe ngắn.</li>
              <li>Áo khoác da nâu với quần jean xanh.</li>
              <li>Áo cardigan croptop với váy mini.</li>
              <li>Áo hoodie basic với quần ống đứng.</li>
              <li>Áo blazer béo với quần short lưng cao.</li>
              <li>Áo phông vải dày với quần tây ống rộng.</li>
              <li>Áo sơ mi caro xanh với váy midi đen.</li>
              <li>Áo sweater trắng với quần jean loe.</li>

              <li>Áo khoác dạ dài với váy ôm body.</li>
              <li>Áo len cổ lọ với quần kaki nâu.</li>
              <li>Áo cardigan dài mỏng với váy hoa.</li>
              <li>Áo blazer pastel với quần jean rách.</li>
              <li>Áo sơ mi ren với váy xếp pli.</li>
              <li>Áo hoodie navy với quần jean xám.</li>
              <li>Áo cardigan basic với quần da đen.</li>
              <li>Áo tanktop basic với quần jogger.</li>
              <li>Áo sweater màu xanh lá với quần đen.</li>
              <li>Áo thun trắng form rộng với chân váy midi.</li>

              <li>Áo vest đen với quần skinny đen.</li>
              <li>Áo cardigan gile với sơ mi trắng.</li>
              <li>Áo blazer trắng với quần trắng.</li>
              <li>Áo len tím với quần jean lửng.</li>
              <li>Áo khoác dù đen với legging.</li>
              <li>Áo phông họa tiết retro với quần ống rộng.</li>
              <li>Áo sơ mi xanh navy với chân váy trắng.</li>
              <li>Áo len mỏng pastel với quần kaki sáng.</li>
              <li>Áo blazer cao cấp với quần jean tối.</li>
              <li>Áo hoodie oversize với chân váy mini.</li>

              <li>Áo corset với quần jean cạp cao.</li>
              <li>Áo sweater croptop với chân váy tennis.</li>
              <li>Áo cardigan cổ tim với quần jean trắng.</li>
              <li>Áo sơ mi hoa nhí với quần linen.</li>
              <li>Áo blazer dáng ngắn với váy midi ôm.</li>
              <li>Áo hoodie đen với váy da ngắn.</li>
              <li>Áo dệt kim form ôm với quần culottes.</li>
              <li>Áo phông đen với quần short trắng.</li>
              <li>Áo blazer cam với quần jean be.</li>
              <li>Áo sơ mi pastel với chân váy bút chì.</li>

              <li>Áo sweater vặn thừng với quần jean sáng.</li>
              <li>Áo cardigan trắng với váy midi hoa.</li>
              <li>Áo tanktop cam với quần jean loe.</li>
              <li>Áo blazer nâu với quần tây be.</li>
              <li>Áo hoodie xanh lá pastel với quần trắng.</li>
              <li>Áo sơ mi denim sáng với chân váy đen.</li>
              <li>Áo cardigan đen croptop với quần jean đen.</li>
              <li>Áo khoác gió pastel với quần jogger trắng.</li>
              <li>Áo sweater graphite với váy midi.</li>
              <li>Áo vải thô cổ vuông với quần jean ống rộng.</li>

              <li>Áo polo màu kem với quần da nâu.</li>
              <li>Áo blazer lửng với quần short jean.</li>
              <li>Áo cardigan dài len mỏng với quần kaki.</li>
              <li>Áo sơ mi trắng form rộng với váy xếp ly dài.</li>
              <li>Áo tanktop lụa với quần baggy.</li>
              <li>Áo hoodie vintage với quần jean wash.</li>
              <li>Áo sweater đen với quần jean xám nhạt.</li>
              <li>Áo blazer ánh kim với váy body.</li>
              <li>Áo cardigan pastel với chân váy xòe.</li>
              <li>Áo phông trắng kết hợp quần jean đen basic.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
