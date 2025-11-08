import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  RotateCcw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
} from "lucide-react";

export default function ReturnsPage() {
  const returnReasons = [
    "Sản phẩm không đúng size",
    "Sản phẩm không đúng màu sắc",
    "Sản phẩm bị lỗi/hư hỏng",
    "Sản phẩm không giống mô tả",
    "Thay đổi ý định mua hàng",
    "Nhận nhầm sản phẩm",
  ];

  const returnProcess = [
    {
      step: "1",
      title: "Liên hệ yêu cầu đổi trả",
      description:
        "Gọi hotline hoặc gửi email với thông tin đơn hàng và lý do đổi trả",
      icon: Phone,
    },
    {
      step: "2",
      title: "Xác nhận yêu cầu",
      description: "Chúng tôi xác nhận và cung cấp mã đổi trả trong vòng 2 giờ",
      icon: CheckCircle,
    },
    {
      step: "3",
      title: "Đóng gói sản phẩm",
      description:
        "Đóng gói sản phẩm theo hướng dẫn và gửi về địa chỉ được cung cấp",
      icon: RotateCcw,
    },
    {
      step: "4",
      title: "Xử lý hoàn tiền",
      description:
        "Hoàn tiền hoặc gửi sản phẩm thay thế trong vòng 3-5 ngày làm việc",
      icon: Clock,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4">CHÍNH SÁCH ĐỔI TRẢ</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Đổi Trả <span className="text-primary">Dễ Dàng</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          FlexStyle cam kết mang đến trải nghiệm mua sắm tuyệt vời. Nếu bạn
          không hoàn toàn hài lòng với sản phẩm, chúng tôi hỗ trợ đổi trả một
          cách nhanh chóng và thuận tiện.
        </p>
      </div>

      {/* Return Policy Overview */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="text-center">
          <CardContent className="pt-8">
            <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">7 Ngày</h3>
            <p className="text-muted-foreground">
              Thời gian đổi trả kể từ ngày nhận hàng
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-8">
            <RotateCcw className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Miễn Phí</h3>
            <p className="text-muted-foreground">
              Không tính phí đổi trả cho lỗi từ shop
            </p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-8">
            <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">100%</h3>
            <p className="text-muted-foreground">
              Hoàn tiền nếu sản phẩm lỗi từ nhà sản xuất
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Return Conditions */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Điều Kiện Đổi Trả
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Được chấp nhận đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>✅ Sản phẩm còn nguyên tem mác, nhãn hiệu</p>
              <p>✅ Sản phẩm chưa qua sử dụng, giặt ủi</p>
              <p>✅ Sản phẩm không có mùi lạ (nước hoa, thuốc lá...)</p>
              <p>✅ Còn đầy đủ phụ kiện đi kèm</p>
              <p>✅ Có hóa đơn mua hàng hoặc mã đơn hàng</p>
              <p>✅ Trong thời hạn 7 ngày kể từ ngày nhận hàng</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Không được chấp nhận đổi trả
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>❌ Sản phẩm đã qua sử dụng, giặt ủi</p>
              <p>❌ Sản phẩm bị rách, bẩn do lỗi người dùng</p>
              <p>❌ Sản phẩm có mùi lạ do người dùng</p>
              <p>❌ Thiếu phụ kiện, tem mác</p>
              <p>❌ Quá thời hạn 7 ngày</p>
              <p>❌ Sản phẩm sale trên 35% (trừ lỗi từ shop)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Return Reasons */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Lý Do Đổi Trả Phổ Biến
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {returnReasons.map((reason, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {index + 1}
                    </span>
                  </div>
                  <p>{reason}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-16" />

      {/* Return Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Quy Trình Đổi Trả
        </h2>
        <div className="grid md:grid-cols-4 gap-6">
          {returnProcess.map((process, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {process.step}
                </div>
                <process.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">{process.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {process.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Refund Information */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Thời Gian Hoàn Tiền</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>Thanh toán online:</strong> 3-7 ngày làm việc
            </p>
            {/* <p>
              <strong>Thanh toán COD:</strong> 1-3 ngày làm việc
            </p> */}
            <p>
              <strong>Ví điện tử:</strong> 1-2 ngày làm việc
            </p>
            <p className="text-sm text-muted-foreground">
              * Thời gian có thể thay đổi tùy thuộc vào ngân hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Phí Đổi Trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>
              <strong>Lỗi từ shop:</strong> Miễn phí 100%
            </p>
            <p>
              <strong>Đổi size/màu:</strong> 30.000₫
            </p>
            <p>
              <strong>Thay đổi ý định:</strong> 50.000₫
            </p>
            <p className="text-sm text-muted-foreground">
              * Miễn phí đổi trả cho đơn hàng trên 1.000.000₫
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Card className="mb-16 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertCircle className="h-5 w-5" />
            Lưu Ý Quan Trọng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            • Vui lòng quay video unboxing khi nhận hàng để làm bằng chứng nếu
            có vấn đề
          </p>
          <p>
            • Sản phẩm sale trên 35% chỉ được đổi trả nếu có lỗi từ nhà sản xuất
          </p>
          <p>
            • Đối với sản phẩm đặc biệt (đồ lót, trang sức), vui lòng liên hệ
            trước khi đổi trả
          </p>
          <p>
            • Khách hàng chịu phí ship khi gửi hàng về (trừ trường hợp lỗi từ
            shop)
          </p>
        </CardContent>
      </Card>

      {/* Contact Support */}
      <Card className="text-center">
        <CardContent className="pt-8">
          <h3 className="text-2xl font-bold mb-4">Cần Hỗ Trợ Đổi Trả?</h3>
          <p className="text-muted-foreground mb-6">
            Liên hệ ngay với đội ngũ chăm sóc khách hàng để được hỗ trợ nhanh
            chóng
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:19001234"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Hotline: 0903 990 421
            </a>
            <a
              href="mailto:huynguyengiapoti@gmail.com"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Email: huynguyengiapoti@gmail.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
