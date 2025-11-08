"use client";

import type React from "react";

import ProtectedRoute from "@/components/protected-route";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import { TriangleAlert } from "lucide-react";

export default function CusLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute Role={"NVCSKH"}>
      <div className="flex h-screen bg-background">
        <Sidebar title="Nhân viên chăm sóc khách hàng" items={[
          { title: "Quản lý đơn hàng", href: "/customer-service", icon: TriangleAlert },
        ]} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header titleMap={{ "/customer-service/order-management": "Quản lý đơn hàng" }} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
