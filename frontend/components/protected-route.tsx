"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { createClient } from "@/lib/supabase/client";
import { getRoleLink } from "@/lib/help";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  Role?: string;
  allowGuest?: boolean;
}
export default function ProtectedRoute({
  children,
  Role,
  allowGuest = false,
}: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        console.log("Checking authentication...");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          if (allowGuest) {
            setAuthorized(true);
            return;
          }
          setAuthorized(false);
          return;
        }

        const user = session.user;
        console.log("Authenticated user:", user);
        const accessToken = session.access_token;

        // Fetch user info from backend
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/${user.id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const role = res.data.data.VAITRO;
        console.log("User role from backend:", role);
        // Allow if not in blockedRoles
        if (Role === role) {
          setAuthorized(true);
        } else {
          try {
            console.log("Redirecting based on role:", role);
            const target = getRoleLink(role);

            router.replace(target);
          } catch {
            router.replace("/unauthorized");
          }
        }
      } catch (err) {
        if (allowGuest) {
          setAuthorized(true);
          console.log("Allowing guest access");
          return;
        }
        console.error("Error verifying access:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, Role, supabase, user, allowGuest]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary" />
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
