"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X, Save } from "lucide-react";
import StaffMember from "@/interfaces/staffMember";

type StaffPopupProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: StaffMember | undefined) => void;
  errorMsg: string;
  setErrorMsg: (msg: string) => void;
  initialData?: StaffMember | null;
};
const staffRoles = {
  "Nhân viên CSKH": "NVCSKH",
  "Nhân viên vận hành": "NVVH",
};
const staffRolesReverse = {
  NVCSKH: "Nhân viên CSKH",
  NVVH: "Nhân viên vận hành",
};
// Popup component for adding/editing staff members
export default function StaffPopup({
  open,
  onClose,
  onSave,
  errorMsg,
  setErrorMsg,
  initialData,
}: StaffPopupProps) {
  const [form, setForm] = useState<StaffMember>({
    MaTK: "",
    DisplayName: "",
    Email: "",
    Status: "ACTIVE",
    Username: "",
    VAITRO: staffRoles["Nhân viên CSKH"],
    updated_at: new Date().toISOString(),
  });
  const [ConfirmPassword, setConfirmPassword] = useState<string>("");

  const handleChange = (field: string, value: string | boolean) => {
    setErrorMsg(""); // Clear error message on input change
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    if (!form.DisplayName || !form.Email || !form.VAITRO) {
      setErrorMsg("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    if (form.Password && form.Password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (form.Password !== ConfirmPassword) {
      setErrorMsg("Mật khẩu và xác nhận mật khẩu không khớp.");
      return;
    }
    if (form.Email.indexOf("@") === -1 || form.Email.indexOf(".") === -1) {
      setErrorMsg("Email không hợp lệ.");
      return;
    }

    console.log("Submitting form:", form);
    onSave(form);
    onClose();
  };

  useEffect(() => {
    if (open && initialData) {
      setForm(initialData);
    } else if (open && !initialData) {
      // Reset form when opening for new staff
      setForm({
        MaTK: "",
        DisplayName: "",
        Email: "",
        Status: "ACTIVE",
        Username: "",
        VAITRO: staffRoles["Nhân viên CSKH"],
        updated_at: new Date().toISOString(),
      });
      setConfirmPassword("");
      setErrorMsg("");
    }
  }, [open, initialData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {initialData ? "Chỉnh sửa nhân viên" : "Thêm nhân viên"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="col-span-2">
            <Label className="text-sm">Họ và tên</Label>
            <Input
              value={form.DisplayName}
              className="w-full"
              onChange={(e) => handleChange("DisplayName", e.target.value)}
              placeholder="Họ và tên"
            />
          </div>

          <div className="col-span-2">
            <Label className="text-sm">Email</Label>
            <Input
              value={form.Email}
              onChange={(e) => handleChange("Email", e.target.value)}
              placeholder="Email"
            />
          </div>

          <div>
            <Label className="text-sm">Mật khẩu</Label>
            <Input
              value={form.Password ?? ""}
              onChange={(e) => handleChange("Password", e.target.value)}
              placeholder="Mật khẩu"
              type="password"
            />
          </div>

          <div>
            <Label className="text-sm">Nhập lại mật khẩu</Label>
            <Input
              placeholder="Nhập lại mật khẩu"
              type="password"
              value={ConfirmPassword}
              onChange={(e) => {
                setErrorMsg("");
                setConfirmPassword(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Select
            value={
              staffRolesReverse[form.VAITRO as keyof typeof staffRolesReverse]
            }
            onValueChange={(v: keyof typeof staffRoles) =>
              handleChange("VAITRO", staffRoles[v])
            }
          >
            <SelectTrigger className="w-full bg-[#8B5CF6] text-white [&_svg]:!text-white [&_svg]:!opacity-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nhân viên CSKH">Nhân viên CSKH</SelectItem>
              <SelectItem value="Nhân viên vận hành">
                Nhân viên vận hành
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={form.Status}
            onValueChange={(v) => handleChange("Status", v)}
          >
            <SelectTrigger className="w-full bg-[#8B5CF6] text-white [&_svg]:!text-white [&_svg]:!opacity-100">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Display Error message */}
        {errorMsg && (
          <p className="text-red-500 text-sm mt-3 text-center animate-fadeIn">
            {errorMsg}
          </p>
        )}

        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            className="hover:bg-red-500 flex items-center gap-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
            Hủy
          </Button>
          <Button
            className="bg-[#8B5CF6] text-white flex items-center gap-2"
            onClick={handleSubmit}
          >
            <Save className="w-4 h-4" />
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
