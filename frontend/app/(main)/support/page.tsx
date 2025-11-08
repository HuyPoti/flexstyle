import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      question: "Làm thế nào để theo dõi đơn hàng của tôi?",
      answer:
        "Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và nhấp vào mục 'Đơn hàng' ở trên thanh tiêu đề",
      category: "Đặt hàng",
    },
    {
      question: "Chính sách đổi trả hàng của FlexStyle như thế nào?",
      answer:
        "Chúng tôi hỗ trợ chính sách đổi trả trong vòng 30 ngày với những điều kiện được đính kèm",
      category: "Đổi trả hàng",
    },
    {
      question: "Đơn hàng của tôi bao nhiêu ngày thì dược giao tới?",
      answer:
        "Đơn hàng của bạn sẽ được giao chậm nhất là 10 ngày, tùy thuộc vào khoảng cách và đơn vị vận tải.",
      category: "Chính sách giao hàng",
    },
    {
      question: "Có giao hàng quốc tế không?",
      answer:
        "FlexStyle hiện chỉ hỗ trợ giao hàng trong nước. Chính sách hỗ trợ quốc tế sẽ được FlexStyle triển khai sau.",
      category: "Chính sách giao hàng",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Bộ phận chăm sóc khách hàng
        </h1>
        <p className="text-xl text-muted-foreground">
          Chúng tôi ở đây vì bạn, vì những gì bạn cần và những gì bạn xứng đáng!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="text-center">
            <MessageCircle className="h-12 w-12 mx-auto text-blue-500" />
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>
              Cổng chat trực tuyến hỗ trợ trực tiếp cho khách hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Badge variant="outline" className="mb-4">
              <Clock className="h-3 w-3 mr-1" />
              Hoạt động 24/7
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Phone className="h-12 w-12 mx-auto text-green-500" />
            <CardTitle>Phone Support</CardTitle>
            <CardDescription>
              Liên hệ trực tiếp với chúng tôi qua số hotline
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium mb-2">+84 903 990 421</p>
            <p className="text-sm text-muted-foreground mb-4">
              Thứ hai - thứ sáu: 6AM-6PM EST
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Mail className="h-12 w-12 mx-auto text-purple-500" />
            <CardTitle>Email Support</CardTitle>
            <CardDescription>
              Gửi email cho chúng tôi để nếu bạn gặp khó khăn
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="font-medium mb-2">huynguyengiapoti@gmail.com</p>
            <p className="text-sm text-muted-foreground mb-4">
              Phản hồi trong vòng 24 giờ
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-1">
        {/* <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>
              Send us a message and we'll get back to you soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Please describe your issue..."
                rows={4}
              />
            </div>
            <Button className="w-full">Send Message</Button>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle>Những câu hỏi thường gặp</CardTitle>
            <CardDescription>
              Dưới đây là những câu hỏi mà khách hàng thường hỏi FlexStyle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search FAQs..." className="pl-10" />
              </div> */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{faq.question}</h3>
                      <Badge variant="outline" className="text-xs">
                        {faq.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
