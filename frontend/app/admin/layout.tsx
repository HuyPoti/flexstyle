"use client";

import type React from "react";
import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import ProtectedRoute from "@/components/protected-route";
import { NotebookTabs, Truck } from "lucide-react";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const titleMap: Record<string, string> = {
    "/admin": "Quản lý chức vụ",
    "/admin/suppliers": "Quản lý nhà cung cấp",
  };

  return (
    <ProtectedRoute Role={"ADMIN"}>
      <div className="flex h-screen bg-background">
        <Sidebar
          title="Quản lý doanh nghiệp"
          items={[
            {
              title: "Quản lý chức vụ",
              href: "/admin",
              icon: NotebookTabs,
            },
            {
              title: "Quản lý nhà cung cấp",
              href: "/admin/suppliers",
              icon: Truck,
            },
          ]}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header titleMap={titleMap} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
