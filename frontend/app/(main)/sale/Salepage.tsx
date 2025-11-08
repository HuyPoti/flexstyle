"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Percent, Clock } from "lucide-react";
import { Product } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { useSuKienUuDai } from "@/contexts/sukienuudai-context";

export default function SalePage({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const { suKienUuDais } = useSuKienUuDai();
  const [products] = useState<Product[]>(initialProducts);
  const [sortBy, setSortBy] = useState<"discount" | "price" | "name">(
    "discount"
  );

  // Filter products on sale and add discount info
  const saleProducts = useMemo(() => {
    return products
      .filter((product) => product.GiaBan && suKienUuDais?.PhanTramGiam > 0)
      .map((product) => ({
        ...product,
        discount: suKienUuDais?.PhanTramGiam || 0,
      }))
      .sort((a, b) => {
        switch (sortBy) {
          case "discount":
            return b.discount - a.discount;
          case "price":
            return a.GiaBan - b.GiaBan;
          case "name":
            return a.TenSP.localeCompare(b.TenSP);
          default:
            return 0;
        }
      });
  }, [sortBy, products, suKienUuDais]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full mb-4">
          <Percent className="h-4 w-4" />
          <span className="font-medium">KHUYẾN MÃI LỚN</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          SALE UP TO <span className="text-destructive">70%</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-6">
          Cơ hội vàng sở hữu những món đồ thời trang yêu thích với giá ưu đãi
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Thời gian có hạn - Nhanh tay kẻo lỡ!</span>
        </div>
      </div>

      {/* Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Sản phẩm khuyến mãi</h2>
          <p className="text-muted-foreground">
            {saleProducts.length} sản phẩm đang được giảm giá
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "discount" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("discount")}
          >
            Giảm nhiều nhất
          </Button>
          <Button
            variant={sortBy === "price" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("price")}
          >
            Giá thấp nhất
          </Button>
          <Button
            variant={sortBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setSortBy("name")}
          >
            Tên A-Z
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {saleProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {saleProducts.map((product) => (
            <div key={uuidv4()} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">
            Hiện tại không có sản phẩm nào đang sale
          </h3>
          <p className="text-muted-foreground mb-6">
            Hãy quay lại sau để không bỏ lỡ những ưu đãi hấp dẫn!
          </p>
          <Button asChild>
            <Link href="/products">Xem tất cả sản phẩm</Link>
          </Button>
        </div>
      )}

      {/* Newsletter Section */}
      <Separator className="my-12" />
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-4">Đừng bỏ lỡ ưu đãi!</h3>
        <p className="text-muted-foreground mb-6">
          Đăng ký nhận thông báo về các chương trình khuyến mãi mới nhất
        </p>
        <div className="flex max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Nhập email của bạn"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <Button>Đăng ký</Button>
        </div>
      </div>
    </div>
  );
}
