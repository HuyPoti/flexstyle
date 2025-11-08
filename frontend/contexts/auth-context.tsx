"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, UserRole } from "@/lib/types";
import { useRouter } from "next/navigation";
interface AuthState {
  user: User | null;
  isLoading: boolean;
}
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  OauthLogin: (provider: string) => void;
  logout: () => void;
  updatePassword: (password: string) => Promise<boolean>;
  resetPasswordForEmail: (email: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  // hasPermission: (permission: Permission) => boolean;
  // hasAnyPermission: (permissions: Permission[]) => boolean;
  // canAccessRoute: (route: string) => boolean;
  getUserRole: () => UserRole | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  // Load user from Supabase on mount and listen for auth changes
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email,
              user_metadata: session.user.user_metadata,
              last_sign_in_at: session.user.last_sign_in_at,
            },
            isLoading: false,
          });
          //thêm thông tin tài khoản vào db
        } else {
          setState({
            user: null,
            isLoading: false,
          });
        }
      }
    );
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<any> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error || !data.user) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: error };
      }

      setState({
        user: {
          id: data.user.id,
          email: data.user.email,
          user_metadata: data.user.user_metadata,
          last_sign_in_at: data.user.last_sign_in_at,
        },
        isLoading: false,
      });
      // console.log("sss",window.location.origin);
      // alert("Đăng nhập thành công");
      // router.push("/");
      return { success: true };
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return { success: false, error: error };
    }
  };
  const OauthLogin = async (provider: string) => {
    if (provider === "gg") {
      supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      console.log("Registering customer");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/dangky`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            DisplayName: name,
            Email: email,
            Username: email.split("@")[0],
            MatKhau: password,
            VAITRO: "KH",
            Status: "ACTIVE",
          }),
        }
      );
      console.log("Backend registration response:", response);
      const json = await response.json();
      console.log("Backend registration JSON:", json);
      const user = json.data;
      if (!response.ok) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return false;
      }
      setState({
        user: user,
        isLoading: false,
      });
      return true;
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      console.error("Registration error:", error);
      return false;
    }
  };

  const logout = async () => {
    const userId = state.user?.id;
    const itemCart = localStorage.getItem("cart");
    if (userId && itemCart) {
      const parsedCart = JSON.parse(itemCart);
      const mapperItem = parsedCart.map((item: any) => ({
        MaCTSP: item.productId,
        SoLuong: item.quantity,
        KichCo: item.size,
      }));
      // 2. Gọi API lưu giỏ hàng
      await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/giohang/update-cart?MaTKKH=${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mapperItem),
          keepalive: true,
        }
      );
    }
    localStorage.setItem("cart", JSON.stringify([]));
    await supabase.auth.signOut();
    setState({
      user: null,
      isLoading: false,
    });
    router.push("/auth/login");
  };
  const updatePassword = async (password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        return false;
      }
      return true;
    } catch {
      // console.error("Update password error:", e);
      return false;
    }
  };
  const resetPasswordForEmail = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };
  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!state.user) return false;
      // Supabase profile update (example: update user metadata)
      const { error } = await supabase.auth.updateUser({ data });
      if (error) return false;
      // Reload user
      const { data: userData } = await supabase.auth.getUser();
      setState({
        user: userData?.user || null,
        isLoading: false,
      });
      return true;
    } catch {
      return false;
    }
  };

  // Permission checking methods (tùy chỉnh lại nếu dùng metadata Supabase)
  // const checkPermission = (_permission: Permission): boolean => {
  //   // Implement permission logic if you store permissions in user metadata
  //   return true;
  // };

  // const checkAnyPermission = (_permissions: Permission[]): boolean => {
  //   return true;
  // };

  // const checkCanAccessRoute = (_route: string): boolean => {
  //   return true;
  // };

  const getUserRole = (): UserRole | null => {
    // Nếu lưu role trong user metadata, lấy từ user.user_metadata.role
    // return state.user?.user_metadata?.role || null;
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        OauthLogin,
        logout,
        updatePassword,
        resetPasswordForEmail,
        updateProfile,
        // hasPermission: checkPermission,
        // hasAnyPermission: checkAnyPermission,
        // canAccessRoute: checkCanAccessRoute,
        getUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
