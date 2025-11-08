"use client";
import { Gift, Ticket, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
import type { SuKienUuDai, Voucher } from "@/lib/types";
import { useState, useEffect } from "react";

interface EventVoucherSliderProps {
  events: SuKienUuDai[];
  vouchers: Voucher[];
}

const colors = [
  "from-pink-100 to-yellow-100 border-pink-200",
  "from-blue-100 to-green-100 border-blue-200",
  "from-orange-100 to-red-100 border-orange-200",
  "from-purple-100 to-indigo-100 border-purple-200",
];

export default function EventVoucherSlider({
  events,
  vouchers,
}: EventVoucherSliderProps) {
  const slides = [
    ...events.map((e) => ({
      type: "event" as const,
      title: e.TenSK,
      desc: e.MoTa,
      start: new Date(e.NgayPH),
      end: new Date(e.NgayKT),
      percent: e.PhanTramGiam,
      loai: "",
      status: e.TrangThai,
      icon: <Gift className="h-7 w-7 text-yellow-500" />,
    })),
    ...vouchers.map((v) => ({
      type: "voucher" as const,
      title: v.TenVoucher,
      desc: v.MoTa,
      start: new Date(v.NgayBatDau),
      end: new Date(v.NgayKetThuc),
      loai: v.Loai,
      percent: v.Loai === "GiamGia" ? v.SoTien : 0,
      status: v.TrangThai,
      icon: <Ticket className="h-7 w-7 text-pink-500" />,
    })),
  ];
  const [current, setCurrent] = useState(0);
  // Auto-play: only run when there is at least one slide
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setTimeout(() => {
      setCurrent((c) => (slides.length > 0 ? (c + 1) % slides.length : c));
    }, 3500);
    return () => clearTimeout(timer);
  }, [slides.length]);

  // Ensure current index stays valid when slides change
  useEffect(() => {
    if (slides.length === 0) {
      setCurrent(0);
    } else if (current >= slides.length) {
      setCurrent(0);
    }
  }, [slides.length, current]);

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[current];
  const color = colors[current % colors.length];

  return (
    <div
      className={`z-50 w-2/3 ${color}  border rounded-xl shadow-2xl p-6 animate-in slide-in-from-top-2 duration-300 fade-in-50 `}
    >
      <div className="flex items-center mb-3 gap-4">
        {slide.icon}
        <div>
          <h3 className="font-bold text-2xl tracking-wide text-rose-700 drop-shadow-lg">
            {slide.title}
          </h3>
          <span className="text-xs text-pink-600 font-medium">
            {slide.type === "event" ? "Sự kiện ưu đãi" : "Voucher đặc biệt"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Badge
          variant="outline"
          className="bg-white/80 text-orange-600 border-orange-300 text-base px-3 py-1"
        >
          <CalendarDays className="inline w-4 h-4 mr-1 text-orange-400" />
          {slide.start.getDate()}/{slide.start.getMonth() + 1} -{" "}
          {slide.end.getDate()}/{slide.end.getMonth() + 1}
        </Badge>
        <Badge variant="secondary" className="ml-auto text-base px-3 py-1">
          {slide.type === "event"
            ? `${slide.percent}%`
            : `${
                slide.loai === "GiamGia"
                  ? `Giảm ${slide.percent} đ`
                  : "Miễn phí vận chuyển"
              }`}
        </Badge>
      </div>
      <p className="text-base text-gray-700 leading-relaxed mb-4 bg-gradient-to-r from-transparent via-pink-100 to-transparent rounded px-2 py-1 font-semibold">
        {slide.desc}
      </p>
      <div className="flex justify-between items-center">
        {/* <Button
          size="sm"
          className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          asChild
        >
          <Link href={}>
            Xem chi tiết <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button> */}
        {/* <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() =>
              setCurrent((current - 1 + slides.length) % slides.length)
            }
          >
            &lt;
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCurrent((current + 1) % slides.length)}
          >
            &gt;
          </Button>
        </div> */}
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full inline-block ${
              idx === current ? "bg-pink-500" : "bg-gray-300"
            } transition-all`}
          />
        ))}
      </div>
    </div>
  );
}
