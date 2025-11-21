import type { NextConfig } from "next";

// Thêm cấu hình cho phép truy cập từ yame.vn
const allowedDomains = ["yame.vn", "res.cloudinary.com"];

const nextConfig: NextConfig = {
  images: {
    domains: allowedDomains,
    // Cho phép remote images qua https từ các hostname động (bảo mật cơ bản vẫn giữ domains danh sách nếu cần)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
