import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users, Award, Globe, Heart, Target, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Khách hàng hài lòng", value: "50,000+" },
    { icon: Globe, label: "Quốc gia phục vụ", value: "Việt Nam" },
    { icon: Award, label: "Năm kinh nghiệm", value: "2+" },
    { icon: Heart, label: "Sản phẩm yêu thích", value: "100+" },
  ];

  const values = [
    {
      icon: Target,
      title: "Chất lượng hàng đầu",
      description:
        "Chúng tôi cam kết mang đến những sản phẩm thời trang chất lượng cao nhất với giá cả hợp lý.",
    },
    {
      icon: Heart,
      title: "Khách hàng là trung tâm",
      description:
        "Sự hài lòng của khách hàng là ưu tiên số một trong mọi hoạt động kinh doanh của chúng tôi.",
    },
    {
      icon: Zap,
      title: "Đổi mới không ngừng",
      description:
        "Luôn cập nhật xu hướng mới nhất và áp dụng công nghệ tiên tiến để phục vụ khách hàng tốt hơn.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <Badge className="mb-4 ">VỀ CHÚNG TÔI</Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Câu Chuyện Của <span className="text-primary">FlexStyle</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Từ năm 2014, FlexStyle đã trở thành điểm đến tin cậy cho những ai yêu
          thích thời trang. Chúng tôi tự hào mang đến những sản phẩm chất lượng
          cao với phong cách hiện đại, phù hợp với mọi cá tính và hoàn cảnh.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <stat.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
              <p className="text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Story Section */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6">Hành Trình Của Chúng Tôi</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              FlexStyle được thành lập với một tầm nhìn đơn giản nhưng mạnh mẽ:
              làm cho thời trang chất lượng cao trở nên dễ tiếp cận với mọi
              người. Bắt đầu từ một cửa hàng nhỏ tại TP.Hồ Chí Minh, chúng tôi
              đã phát triển thành một thương hiệu được yêu thích trên toàn quốc.
            </p>
            <p>
              Với đội ngũ thiết kế tài năng và am hiểu sâu sắc về xu hướng thời
              trang quốc tế, chúng tôi không ngừng sáng tạo để mang đến những bộ
              sưu tập độc đáo, phù hợp với phong cách sống hiện đại của người
              Việt.
            </p>
            <p>
              Hôm nay, FlexStyle tự hào phục vụ hàng chục nghìn khách hàng mỗi
              tháng, với hệ thống cửa hàng trải dài khắp cả nước và nền tảng
              thương mại điện tử hiện đại, mang đến trải nghiệm mua sắm tuyệt
              vời nhất.
            </p>
          </div>
        </div>
        <div className="relative">
          <Image
            src="/modern-fashion-store.png"
            alt="FlexStyle Interior"
            className="rounded-lg shadow-lg w-full"
            width={600}
            height={400}
          />
        </div>
      </div>

      <Separator className="my-16" />

      {/* Values Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Giá Trị Cốt Lõi</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Những giá trị này định hướng mọi hoạt động của chúng tôi và tạo nên sự
          khác biệt của FlexStyle
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {values.map((value, index) => (
          <Card
            key={index}
            className="text-center hover:-translate-y-5 hover:scale-95 transition"
          >
            <CardContent className="pt-8">
              <div className="flex items-center justify-center mb-4">
                <value.icon className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Đội Ngũ Của Chúng Tôi</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Những con người tài năng và đam mê đứng sau thành công của FlexStyle
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-6">
        {[
          {
            name: "Nguyễn Bảo Huy",
            role: "CEO & Founder",
            image: "bhuy",
          },
          {
            name: "Nguyễn Gia Huy",
            role: "Creative Director",
            image: "ghuy",
          },
          {
            name: "Phan Tuấn Khang",
            role: "Head of Operations",
            image: "khang",
          },
        ].map((member, index) => (
          <Card key={index}>
            <CardContent className="pt-6 text-center">
              <Image
                src={`/${member.image}.png`}
                alt={member.name}
                width={200}
                height={200}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-6 gap-8 mb-16">
        <div className="col-span-1"></div>
        {[
          {
            name: "Nguyễn Hoàng Chương",
            role: "Head of Operations",
            image: "hchuong",
          },
          {
            name: "Ngô Dương Đức Thắng",
            role: "Head of Operations",
            image: "thang",
          },
        ].map((member, index) => (
          <Card key={index} className="col-span-2">
            <CardContent className="pt-6 text-center">
              <Image
                src={`/${member.image}.png`}
                alt={member.name}
                width={200}
                height={200}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-muted-foreground">{member.role}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center bg-muted rounded-lg p-12">
        <h2 className="text-3xl font-bold mb-4">
          Hãy Cùng Chúng Tôi Tạo Nên Phong Cách Riêng
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Khám phá bộ sưu tập mới nhất và tìm kiếm những món đồ hoàn hảo cho
          phong cách của bạn
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 "
          >
            Khám Phá Sản Phẩm
          </Link>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Liên Hệ Với Chúng Tôi
          </a>
        </div>
      </div>
    </div>
  );
}
