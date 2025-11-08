import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Database,
  AlertTriangle,
} from "lucide-react";

export default function PrivacyPage() {
  const dataTypes = [
    {
      icon: Users,
      title: "Thông tin cá nhân",
      items: [
        "Họ tên, email, số điện thoại",
        "Địa chỉ giao hàng",
        "Ngày sinh, giới tính",
      ],
    },
    {
      icon: Database,
      title: "Thông tin giao dịch",
      items: [
        "Lịch sử mua hàng",
        "Phương thức thanh toán",
        "Địa chỉ thanh toán",
      ],
    },
    {
      icon: Eye,
      title: "Thông tin hành vi",
      items: [
        "Lịch sử duyệt web",
        "Sản phẩm yêu thích",
        "Tương tác với website",
      ],
    },
  ];

  const securityMeasures = [
    {
      icon: Lock,
      title: "Mã hóa dữ liệu",
      description: "Tất cả dữ liệu được mã hóa SSL 256-bit khi truyền tải",
    },
    {
      icon: Shield,
      title: "Bảo mật máy chủ",
      description: "Máy chủ được bảo vệ bởi firewall và hệ thống giám sát 24/7",
    },
    {
      icon: Database,
      title: "Sao lưu định kỳ",
      description: "Dữ liệu được sao lưu tự động và lưu trữ an toàn",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <Badge className="mb-4">CHÍNH SÁCH BẢO MẬT</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Bảo Vệ <span className="text-primary">Quyền Riêng Tư</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          FlexStyle cam kết bảo vệ thông tin cá nhân của khách hàng. Chúng tôi
          tuân thủ nghiêm ngặt các quy định về bảo mật dữ liệu và quyền riêng
          tư.
        </p>
        <p className="text-sm text-muted-foreground mt-4">
          Cập nhật lần cuối: 15/01/2024
        </p>
      </div>

      {/* Data Collection */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Thông Tin Chúng Tôi Thu Thập
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {dataTypes.map((type, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <type.icon className="h-5 w-5 text-primary" />
                  {type.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {type.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex items-start gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Usage */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Mục Đích Sử Dụng Thông Tin
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Cung cấp dịch vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Xử lý đơn hàng và giao hàng</p>
              <p>• Hỗ trợ khách hàng</p>
              <p>• Xác thực tài khoản</p>
              <p>• Quản lý thanh toán</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cải thiện trải nghiệm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Cá nhân hóa nội dung</p>
              <p>• Gợi ý sản phẩm phù hợp</p>
              <p>• Phân tích hành vi người dùng</p>
              <p>• Cải thiện website</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Marketing & Truyền thông</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Gửi email khuyến mãi</p>
              <p>• Thông báo sản phẩm mới</p>
              <p>• Chương trình ưu đãi</p>
              <p>• Khảo sát ý kiến</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tuân thủ pháp luật</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p>• Báo cáo thuế</p>
              <p>• Tuân thủ quy định</p>
              <p>• Phòng chống gian lận</p>
              <p>• Bảo vệ quyền lợi</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-16" />

      {/* Security Measures */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Biện Pháp Bảo Mật
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {securityMeasures.map((measure, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-8">
                <measure.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{measure.title}</h3>
                <p className="text-muted-foreground">{measure.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Sharing */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Chia Sẻ Thông Tin
        </h2>
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-green-600">
                  Chúng tôi KHÔNG chia sẻ với:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Bên thứ ba không liên quan
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Công ty marketing khác
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Tổ chức không được ủy quyền
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">
                  Chúng tôi chỉ chia sẻ với:
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Đối tác vận chuyển (chỉ địa chỉ giao hàng)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Cổng thanh toán (thông tin cần thiết)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Cơ quan pháp luật (khi có yêu cầu)
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Rights */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Quyền Của Khách Hàng
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Quyền truy cập",
              description: "Xem thông tin cá nhân chúng tôi đang lưu trữ",
            },
            {
              title: "Quyền chỉnh sửa",
              description: "Cập nhật, sửa đổi thông tin cá nhân bất kỳ lúc nào",
            },
            {
              title: "Quyền xóa",
              description: "Yêu cầu xóa tài khoản và dữ liệu cá nhân",
            },
            {
              title: "Quyền từ chối",
              description: "Từ chối nhận email marketing và quảng cáo",
            },
            {
              title: "Quyền khiếu nại",
              description: "Khiếu nại về việc xử lý dữ liệu cá nhân",
            },
            {
              title: "Quyền di chuyển",
              description: "Yêu cầu xuất dữ liệu cá nhân sang định dạng khác",
            },
          ].map((right, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-bold mb-2">{right.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {right.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cookies */}
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Chính Sách Cookie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Chúng tôi sử dụng cookie để cải thiện trải nghiệm người dùng và phân
            tích lưu lượng truy cập website.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Cookie cần thiết</h4>
              <p className="text-sm text-muted-foreground">
                Đảm bảo website hoạt động bình thường
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cookie phân tích</h4>
              <p className="text-sm text-muted-foreground">
                Hiểu cách người dùng tương tác với website
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Cookie marketing</h4>
              <p className="text-sm text-muted-foreground">
                Cá nhân hóa quảng cáo và nội dung
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="mb-16 border-amber-200 bg-amber-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Lưu Ý Quan Trọng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>
            • Chính sách này có thể được cập nhật định kỳ để phù hợp với quy
            định pháp luật
          </p>
          <p>• Khách hàng sẽ được thông báo trước khi có thay đổi quan trọng</p>
          <p>
            • Việc tiếp tục sử dụng dịch vụ đồng nghĩa với việc chấp nhận chính
            sách mới
          </p>
          <p>• Đối với trẻ em dưới 16 tuổi, cần có sự đồng ý của phụ huynh</p>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="text-center">
        <CardContent className="pt-8">
          <h3 className="text-2xl font-bold mb-4">
            Có Thắc Mắc Về Quyền Riêng Tư?
          </h3>
          <p className="text-muted-foreground mb-6">
            Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về chính sách
            bảo mật
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:huynguyengiapoti@gmail.com"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Email: huynguyengiapoti@gmail.com
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              Liên Hệ Trực Tiếp
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
