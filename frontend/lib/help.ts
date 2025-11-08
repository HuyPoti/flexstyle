import type { Product } from "./types";

export function getProductBySlug(slug: string): Product | undefined {
  const tenSP = decodeURIComponent(slug);
  return sessionStorage.getItem("selectedProduct") == tenSP
    ? JSON.parse(sessionStorage.getItem("selectedProduct") || "")
    : undefined;
}
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}
export const ROLE_LINKS = {
  QLDN: "/business",
  NVVH: "/operator",
  NVCSKH: "/customer-service",
  NCC: "/supplier",
  ADMIN: "/admin",
} as const;

export function getRoleLink(role?: string) {
  return ROLE_LINKS[role as keyof typeof ROLE_LINKS] ?? "/";
}
