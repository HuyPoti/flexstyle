# Setup project

1.Setup Supabase project https://database.new

2.Tạo Nextjs + Supabase App với lệnh npx create-next-app -e with-supabase

3.Đổi tên .env.example thành .env.local sau đó copy-paste Project URL và Publishable key

4.Tạo file utils/supabase/server.ts để tạo một Supabase client lấy thông tin bảo mật từ file .env.local

# JWT, Session, Cookie

- Khi user đăng nhập, Supabase tạo ra 1 session
- Session này chứa JWT, refresh_token (để có thể lấy được JWT mới khi cái cũ hết hạn)
- Supabase gửi session này tới client và được lưu dưới dạng HTTP-only cookie

# Phân biệt createClient() trong client.ts và server.ts

- Sự khác nhau giữa createClient() client.ts và createClient() trong server.ts là 1 bên sử dụng trên Browser (client-side), 1 bên sử dụng trên server (server-side).
- Client-side:
  - Chạy trên browser
  - Dùng để truy vấn với React state, thực hiện CRUD với sự bảo vệ của Row Level Security
- Server-side:
  - Chạy trên server
  - Lấy cookie của user -> xác minh JWT -> xác minh được user (Auth)
  - SSR data fetching (lấy dữ liệu trước khi render trang)
  - Các thao tác bảo mật cho admin

# OAuth trong Supabase

////////////////

npm i geist
npm i @vercel/analytics

npm install recharts

npm install --save-dev @types/recharts

npm install @paypal/react-paypal-js

npm install uuid

npm install --save-dev @types/uuid
