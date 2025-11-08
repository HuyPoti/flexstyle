"use client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Edit, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { KhachHangUser } from "@/lib/types";

export default function AccountPage({
  taiKhoan,
  accessToken,
}: {
  taiKhoan: KhachHangUser;
  accessToken: string;
}) {
  const { isLoading, updatePassword } = useAuth();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    DisplayName: "",
    email: "",
  });

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (isLoading) {
      router.push("/auth/login");
    }
  }, [isLoading, router]);

  useEffect(() => {
    if (taiKhoan) {
      setFormData({
        Username: taiKhoan.Username ?? "",
        DisplayName: taiKhoan.DisplayName ?? "",
        email: taiKhoan.Email ?? "",
      });
    }
  }, [taiKhoan]);

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/update/${taiKhoan.MaTK}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            DisplayName: formData.DisplayName,
          }),
        }
      );
      const data = await res.json();
      const success = data.data;
      if (success) {
        toast.success("Cập nhật thành công!");
        setIsEditing(false);
      }
    } catch {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (taiKhoan) {
      setFormData({
        Username: taiKhoan.Username ?? "",
        DisplayName: taiKhoan.DisplayName ?? "",
        email: taiKhoan.Email ?? "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Đang tải...</div>
      </div>
    );
  }

  if (!taiKhoan) {
    return null;
  }

  const handleChangePassword = async () => {
    try {
      const success = await updatePassword(newPassword);
      if (success) {
        toast.success("Đổi mật khẩu thành công!");
        setShowChangePassword(false);
        setNewPassword("");
      } else {
        toast.error("Đổi mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer />
      {/* Modal đổi mật khẩu */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 shadow-2xl w-full max-w-md relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold z-10"
              onClick={() => setShowChangePassword(false)}
              aria-label="Đóng popup"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-6 text-center">Đổi mật khẩu</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">Mật khẩu mới</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="flex gap-4 mt-6">
                <Button
                  onClick={async () => {
                    handleChangePassword();
                  }}
                  className="w-full"
                >
                  Lưu
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tài khoản của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin cá nhân và cài đặt tài khoản
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="settings">Cài đặt</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin cá nhân của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} disabled={isUpdating}>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  {taiKhoan.Avatar ? (
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={taiKhoan?.Avatar || "/placeholder.svg"}
                        alt={taiKhoan.Email ?? ""}
                      />
                      {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
                      <AvatarFallback>
                        {taiKhoan.Email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-red-500 flex items-center justify-center">
                      <span className="text-3xl text-white">
                        {taiKhoan.Email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {taiKhoan.DisplayName}
                    </h3>
                    <p className="text-muted-foreground">{taiKhoan.Email}</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Username</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="name"
                        value={formData.Username}
                        onChange={(e) =>
                          setFormData({ ...formData, Username: e.target.value })
                        }
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={true}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="name"
                        value={formData.DisplayName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            DisplayName: e.target.value,
                          })
                        }
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="phone"
                        // value={formData.phone}
                        // onChange={(e) =>
                        //   setFormData({ ...formData, phone: e.target.value })
                        // }
                        disabled={true}
                        className="pl-10"
                        placeholder="Hệ thống chưa cập nhật thông tin này"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        id="address"
                        // value={formData.address}
                        // onChange={(e) =>
                        //   setFormData({ ...formData, address: e.target.value })
                        // }
                        disabled={true}
                        className="pl-10"
                        placeholder="Hệ thống chưa cập nhật thông tin này"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng của tôi</CardTitle>
                <CardDescription>
                  Xem lịch sử đơn hàng và trạng thái giao hàng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Bạn chưa có đơn hàng nào
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/products">Bắt đầu mua sắm</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt tài khoản</CardTitle>
                <CardDescription>
                  Quản lý cài đặt bảo mật và thông báo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 ">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-semibold ">Đổi mật khẩu</h4>
                    <p className="text-sm text-muted-foreground ">
                      Cập nhật mật khẩu để bảo mật tài khoản
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowChangePassword(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                </div>

                {/* <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Thông báo email</h4>
                    <p className="text-sm text-muted-foreground">
                      Nhận thông báo về đơn hàng và khuyến mãi
                    </p>
                  </div>
                  <Button variant="outline">Cài đặt</Button>
                </div> */}

                {/* <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">Xóa tài khoản</h4>
                    <p className="text-sm text-muted-foreground">
                      Xóa vĩnh viễn tài khoản và dữ liệu
                    </p>
                  </div>
                  <Button variant="destructive">Xóa tài khoản</Button>
                </div> */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
