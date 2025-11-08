"use client";

import type React from "react";

import ProtectedRoute from "@/components/protected-route";
import { SupplierHeader } from "@/components/supplier/supplier-header";
import { SupplierSidebar } from "@/components/supplier/supplier-sidebar";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute Role={"NCC"}>
      <div className="flex h-screen bg-background">
        <SupplierSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <SupplierHeader />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
