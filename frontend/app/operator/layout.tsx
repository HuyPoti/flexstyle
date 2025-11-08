"use client";

import type React from "react";

import ProtectedRoute from "@/components/protected-route";
import Sidebar from "@/components/common/sidebar";
import Header from "@/components/common/header";
import { TicketPlus, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ProtectedRoute Role={"NVVH"}>
      <div className="flex h-screen bg-background">
        <Sidebar title="Nhân viên vận hành" items={[
          { title: "Quản lý voucher", href: "/operator", icon: TicketPlus },
          { title: "Quản lý sự kiện ưu đãi", href: "/operator/promotion", icon: Gift },
        ]} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header titleMap={{ 
            "/operator/voucher": "Quản lý voucher",
            "/operator/promotion": "Quản lý sự kiện ưu đãi",
          }} showNotifications={false} onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
