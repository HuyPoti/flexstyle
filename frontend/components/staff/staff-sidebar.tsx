"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Gift,
  Megaphone,
  BarChart3,
  Home,
  Settings,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/staff", icon: Home },
  { name: "Error Orders", href: "/staff/error-orders", icon: AlertTriangle },
  { name: "Promotions", href: "/staff/promotions", icon: Gift },
  { name: "Vouchers", href: "/staff/vouchers", icon: Gift },
  { name: "Notifications", href: "/staff/notifications", icon: Megaphone },
  { name: "Reports", href: "/staff/reports", icon: BarChart3 },
  { name: "Settings", href: "/staff/settings", icon: Settings },
];

export function StaffSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Staff Panel</h2>
        <p className="text-sm text-gray-500">Operations Dashboard</p>
      </div>
      <nav className="px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
