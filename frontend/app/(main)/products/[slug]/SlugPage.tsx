
"use client";

import { useState } from "react";
// import { useCallback } from "react";
// import { ImagePart, UploadedImage } from "@/lib/types";
// import { fileToBase64, getMimeTypeFromBase64 } from "@/utils/image-utils";
import Image from "next/image";
// import Head from "next/head";
import Link from "next/link";
import {
  Star,
  Share2,
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
  const frontendBase = process.env.NEXT_PUBLIC_FRONT_END || "https://flexstyle.vercel.app";
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
    } catch (err) {
      alert("Không thể sao chép liên kết. Vui lòng sao chép thủ công.");
    }
  };

  const shareWhatsApp = () => {
    const title = product.TenSP || "";
    const text = `${title}\n${productUrl}`.trim();
    const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(wa, "_blank");
  };

    // helper: mở popup căn giữa màn hình (desktop) hoặc new tab (mobile)
  const openCenteredPopup = (url: string, title = "Share", w = 600, h = 500) => {
    // mobile xử lý: nếu window.innerWidth nhỏ thì open bình thường
    if (window.innerWidth <= 640) {
      window.open(url, "_blank");
      return;
    }
    const left = window.screenX + (window.innerWidth - w) / 2;
    const top = window.screenY + (window.innerHeight - h) / 2;
    window.open(
      url,
      title,
      `toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=${w}, height=${h}, top=${top}, left=${left}`
    );
  };

  const shareToX = () => {
    const title = product.TenSP || "";
    // Text + URL. Bạn có thể thêm hashtags hoặc via nếu muốn:
    // e.g. const hashtags = "FlexStyle,ThoiTrang";
    // url: https://x.com/intent/tweet?text=...
    const text = `${title}\n${productUrl}`.trim();
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}`;
    openCenteredPopup(intentUrl, "Share on X", 600, 420);
  };


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

  return (
    <>
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
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={() =>
                    window.open(
                      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        `https://flexstyle.vercel.app/products/${product.slug}`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  <Share2 className="h-5 w-5 mr-2" />
                  Chia sẻ Facebook
                </Button>
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
                  onClick={shareWhatsApp}
                >
                  {/* small WhatsApp icon */}
                  <svg
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
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-transparent"
                  onClick={shareToX}
                >
                  {/* X logo simple SVG */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    className="mr-2"
                    fill="currentColor"
                  >
                    <path d="M20.5 3.5a8 8 0 01-2.3.6c.8-.5 1.4-1.2 1.6-2.1-.8.5-1.7.8-2.7 1-1.6-1.6-4.3-1.3-5.9.6-1 .9-1.4 2.1-1.1 3.3-3-.2-5.7-1.6-7.5-3.8-.9 1.6-.4 3.5 1 4.5-.7 0-1.4-.2-2-.5v.1c0 1.7 1.2 3.2 2.8 3.5-.6.2-1.3.2-1.9.1.5 1.6 2 2.8 3.7 2.8-1.6 1.2-3.6 1.9-5.6 1.9-.4 0-.8 0-1.1-.1 2 1.3 4.4 2 6.9 2 8.2 0 12.7-6.8 12.7-12.7v-.6c.9-.7 1.6-1.6 2.1-2.6-.9.4-1.9.7-2.9.8z" />
                  </svg>
                  Chia sẻ X
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
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">Giao hàng miễn phí</p>
                  <p className="text-xs text-muted-foreground">
                    Đơn hàng trên 500k
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
                        <p>• Giặt máy ở nhiệt độ dưới 30°C</p>
                        <p>• Không sử dụng chất tẩy</p>
                        <p>• Phơi nơi thoáng mát, tránh ánh nắng trực tiếp</p>
                        <p>• Ủi ở nhiệt độ thấp</p>
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
      </div>
    </>
  );
}
