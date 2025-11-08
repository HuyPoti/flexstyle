"use client";

import React from "react";
import ProtectedRoute from "@/components/protected-route";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import { CategoryProvider } from "./context/CategoryContext";
import {
  Users,
  Package,
  SquareKanban,
  MessageSquare,
  UserSquare,
  Layers,
  PlusSquare,
  CheckSquare,
} from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const titleMap: Record<string, string> = {
    "/business": "Tổng quan doanh nghiệp",
    "/business/staff": "Quản lý nhân viên",
    "/business/products": "Quản lý sản phẩm",
    "/business/stats": "Thống kê",
    "/business/feedback": "Phản hồi người dùng",
    "/business/users": "Quản lý người dùng",
    "/business/categories": "Danh mục sản phẩm",
    "/business/create-stock-in": "Tạo phiếu nhập hàng",
    "/business/confirm-stock-in": "Xác nhận nhập hàng",
  };

  const sidebarItems = [
    { title: "Quản lý nhân viên", href: "/business/staff", icon: Users },
    { title: "Quản lý sản phẩm", href: "/business/products", icon: Package },
    { title: "Thống kê", href: "/business/stats", icon: SquareKanban },
    {
      title: "Phản hồi người dùng",
      href: "/business/feedback",
      icon: MessageSquare,
    },
    { title: "Quản lý người dùng", href: "/business/users", icon: UserSquare },
    { title: "Danh mục sản phẩm", href: "/business/categories", icon: Layers },
    {
      title: "Tạo phiếu nhập hàng",
      href: "/business/create-stock-in",
      icon: PlusSquare,
    },
    {
      title: "Xác nhận nhập hàng",
      href: "/business/confirm-stock-in",
      icon: CheckSquare,
    },
  ];

  return (
    <ProtectedRoute Role={"QLDN"}>
      <CategoryProvider>
        <div className="flex h-screen bg-background">
          <Sidebar title="Quản lý doanh nghiệp" items={sidebarItems} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header titleMap={titleMap} />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
        <ToastContainer />
      </CategoryProvider>
    </ProtectedRoute>
  );
}
