"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth();

  const logOut = async () => {
    router.push("/auth/login");
    await logout();
  };

  return <Button onClick={logOut}>Logout</Button>;
}
