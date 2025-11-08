"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "react-toastify";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { resetPasswordForEmail } = useAuth();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const load = await resetPasswordForEmail(email);
    if (load) {
      toast.success("Email đã được gửi!");
      setSuccess(true);
    } else {
      toast.error("Có lỗi xảy ra!");
    }
    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Kiểm tra email
              {/* Check Your Email */}
            </CardTitle>
            <CardDescription className="text-slate-400">
              Yêu cầu thay đổi mật khẩu đã được gửi đi
              {/* Password reset instructions sent */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {/* If you registered using your email and password, you will receive
              a password reset email. */}
              Nếu bạn đã có tài khoản, bạn sẽ nhận được email thông báo
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              {"auth.resetPassword"}
            </CardTitle>
            <CardDescription>
              Nhập email của bạn để xác minh. Chúng tôi sẽ gửi bạn link thay đổi
              mật khẩu
              {/* Type in your email and we&apos;ll send you a link to reset your
              password */}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Gửi email xác nhận"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t("auth.subResetPassword")}{" "}
                <Link
                  href="/auth/login"
                  className="text-sm text-primary hover:underline"
                >
                  {t("auth.login")}
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
