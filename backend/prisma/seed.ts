import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Thêm các lệnh tạo dữ liệu khác ở đây
}

main()
  .catch(async (e) => {
    console.error('❌ Lỗi khi seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});