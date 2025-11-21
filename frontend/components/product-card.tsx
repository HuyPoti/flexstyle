"use client";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/help";
import { useRouter } from "next/navigation";
import { useSuKienUuDai } from "@/contexts/sukienuudai-context";
import { normalizeImageUrl } from "@/utils/image-utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { suKienUuDais } = useSuKienUuDai();
  const router = useRouter();

  const discountPercentage = product.GiaBan
    ? Math.round(((product.GiaBan - product.GiaBan) / product.GiaBan) * 100)
    : 0;
  const handleClick = () => {
    router.push(`/products/${product.slug}`);
  };

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        {product.CHITIETSANPHAM?.reduce(
          (acc, item) => acc + item.SoLuong,
          0
        ) ? (
          <Link href={`/products/${product.slug}`}>
            <Image
              src={
                product.HinhAnh && product.HinhAnh.length > 0
                  ? normalizeImageUrl(product.HinhAnh[0]) || "/placeholder.svg"
                  : "/placeholder.svg"
              }
              alt={product.TenSP}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={true}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-0 left-0 right-0  p-4">
              {suKienUuDais?.PhanTramGiam > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  Giảm {suKienUuDais?.PhanTramGiam}%
                </Badge>
              )}
            </div>
          </Link>
        ) : (
          <div className="pointer-events-none">
            <Image
              src={
                product.HinhAnh && product.HinhAnh.length > 0
                  ? normalizeImageUrl(product.HinhAnh[0]) || "/placeholder.svg"
                  : "/placeholder.svg"
              }
              alt={product.TenSP}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={true}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}
        {!product.CHITIETSANPHAM?.reduce(
          (acc, item) => acc + item.SoLuong,
          0
        ) && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Hết hàng
          </Badge>
        )}
      </div>

      <CardContent className="p-4" onClick={handleClick}>
        <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
          {product.TenSP}
        </h3>

        <div className="flex items-center space-x-2 mb-3">
          <span className="font-bold text-primary">
            {formatPrice(
              product.GiaBan -
                ((suKienUuDais?.PhanTramGiam || 0) / 100) * product.GiaBan
            )}
          </span>
          {suKienUuDais && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.GiaBan)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
