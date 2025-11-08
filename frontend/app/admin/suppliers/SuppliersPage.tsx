"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, Edit, Truck } from "lucide-react";
import type { Supplier } from "@/lib/types";
import EditNccPopup from "@/components/admin/EditNccPopup";
import AddSupplierPopup from "@/components/admin/AddNcc";

export default function AdminSuppliersPage({ nccs }: { nccs: Supplier[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Supplier | null>(null);
  const [filteredNccs, setFilteredNccs] = useState<Supplier[]>(nccs);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Hoạt động</Badge>;
      case "warning":
        return <Badge className="bg-yellow-600">Cảnh báo</Badge>;
      case "blocked":
        return <Badge className="bg-red-600">Bị khóa</Badge>;
      default:
        return <Badge>Không xác định</Badge>;
    }
  };

  return (
    <>
      <AddSupplierPopup
        open={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        // onCreated={() => {
        //   // Refresh the supplier list or perform any other action
        // }}
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <Button onClick={() => setIsAddPopupOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm NCC
          </Button>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle>Danh sách nhà cung cấp</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 " />
                <Input
                  placeholder="Tìm kiếm nhà cung cấp..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value === "") {
                      setFilteredNccs(nccs);
                      return;
                    }
                    const filteredNccs = nccs.filter(
                      (ncc) =>
                        ncc.DisplayName?.toLowerCase().includes(
                          e.target.value.toLowerCase()
                        ) ||
                        ncc.Email?.toLowerCase().includes(
                          e.target.value.toLowerCase()
                        )
                    );
                    // You can set the filtered list to state if needed
                    setFilteredNccs(filteredNccs);
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <Table className="overflow-x-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Thông tin NCC</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNccs.length > 0 ? (
                  filteredNccs.map((supplier) => (
                    <TableRow key={supplier.MaTK}>
                      {/* <TableCell className="font-medium">{supplier.MaTK}</TableCell> */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Truck className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs font-medium">
                              <code className="bg-muted px-1 rounded">
                                {supplier.DisplayName ?? "NCC không tên"}
                              </code>
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-1 text-xs">
                          {/* <p className="font-medium">{supplier.contact}</p>
                        <p className="font-medium">{supplier.phone}</p> */}
                          <p className="font-medium">
                            {supplier.Email ?? "NCC không email"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-blue-700 text-white"
                        >
                          {supplier.VAITRO}
                        </Badge>
                      </TableCell>
                      {/* <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold">
                          {supplier.totalOrders}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {supplier.totalValue}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold">{supplier.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPerformanceBadge(supplier.performance)}
                    </TableCell> */}
                      <TableCell>{getStatusBadge(supplier.Status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedAccount(supplier);
                              setIsEditPopupOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Không tìm thấy nhà cung cấp nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <EditNccPopup
        open={isEditPopupOpen}
        onClose={() => setIsEditPopupOpen(false)}
        account={selectedAccount}
      />
    </>
  );
}
