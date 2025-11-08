"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Briefcase, Users, List } from "lucide-react";

import AccountListPopup from "@/components/admin/admin-popupAcc";
import { useState } from "react";
import { NhanVien } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";

export default function PositionsPage({ initData }: { initData: NhanVien[] }) {
  const [data] = useState<NhanVien[]>(initData);
  const positions = [
    {
      name: "Quản lý doanh nghiệp",
      code: "QLDN",
      department: "Quản lý",
      level: "Cấp cao",
      employees: data.filter((acc) => acc.VAITRO === "QLDN").length,
      status:
        data.filter((acc) => acc.VAITRO === "QLDN" && acc.Status === "ACTIVE")
          .length > 0
          ? "active"
          : "inactive",
    },
    {
      name: "Nhân viên vận hành",
      code: "NVVH",
      department: "Vận hành",
      level: "Nhân viên",
      employees: data.filter((acc) => acc.VAITRO === "NVVH").length,
      status:
        data.filter((acc) => acc.VAITRO === "NVVH" && acc.Status === "ACTIVE")
          .length > 0
          ? "active"
          : "inactive",
    },
    {
      id: "POS-003",
      name: "Chăm sóc khách hàng",
      code: "NVCSKH",
      department: "Dịch vụ",
      level: "Nhân viên",
      employees: data.filter((acc) => acc.VAITRO === "NVCSKH").length,
      status:
        data.filter((acc) => acc.VAITRO === "NVCSKH" && acc.Status === "ACTIVE")
          .length > 0
          ? "active"
          : "inactive",
    },
  ];
  const [open, setOpen] = useState(false);
  const [selectedTypeData, setSelectedTypeData] = useState<string>("");

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "Cấp cao":
        return <Badge className="bg-purple-600">Cấp cao</Badge>;
      case "Nhân viên":
        return <Badge variant="outline">Nhân viên</Badge>;
      default:
        return <Badge>Khác</Badge>;
    }
  };

  return (
    <>
      <AccountListPopup
        open={open}
        onClose={() => setOpen(false)}
        accounts={data.filter((acc) =>
          selectedTypeData ? acc.VAITRO === selectedTypeData : true
        )}
        role={selectedTypeData}
      />
      <div className="space-y-6">
        {/* <div className="flex items-center justify-between">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Tìm kiếm..."
              className="pl-10 bg-muted border-0"
            />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Thêm chức vụ
          </Button>
        </div> */}

        <Card>
          <CardHeader>
            <CardTitle>Danh sách chức vụ</CardTitle>
            <CardDescription>
              Quản lý thông tin chức vụ và phân cấp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  {/* <TableHead>Mã chức vụ</TableHead> */}
                  <TableHead>Tên chức vụ</TableHead>
                  <TableHead>Mã code</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Cấp bậc</TableHead>
                  <TableHead>Số nhân viên</TableHead>
                  {/* <TableHead>Mức lương</TableHead> */}
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={uuidv4()}>
                    {/* <TableCell className="font-medium">{position.id}</TableCell> */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <span className="font-medium">{position.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {position.code}
                      </code>
                    </TableCell>
                    <TableCell>{position.department}</TableCell>
                    <TableCell>{getLevelBadge(position.level)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{position.employees}</span>
                      </div>
                    </TableCell>
                    {/* <TableCell className="text-sm">{position.salary}</TableCell> */}
                    <TableCell>
                      <Badge className="bg-green-600">Hoạt động</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setOpen(true);
                            setSelectedTypeData(position.code);
                          }}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
