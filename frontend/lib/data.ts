import type { Product } from "./types";
import { products } from "../data/products";

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.TenSP === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((product) => product.category === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.TenSP.toLowerCase().includes(lowercaseQuery) ||
      product.TenSP.toLowerCase().includes(lowercaseQuery)
  );
}
import type { Order } from "./types";

// Sample order data
const sampleOrders: Order[] = [
  {
    id: "ORD-2024-001",
    userId: "user-1",
    items: [
      {
        id: "item-1",
        productId: "ao-thun-nam-1",
        name: "Áo thun nam basic",
        price: 299000,
        image: "/men-s-basic-t-shirt.jpg",
        size: "L",
        color: "Đen",
        quantity: 2,
      },
      {
        id: "item-2",
        productId: "quan-jean-nam-1",
        name: "Quần jean nam slim fit",
        price: 599000,
        image: "/men-s-slim-fit-jeans.jpg",
        size: "32",
        color: "Xanh đậm",
        quantity: 1,
      },
    ],
    total: 1197000,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Phường XYZ",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
  },
  {
    id: "ORD-2024-002",
    userId: "user-1",
    items: [
      {
        id: "item-3",
        productId: "ao-khoac-nu-1",
        name: "Áo khoác nữ dáng suông",
        price: 799000,
        image: "/women-s-oversized-jacket.jpg",
        size: "M",
        color: "Be",
        quantity: 1,
      },
    ],
    total: 829000,
    status: "shipped",
    createdAt: "2024-01-20T14:15:00Z",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Phường XYZ",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
  },
  {
    id: "ORD-2024-003",
    userId: "user-1",
    items: [
      {
        id: "item-4",
        productId: "giay-sneaker-1",
        name: "Giày sneaker unisex",
        price: 899000,
        image: "/unisex-sneakers.jpg",
        size: "42",
        color: "Trắng",
        quantity: 1,
      },
      {
        id: "item-5",
        productId: "tui-xach-nu-1",
        name: "Túi xách nữ da thật",
        price: 1299000,
        image: "/women-s-leather-handbag.jpg",
        size: "One Size",
        color: "Nâu",
        quantity: 1,
      },
    ],
    total: 2228000,
    status: "processing",
    createdAt: "2024-01-25T09:45:00Z",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Phường XYZ",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
  },
  {
    id: "ORD-2024-004",
    userId: "user-1",
    items: [
      {
        id: "item-6",
        productId: "ao-so-mi-nam-1",
        name: "Áo sơ mi nam công sở",
        price: 499000,
        image: "/men-s-dress-shirt.jpg",
        size: "L",
        color: "Trắng",
        quantity: 2,
      },
    ],
    total: 1028000,
    status: "pending",
    createdAt: "2024-01-28T16:20:00Z",
    shippingAddress: {
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường ABC, Phường XYZ",
      city: "TP. Hồ Chí Minh",
      district: "Quận 1",
      ward: "Phường Bến Nghé",
    },
  },
];

export function getUserOrders(userId: string): Order[] {
  return sampleOrders.filter((order) => order.userId === userId);
}

export function getOrderById(orderId: string): Order | undefined {
  return sampleOrders.find((order) => order.id === orderId);
}

export function getRecentOrders(userId: string, limit = 3): Order[] {
  return getUserOrders(userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);
}
