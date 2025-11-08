-- Manual migration to update TrangThaiDonHang enum
-- WARNING: This migration will map existing data to new enum values

-- Step 1: Drop default value first
ALTER TABLE "TINHTRANGDONHANG" ALTER COLUMN "TrangThai" DROP DEFAULT;

-- Step 2: Rename old enum
ALTER TYPE "TrangThaiDonHang" RENAME TO "TrangThaiDonHang_old";

-- Step 3: Create new enum with updated values
CREATE TYPE "TrangThaiDonHang" AS ENUM ('CHUA_GIAO', 'DANG_GIAO', 'DA_GIAO', 'HUY', 'LOI', 'XAC_NHAN_LOI');

-- Step 4: Update column to use new enum and map old values to new values
ALTER TABLE "TINHTRANGDONHANG" 
  ALTER COLUMN "TrangThai" TYPE "TrangThaiDonHang" 
  USING (
    CASE "TrangThai"::text
      WHEN 'DANG_XU_LY' THEN 'CHUA_GIAO'
      WHEN 'DANG_GIAO_HANG' THEN 'DANG_GIAO'
      WHEN 'HOAN_TAT' THEN 'DA_GIAO'
      WHEN 'HUY' THEN 'HUY'
      ELSE 'CHUA_GIAO'
    END
  )::"TrangThaiDonHang";

-- Step 5: Set new default value
ALTER TABLE "TINHTRANGDONHANG" ALTER COLUMN "TrangThai" SET DEFAULT 'CHUA_GIAO'::"TrangThaiDonHang";

-- Step 6: Drop old enum
DROP TYPE "TrangThaiDonHang_old";
