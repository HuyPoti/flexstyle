import { getAccessToken, getGioHang, getUserId } from "@/lib/userInfo";
import MainPage from "./MainPage";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/sanpham?skip=0&take=10&includeSizes=true`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// async function fetchThongBaoVC(access_token: string) {
//   let setVouchers: Voucher[] = [];
//   const res = await fetch("http://localhost:8080/api/thongbao/voucher", {
//     headers: {
//       Authorization: `Bearer ${access_token}`,
//     },
//     cache: "no-store",
//   });
//   if (res.status !== 200 && res.status !== 201) {
//     console.log("Failed to fetch voucher notifications", res);
//     return [];
//   } else {
//     const {data} = await res.json();
//     if (Array.isArray(data)) {
//       for (const note of data) {
//         const voucher = await fetch(
//           `http://localhost:8080/api/voucher/${note.MaVoucher}`
//         );
//         if (voucher.status === 200 || voucher.status === 201) {
//           const {data} = await voucher.json();
//           setVouchers.push(data);
//         } else {
//           console.log("Lỗi khi lấy thông tin voucher");
//         }
//       }
//     }
//     else{
//       console.log("vouchers is not an array:", data);
//     }
//   }
//   console.log("setVouchers", setVouchers);
//   return setVouchers;
// }

// async function fetchThongBaoSK(access_token: string) {
//   let setSukienuudai: SuKienUuDai[] = [];
//   const res = await fetch("http://localhost:8080/api/thongbao/sukienuudai", {
//     headers: {
//       Authorization: `Bearer ${access_token}`,
//     },
//     cache: "no-store",
//   });
//   if (res.status !== 200 && res.status !== 201) {
//     console.log("Failed to fetch sự kiện ưu đãi notifications");
//     return [];
//   } else {
//     const {data} = await res.json();
//     if (Array.isArray(data)) {
//       for (const note of data) {
//         const sukienuudai = await fetch(
//           `http://localhost:8080/api/sukienuudai/${note.MaSK}`
//         );
//         if (sukienuudai.status === 200 || sukienuudai.status === 201) {
//           const {data} = await sukienuudai.json();
//           setSukienuudai.push(data);
//         } else {
//           console.log("Lỗi khi lấy thông tin sự kiện ưu đãi", sukienuudai);
//         }
//       }
//     }
//   }
//   console.log("setSukienuudai", setSukienuudai);
//   return setSukienuudai;
// }

export default async function MainCarousel() {
  const products = await getProducts();
  const userId = await getUserId();
  // console.log("Có load");
  let gioHang = { data: [] };
  // let notificationsVoucher: Voucher[] = [];
  // let notificationsSukienuudai: SuKienUuDai[] = [];
  if (userId) {
    const accessToken = await getAccessToken();
    // notificationsVoucher = await fetchThongBaoVC(String(accessToken));
    // notificationsSukienuudai = await fetchThongBaoSK(String(accessToken));
    gioHang = await getGioHang(String(userId), String(accessToken));
  }
  return (
    <div>
      <MainPage
        key={products}
        initialProducts={products.data}
        initialCartItems={gioHang.data ?? []}
        // initialNotificationsVoucher={notificationsVoucher}
        // initialNotificationsSukienuudai={notificationsSukienuudai}
      />
    </div>
  );
}
