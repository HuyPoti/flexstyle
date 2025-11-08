# Flex Style Monorepo

Ứng dụng thương mại điện tử gồm Backend (NestJS + Prisma + PostgreSQL) và Frontend (Next.js 15 + Supabase Auth + Tailwind).

## 1. Kiến trúc

```
flex-style/
  backend/        NestJS API (Prisma ORM, Swagger, PostgreSQL)
  frontend/       Next.js App Router (Supabase Auth, UI components)
  README.md       (tài liệu gốc - bạn đang đọc)
```

## 2. Yêu cầu hệ thống

| Thành phần | Phiên bản khuyến nghị   |
| ---------- | ----------------------- |
| Node.js    | >= 20.x (LTS)           |
| NPM        | >= 10.x (cài cùng Node) |
| PostgreSQL | >= 14                   |
| Git        | Mới nhất                |

Tùy chọn: pnpm (nhanh hơn npm) `npm i -g pnpm`.

## 3. Biến môi trường

### Backend (`backend/.env`)

| Biến         | Ý nghĩa                                | Ví dụ                                              |
| ------------ | -------------------------------------- | -------------------------------------------------- |
| DATABASE_URL | Chuỗi kết nối PostgreSQL Prisma dùng   | postgres://user:password@localhost:5432/flex_style |
| PORT         | Cổng API (mặc định 8080 nếu không set) | 8080                                               |

Tạo file `backend/.env`:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/flex_style
PORT=8080
```

### Frontend (`frontend/.env.local`)

| Biến                                  | Ý nghĩa                  | Lưu ý            |
| ------------------------------------- | ------------------------ | ---------------- |
| NEXT_PUBLIC_SUPABASE_URL              | URL Supabase Project     | Public (exposed) |
| NEXT_PUBLIC_SUPABASE_ANON_KEY         | Public anon key          | Public (exposed) |
| NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY | Private Service Role Key | Private          |
| N8N_CHAT_URL                          | n8n Webhook URL          | Public (exposed) |

Tạo file `frontend/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Nếu bạn dùng Supabase local (Docker):

```
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

### Cách lấy các key cần thiết để setup Supabase:

#### 1 Supabase URL

- Dùng để kết nối instance Supabase của bạn
- Vào dashboard trên Supabase -> Project Setting -> Data API -> Project URL

#### 2 Supabase Anon Key (Public API Key)

- Dùng cho Frontend để xác thưc người dùng, lấy dữ liệu công khai
- Vào dashboard trên Supabase -> Project Setting -> API Keys -> Anon Key

#### 3 Supabase Service Role Key (Private API Key)

- Dùng cho Backend để có toàn quyền CRUD, bypass RLS
- Vào dashboard trên Supabase -> Project Setting -> API Keys -> Service Role Key

#### 4 Database Connection String

- Dùng để NestJS + Prisma kết nối trực tiếp tới Supabase
- Vào dashboard trên Supabase -> chọn Connect -> Connection String -> Direct Connection
- Connection string có dạng như sau: `postgresql://postgres:[YOUR-PASSWORD]@db.kehjhwwoaxblvocxwkiq.supabase.co:5432/postgres`
- Trong đó `[YOUR-PASSWORD]` là nơi mà ta điền Database Password của mình vào

#### 5 Database Password

- Dùng để xác thực kết nối
- Vào dashboard trên Supabase -> Project Setting -> Database -> Reset database password (Lưu ý là Database Password chỉ xem được 1 lần)

## 4. Khởi tạo cơ sở dữ liệu PostgreSQL

### 4.1 Tạo database

Mở PowerShell (Windows):

```powershell
psql -U postgres -c "CREATE DATABASE flex_style;" # nếu đã cài PostgreSQL và thêm vào PATH
```

Nếu chưa có `psql`, mở ứng dụng pgAdmin hoặc cài đặt PostgreSQL tại: https://www.postgresql.org/download/

### 4.2 Chạy migration Prisma

```powershell
cd backend
npm install
npx prisma migrate deploy   # hoặc: npx prisma migrate dev --name init
```

Sinh client:

```powershell
npx prisma generate
```

(Optional) Mở Prisma Studio kiểm tra dữ liệu:

```powershell
npx prisma studio
```

## 5. Cài đặt & chạy dự án

### 5.1 Clone & cài đặt

```powershell
# Clone
git clone <REPO_URL> flex-style
cd flex-style

# Backend deps
cd ./backend
cp .env.example .env
npm i
npx prisma migrate dev --name init
npm run start:dev

# Frontend deps
cd ./frontend
cp .env.example .env.local
npm i
npm run dev
```

### 5.2 Chạy song song (mở 2 cửa sổ PowerShell)

Cửa sổ 1 (API):

```powershell
cd backend
npm run start:dev
```

API phục vụ tại: http://localhost:8080/api
Swagger: http://localhost:8080/api/docs

Cửa sổ 2 (Web):

```powershell
cd frontend
npm run dev
```

Frontend tại: http://localhost:3000

## 6. Build production

### Backend

```powershell
cd backend
npm run build
npm run start:prod
```

Artifact nằm trong thư mục `backend/dist`.

### Frontend

```powershell
cd frontend
npm run build
npm start
```

Build output tại `.next/` (Next.js tự phục vụ).

## 7. Cấu hình CORS

Backend hiện cho phép origin: `http://localhost:3000` (xem `src/main.ts`). Nếu deploy domain khác, cập nhật origin:

```ts
app.enableCors({
  origin: ["https://your-domain.com", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});
```

## 8. Debug & Kiểm tra

| Hành động         | Lệnh                                   |
| ----------------- | -------------------------------------- |
| Unit test backend | `npm run test`                         |
| E2E test backend  | `npm run test:e2e`                     |
| Coverage          | `npm run test:cov`                     |
| eslint + fix      | `npm run lint` (frontend hoặc backend) |
| Format (backend)  | `npm run format`                       |

## 9. Swagger

Sau khi backend chạy: mở http://localhost:8080/api/docs để xem tài liệu API.

## 10. Seed dữ liệu (Tùy chọn)

Thêm file `prisma/seed.ts` và trong `package.json` thêm script:

```json
"prisma": { "seed": "ts-node prisma/seed.ts" }
```

Rồi chạy:

```powershell
npx prisma db seed
```

## 11. Vấn đề thường gặp (Troubleshooting)

| Vấn đề                    | Nguyên nhân                        | Cách xử lý                         |
| ------------------------- | ---------------------------------- | ---------------------------------- |
| ECONNREFUSED postgres     | DB chưa chạy                       | Khởi động PostgreSQL service       |
| Prisma migrate lỗi SSL    | Sai chuỗi connection               | Kiểm tra `DATABASE_URL`            |
| 404 /api/docs             | Backend chưa chạy hoặc prefix khác | Kiểm tra log backend               |
| Supabase auth không login | Thiếu env hoặc cookie              | Kiểm tra `.env.local` & middleware |
| CORS lỗi                  | Origin không khớp                  | Cập nhật `enableCors`              |

<!-- ## 12. Deploy gợi ý
- Backend: Docker + Render / Railway / AWS ECS / NestJS Mau.
- Database: Supabase (Postgres managed) hoặc Neon / RDS.
- Frontend: Vercel. Cần set env: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Cập nhật biến `DATABASE_URL` cho backend (ví dụ dùng Supabase Postgres connection string). -->

<!-- ## 13. Nâng cấp tương lai (gợi ý)
- Thêm Auth Guard thực sự (Hiện Supabase guard comment out).
- Thêm script seed dữ liệu mẫu (danh mục, sản phẩm).
- Chuẩn hoá logging (Winston + Pino).
- Thêm docker-compose orchestrate Postgres + backend + frontend.
- Tách layer repository rõ ràng hơn (hiện mới có một repository ví dụ). -->

<!-- ## 14. Quick Start Nhanh
```powershell
git clone <REPO_URL> flex-style
cd flex-style
# Backend
cd backend; cp .env.example .env  # (tự tạo nếu chưa có)
npm i
npx prisma migrate dev --name init
npm run start:dev
# Frontend (cửa sổ khác)
cd ../frontend
cp .env.example .env.local  # (tự tạo nếu chưa có)
npm i
npm run dev
``` -->

<!-- ## 15. Liên hệ / Hỗ trợ
Cứ tiếp tục hỏi trong chat này nếu bạn cần thêm các script tự động, Docker hoá hoặc CI/CD. -->

---

Chúc bạn setup thành công 🚀
