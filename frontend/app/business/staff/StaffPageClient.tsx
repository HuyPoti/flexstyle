"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import StaffTable from "@/components/business/StaffTable";
import { Button } from "@/components/ui/button";
import StaffPopup from "@/components/business/StaffPopup";
import { useEffect, useState } from "react";
import axios from "axios";
import StaffMember from "@/interfaces/staffMember";

export default function StaffPageClient({
  staffData,
  access_token,
}: {
  staffData: StaffMember[];
  access_token: string;
}) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Save handler
  const handleSave = async (data: StaffMember | undefined) => {
    if (!data) return;

    if (editing) {
      // Editing existing staff
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/nv/${data.MaTK}`,
          {
            DisplayName: data.DisplayName,
            Email: data.Email,
            Username: data.Email.split("@")[0],
            VAITRO: data.VAITRO,
            Status: data.Status,
            MatKhau: data.Password,
          },
          { headers: { Authorization: `Bearer ${access_token}` } }
        );

        setStaff((prev) =>
          prev.map((p) => (p.MaTK === data.MaTK ? { ...p, ...data } : p))
        );
      } catch (error) {
        setErrorMsg(
          "Lỗi khi cập nhật nhân viên."
        );
        console.error("Error updating staff:", error);
        return; // stop closing popup on error
      }
    } else {
      // Adding new staff
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/nv/dangky`,
          {
            DisplayName: data.DisplayName,
            Email: data.Email,
            Username: data.Email.split("@")[0],
            MatKhau: data.Password,
            VAITRO: data.VAITRO,
            Status: data.Status,
          },
          { headers: { Authorization: `Bearer ${access_token}` } }
        );

        setStaff((prev) => [...prev, res.data]); // use returned data
      } catch (error) {
        console.error("Error adding staff:", error);
        setErrorMsg("Lỗi khi thêm nhân viên.");
        return; // stop closing popup on error
      }
    }

    // Reset popup and error on successful save
    setOpen(false);
    setEditing(null);
    setErrorMsg("");
  };

  // Edit handler
  const handleEdit = (staffMember: StaffMember) => {
    setEditing(staffMember);
    setOpen(true);
    setErrorMsg("");
  };

  // Initialize staff from props
  useEffect(() => {
    setStaff(staffData);
  }, [staffData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => setStaff([]);
  }, []);

  // Filter staff
  const filteredStaff = staff.filter((s) =>
    [s.DisplayName, s.Username, s.Email, s.VAITRO].some((field) =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <main className="space-y-6">
      {/* Search bar and Add button */}
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm..."
            className="pl-10 bg-muted border-0 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
            setErrorMsg("");
          }}
        >
          Thêm nhân viên
        </Button>
      </div>

      {/* Error message */}
      {errorMsg && !open && (
        <div className="bg-red-100 text-red-700 border border-red-300 rounded-lg p-3">
          {errorMsg}
        </div>
      )}

      {/* Staff table */}
      {filteredStaff.length > 0 ? (
        <div className="mt-6">
          <StaffTable staff={filteredStaff} onEdit={handleEdit} />
        </div>
      ) : (
        <p className="text-muted-foreground text-center py-6 mt-6">
          Không có nhân viên nào.
        </p>
      )}

      {/* Popup for add/edit */}
      <StaffPopup
        open={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
          setErrorMsg("");
        }}
        onSave={handleSave}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
        initialData={editing ?? undefined}
      />
    </main>
  );
}
